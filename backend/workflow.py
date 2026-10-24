"""
LangGraph + Groq Multi-Node AI Workflow for API Pharmaceutical Root Cause Analysis (RCA)
5-node stateful graph:
  Node 1 (120b): intake_extractor_node       -> API deviation metadata, CQA/CPP, timeline
  Node 2 (20b):  evidence_gap_analyzer_node  -> Missing SCADA/LIMS/CMMS evidence gaps
  Node 3 (120b): rca_investigator_node       -> 5 Whys causal chain + 6M Ishikawa Fishbone
  Node 4 (20b):  root_cause_synthesizer_node -> Ranked root causes (all flagged AI_SUGGESTION)
  Node 5 (120b): capa_recommender_node       -> CA/PA actions with effectiveness metrics

Rate-limit strategy:
  - Nodes 1, 3, 5 use gpt-oss-120b  (8,000 TPM quota)
  - Nodes 2, 4   use gpt-oss-20b    (separate quota)
  - 3-second sleep between nodes lets the TPM window reset
  - invoke_with_retry() handles residual 429s with automatic backoff
"""
import os
import re
import json
import time
from typing import TypedDict, List, Dict, Any, Optional

from dotenv import load_dotenv

# ── Compatibility shim ────────────────────────────────────────────────────────
import langchain
for _attr, _val in [("debug", False), ("verbose", False), ("llm_cache", None)]:
    if not hasattr(langchain, _attr):
        setattr(langchain, _attr, _val)

from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()


# ── State ─────────────────────────────────────────────────────────────────────

class RcaGraphState(TypedDict):
    raw_input_text: str
    source_type: str
    groq_model: str
    groq_api_key: Optional[str]
    extracted_deviation: Dict[str, Any]
    supporting_evidence: List[Dict[str, Any]]
    missing_evidence_gaps: List[Dict[str, Any]]
    five_whys_chain: List[Dict[str, Any]]
    ishikawa_6m: Dict[str, List[Dict[str, Any]]]
    root_causes: List[Dict[str, Any]]
    capa_actions: List[Dict[str, Any]]
    audit_log: List[str]


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_groq_llm(state: RcaGraphState, temperature: float = 0.1, fast: bool = False) -> ChatGroq:
    """
    fast=False -> GROQ_PRIMARY_MODEL (gpt-oss-120b, 8k TPM)
    fast=True  -> GROQ_FAST_MODEL    (gpt-oss-20b,  separate TPM quota)
    """
    api_key = state.get("groq_api_key") or os.getenv("GROQ_API_KEY", "")
    if fast:
        model_name = os.getenv("GROQ_FAST_MODEL", "openai/gpt-oss-20b")
    else:
        model_name = state.get("groq_model") or os.getenv("GROQ_PRIMARY_MODEL", "openai/gpt-oss-120b")
    return ChatGroq(
        groq_api_key=api_key,
        model_name=model_name,
        temperature=temperature,
        max_tokens=2500,
    )


def invoke_with_retry(llm: ChatGroq, messages: list, node_name: str = "unknown", max_retries: int = 6) -> Any:
    """Invokes the LLM with automatic retry on 429 rate-limit errors."""
    import groq as groq_lib
    wait = 8
    for attempt in range(1, max_retries + 1):
        try:
            return llm.invoke(messages)
        except groq_lib.RateLimitError as e:
            if attempt == max_retries:
                raise
            msg = str(e)
            ms_match = re.search(r"try again in ([\d.]+)ms", msg, re.IGNORECASE)
            s_match  = re.search(r"try again in ([\d.]+)s",  msg, re.IGNORECASE)
            if ms_match:
                sleep_for = float(ms_match.group(1)) / 1000 + 2
            elif s_match:
                sleep_for = float(s_match.group(1)) + 2
            else:
                sleep_for = wait
            print(f"  [{node_name}] Rate limited (attempt {attempt}/{max_retries}). Waiting {sleep_for:.1f}s...")
            time.sleep(sleep_for)
            wait = min(wait * 2, 60)
        except Exception:
            raise


def extract_json(text: str, node_name: str = "unknown") -> Dict[str, Any]:
    """Robustly extracts a valid JSON object from LLM output. Handles fences, bare JSON, truncation."""
    if not text:
        raise RuntimeError(f"Node '{node_name}': empty LLM response.")

    def try_parse(s: str) -> Optional[Dict[str, Any]]:
        try:
            result = json.loads(s.strip())
            if isinstance(result, dict):
                return result
        except json.JSONDecodeError:
            pass
        return None

    # Strip markdown fences
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        r = try_parse(fenced.group(1))
        if r is not None:
            return r

    # Whole response
    r = try_parse(text)
    if r is not None:
        return r

    # First { ... } block
    start = text.find("{")
    if start != -1:
        depth, end = 0, -1
        for i, ch in enumerate(text[start:], start):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        if end != -1:
            r = try_parse(text[start:end])
            if r is not None:
                return r

        # Repair truncated JSON
        candidate = text[start:]
        stack = []
        close_map = {"{": "}", "[": "]"}
        for ch in candidate:
            if ch in "{[":
                stack.append(close_map[ch])
            elif ch in "}]" and stack and stack[-1] == ch:
                stack.pop()
        repaired = candidate.rstrip().rstrip(",") + "".join(reversed(stack))
        r = try_parse(repaired)
        if r is not None:
            return r

    raise RuntimeError(
        f"Node '{node_name}': could not parse valid JSON.\nRaw (first 400):\n{text[:400]}"
    )


# ── Node 1 — Intake Extractor (120b) ─────────────────────────────────────────

def intake_extractor_node(state: RcaGraphState) -> Dict[str, Any]:
    """Extracts deviation metadata. Uses compact prompt + truncated doc to stay under 8k TPM."""
    llm = get_groq_llm(state, temperature=0.0, fast=False)

    system_prompt = (
        "You are a Pharmaceutical QA Investigator. "
        "Extract deviation fields from the document and return ONLY a JSON object with keys: "
        "deviation_number, title, api_name, batch_number, process_stage, equipment_id, "
        "manufacturing_site, date_occurred, date_discovered, reported_by, "
        "criticality (Critical/Major/Minor), severity_score (1-5), occurrence_score (1-5), "
        "detectability_score (1-5), cqa_cpp_impacted, problem_statement, "
        "immediate_containment, batch_impact_assessment, "
        "supporting_evidence (array: id, source, timestamp, parameter, observation, verified). "
        "Return ONLY the JSON object, no extra text."
    )
    # Truncate document to ~1600 chars — keeps total prompt under 2500 tokens
    doc = state["raw_input_text"][:1600]

    response = invoke_with_retry(
        llm,
        [SystemMessage(content=system_prompt), HumanMessage(content=doc)],
        node_name="intake_extractor_node",
    )
    parsed = extract_json(response.content, "intake_extractor_node")
    supporting_ev = parsed.pop("supporting_evidence", [])
    time.sleep(3)
    return {
        "extracted_deviation": parsed,
        "supporting_evidence": supporting_ev,
        "audit_log": state.get("audit_log", []) + [
            f"Node 1 (intake_extractor_node): Extracted fields via {state.get('groq_model', 'groq')}"
        ],
    }


# ── Node 2 — Evidence Gap Analyzer (20b fast) ────────────────────────────────

def evidence_gap_analyzer_node(state: RcaGraphState) -> Dict[str, Any]:
    """Identifies missing evidence. Uses fast 20b model (separate TPM quota)."""
    llm = get_groq_llm(state, temperature=0.1, fast=True)

    system_prompt = (
        "You are a GMP Compliance Auditor. Identify missing evidence gaps. "
        "Return ONLY a JSON object with key: missing_evidence_gaps "
        "(array: id, missing_item, why_needed, source_system, priority (Critical/High/Medium), resolved: false)."
    )
    dev = state["extracted_deviation"]
    context = json.dumps({
        "deviation_number": dev.get("deviation_number", ""),
        "process_stage": dev.get("process_stage", ""),
        "problem_statement": str(dev.get("problem_statement", ""))[:300],
        "evidence_collected": [
            {"id": e.get("id"), "source": e.get("source"), "obs": str(e.get("observation",""))[:150]}
            for e in state["supporting_evidence"][:4]
        ],
    })
    response = invoke_with_retry(
        llm,
        [SystemMessage(content=system_prompt), HumanMessage(content=context)],
        node_name="evidence_gap_analyzer_node",
    )
    parsed = extract_json(response.content, "evidence_gap_analyzer_node")
    time.sleep(3)
    return {
        "missing_evidence_gaps": parsed.get("missing_evidence_gaps", []),
        "audit_log": state.get("audit_log", []) + [
            "Node 2 (evidence_gap_analyzer_node): Identified missing evidence gaps"
        ],
    }


# ── Node 3 — RCA Investigator (120b) ─────────────────────────────────────────

def rca_investigator_node(state: RcaGraphState) -> Dict[str, Any]:
    """Builds 5 Whys and 6M Fishbone. Uses compact context to stay under 8k TPM."""
    llm = get_groq_llm(state, temperature=0.15, fast=False)

    system_prompt = (
        "You are a Six Sigma API Process Engineer. "
        "Return ONLY a JSON object with keys: "
        "five_whys_chain (array of 5: step, question, answer, evidence_ref, ai_generated: true, verified: false) and "
        "ishikawa_6m (object with keys Machine, Method, Material, Measurement, Man, Milieu — "
        "each an array of: id, factor, evidence, likelihood (High/Medium/Low), status: 'AI_SUGGESTION'). "
        "Return ONLY the JSON object."
    )
    dev = state["extracted_deviation"]
    context = json.dumps({
        "deviation_number": dev.get("deviation_number", ""),
        "api_name": dev.get("api_name", ""),
        "process_stage": dev.get("process_stage", ""),
        "problem": str(dev.get("problem_statement", ""))[:350],
        "evidence": [
            {"id": e.get("id"), "obs": str(e.get("observation",""))[:150]}
            for e in state["supporting_evidence"][:4]
        ],
    })
    response = invoke_with_retry(
        llm,
        [SystemMessage(content=system_prompt), HumanMessage(content=context)],
        node_name="rca_investigator_node",
    )
    parsed = extract_json(response.content, "rca_investigator_node")
    time.sleep(3)
    return {
        "five_whys_chain": parsed.get("five_whys_chain", []),
        "ishikawa_6m": parsed.get("ishikawa_6m", {}),
        "audit_log": state.get("audit_log", []) + [
            "Node 3 (rca_investigator_node): Generated 5 Whys & 6M Fishbone"
        ],
    }


# ── Node 4 — Root Cause Synthesizer (20b fast) ───────────────────────────────

def root_cause_synthesizer_node(state: RcaGraphState) -> Dict[str, Any]:
    """Synthesizes root causes. All flagged AI_SUGGESTION. Uses fast 20b model."""
    llm = get_groq_llm(state, temperature=0.1, fast=True)

    system_prompt = (
        "You are a Quality Investigation Lead. "
        "Synthesize root causes from 5 Whys and Fishbone. "
        "ALL causes MUST have verification_status = 'AI_SUGGESTION'. "
        "Return ONLY a JSON object with key: root_causes "
        "(array: id, category_6m (Machine/Method/Material/Measurement/Man/Milieu), "
        "cause_type ('Primary Root Cause' or 'Contributing Factor'), "
        "description, ai_confidence (0-1), supporting_evidence_refs (array), "
        "verification_test_required, verification_status: 'AI_SUGGESTION')."
    )
    context = json.dumps({
        "five_whys": [
            {"step": w.get("step"), "answer": str(w.get("answer",""))[:180]}
            for w in state["five_whys_chain"]
        ],
        "fishbone": {
            cat: [{"id": f.get("id"), "factor": str(f.get("factor",""))[:120]}
                  for f in factors[:2]]
            for cat, factors in state["ishikawa_6m"].items()
        },
    })
    response = invoke_with_retry(
        llm,
        [SystemMessage(content=system_prompt), HumanMessage(content=context)],
        node_name="root_cause_synthesizer_node",
    )
    parsed = extract_json(response.content, "root_cause_synthesizer_node")
    time.sleep(3)
    return {
        "root_causes": parsed.get("root_causes", []),
        "audit_log": state.get("audit_log", []) + [
            "Node 4 (root_cause_synthesizer_node): Ranked root causes as AI suggestions"
        ],
    }


# ── Node 5 — CAPA Recommender (120b) ─────────────────────────────────────────

def capa_recommender_node(state: RcaGraphState) -> Dict[str, Any]:
    """Generates CA/PA actions with effectiveness metrics."""
    llm = get_groq_llm(state, temperature=0.15, fast=False)

    system_prompt = (
        "You are a Pharmaceutical CAPA Review Board Chair (ICH Q10). "
        "For each root cause recommend one Corrective Action (CA) and one Preventive Action (PA). "
        "Return ONLY a JSON object with key: capa_actions "
        "(array: id, linked_cause_id, "
        "action_type ('Corrective Action (CA)' or 'Preventive Action (PA)'), "
        "title, rationale_explanation, owner_department, due_date (YYYY-MM-DD), "
        "effectiveness_check_metric, status: 'AI_PROPOSED')."
    )
    context = json.dumps({
        "root_causes": [
            {"id": rc.get("id"), "cause_type": rc.get("cause_type"),
             "description": str(rc.get("description",""))[:250]}
            for rc in state["root_causes"]
        ]
    })
    response = invoke_with_retry(
        llm,
        [SystemMessage(content=system_prompt), HumanMessage(content=context)],
        node_name="capa_recommender_node",
    )
    parsed = extract_json(response.content, "capa_recommender_node")
    return {
        "capa_actions": parsed.get("capa_actions", []),
        "audit_log": state.get("audit_log", []) + [
            "Node 5 (capa_recommender_node): Generated CAPA recommendations"
        ],
    }


# ── Graph assembly ─────────────────────────────────────────────────────────────

def build_rca_langgraph():
    workflow = StateGraph(RcaGraphState)
    workflow.add_node("intake_extractor",       intake_extractor_node)
    workflow.add_node("evidence_gap_analyzer",  evidence_gap_analyzer_node)
    workflow.add_node("rca_investigator",        rca_investigator_node)
    workflow.add_node("root_cause_synthesizer", root_cause_synthesizer_node)
    workflow.add_node("capa_recommender",        capa_recommender_node)

    workflow.set_entry_point("intake_extractor")
    workflow.add_edge("intake_extractor",       "evidence_gap_analyzer")
    workflow.add_edge("evidence_gap_analyzer",  "rca_investigator")
    workflow.add_edge("rca_investigator",        "root_cause_synthesizer")
    workflow.add_edge("root_cause_synthesizer", "capa_recommender")
    workflow.add_edge("capa_recommender",        END)
    return workflow.compile()


rca_graph = build_rca_langgraph()
