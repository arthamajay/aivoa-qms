"""
End-to-end test of the 5-node LangGraph + Groq RCA pipeline.
Run from the backend directory: python run_pipeline_test.py
"""
import os, sys, json
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from workflow import rca_graph

sample = os.path.join(os.path.dirname(__file__), "..", "sample_documents",
                      "DEV-2026-0842_Atorvastatin_OOS_Incident_Report.txt")
with open(sample, "r", encoding="utf-8") as f:
    raw_text = f.read()

print(f"Document loaded: {len(raw_text)} chars")
print("Running 5-node LangGraph + Groq pipeline...\n")

state = {
    "raw_input_text": raw_text,
    "source_type": "TEXT",
    "groq_model": "openai/gpt-oss-120b",
    "groq_api_key": None,
    "audit_log": [],
}

try:
    result = rca_graph.invoke(state)

    dev = result["extracted_deviation"]
    print("=" * 60)
    print(f"DEVIATION NUMBER : {dev.get('deviation_number')}")
    print(f"API NAME         : {dev.get('api_name')}")
    print(f"BATCH NUMBER     : {dev.get('batch_number')}")
    print(f"PROCESS STAGE    : {dev.get('process_stage')}")
    print(f"CRITICALITY      : {dev.get('criticality')}")
    print(f"RPN SCORES       : S={dev.get('severity_score')} O={dev.get('occurrence_score')} D={dev.get('detectability_score')}")
    print(f"CQA/CPP IMPACTED : {str(dev.get('cqa_cpp_impacted', ''))[:90]}...")

    print(f"\n5 WHYS ({len(result['five_whys_chain'])} levels):")
    for w in result["five_whys_chain"]:
        print(f"  #{w.get('step')} Q: {str(w.get('question',''))[:70]}...")
        print(f"       A: {str(w.get('answer',''))[:70]}...")

    print(f"\n6M FISHBONE:")
    for cat, factors in result["ishikawa_6m"].items():
        print(f"  {cat}: {len(factors)} factor(s)")

    print(f"\nROOT CAUSES ({len(result['root_causes'])}):")
    for rc in result["root_causes"]:
        print(f"  [{rc.get('id')}] [{rc.get('cause_type')}] conf={rc.get('ai_confidence')}")
        print(f"       {str(rc.get('description',''))[:80]}...")

    print(f"\nMISSING EVIDENCE GAPS ({len(result['missing_evidence_gaps'])}):")
    for g in result["missing_evidence_gaps"]:
        print(f"  [{g.get('id')}] {g.get('priority')} — {str(g.get('missing_item',''))[:70]}...")

    print(f"\nCAPA ACTIONS ({len(result['capa_actions'])}):")
    for c in result["capa_actions"]:
        print(f"  [{c.get('id')}] {c.get('action_type')} — {str(c.get('title',''))[:70]}...")

    print(f"\nAUDIT LOG:")
    for entry in result["audit_log"]:
        print(f"  ✓ {entry}")

    print("\n" + "=" * 60)
    print("PIPELINE COMPLETED SUCCESSFULLY")

except Exception as e:
    import traceback
    traceback.print_exc()
