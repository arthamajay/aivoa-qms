"""
Pydantic Schemas for FastAPI Request/Response Validation & Structured Groq LLM Outputs
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class WhyNode(BaseModel):
    step: int = Field(..., description="Why level 1 through 5")
    question: str = Field(..., description="The 'Why' question asked at this level")
    answer: str = Field(..., description="Evidence-grounded answer")
    evidence_ref: str = Field(..., description="Log, sensor, or batch record reference")
    ai_generated: bool = True
    verified: bool = False


class FishboneFactor(BaseModel):
    id: str
    factor: str
    evidence: str
    likelihood: str = Field(..., description="High, Medium, or Low")
    status: str = Field(default="AI_SUGGESTION", description="AI_SUGGESTION, EVIDENCE_LINKED, QP_CONFIRMED, or RULED_OUT")


class MissingEvidenceItem(BaseModel):
    id: str
    missing_item: str
    why_needed: str
    source_system: str = Field(..., description="e.g., SCADA Historian, LIMS, Metrology Log, BMR")
    priority: str = Field(..., description="Critical, High, Medium")
    resolved: bool = False
    resolution_note: Optional[str] = ""


class RootCauseItem(BaseModel):
    id: str
    category_6m: str
    cause_type: str  # Primary Root Cause | Contributing Factor
    description: str
    ai_confidence: float
    supporting_evidence_refs: List[str]
    verification_test_required: str
    verification_status: str = "AI_SUGGESTION"
    confirmed_by_qp: Optional[str] = None
    qp_review_notes: Optional[str] = ""


class CAPAItem(BaseModel):
    id: str
    linked_cause_id: str
    action_type: str  # Corrective Action (CA) | Preventive Action (PA)
    title: str
    rationale_explanation: str
    owner_department: str
    due_date: str
    effectiveness_check_metric: str
    status: str = "AI_PROPOSED"


class RcaExtractionResponse(BaseModel):
    deviation_number: str
    title: str
    api_name: str
    batch_number: str
    batch_size: Optional[str] = None
    process_stage: str
    equipment_id: str
    manufacturing_site: str
    date_occurred: str
    date_discovered: str
    reported_by: str
    criticality: str
    severity_score: int = Field(..., ge=1, le=5)
    occurrence_score: int = Field(..., ge=1, le=5)
    detectability_score: int = Field(..., ge=1, le=5)
    batch_disposition_hold: bool = True
    cqa_cpp_impacted: str
    problem_statement: str
    immediate_containment: str
    batch_impact_assessment: str
    supporting_evidence: List[Dict[str, Any]]
    five_whys_chain: List[WhyNode]
    ishikawa_6m: Dict[str, List[FishboneFactor]]
    root_causes: List[RootCauseItem]
    missing_evidence_gaps: List[MissingEvidenceItem]
    capa_actions: List[CAPAItem]
    source_type: Optional[str] = None
    source_filename: Optional[str] = None
    qp_reviewer_name: Optional[str] = None
    qp_reviewer_justification: Optional[str] = None


class AnalyzeDocumentRequest(BaseModel):
    raw_text: str
    source_type: str = "TEXT"  # PDF, EMAIL, TEXT
    source_filename: Optional[str] = None
    groq_model: str = "llama-3.3-70b-versatile"
    groq_api_key: Optional[str] = None
