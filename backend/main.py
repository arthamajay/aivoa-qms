"""
FastAPI Backend for AIVOA.AI Root Cause Analysis (RCA) Module
-------------------------------------------------------------
Provides REST endpoints for:
1. Uploading PDF / Email / Text deviation documents and running the LangGraph + Groq RCA pipeline
2. Retrieving, editing, and saving RCA investigations to PostgreSQL / MySQL
3. Verifying root causes with supporting evidence & recording Qualified Person (QP) 21 CFR Part 11 sign-off
"""
import os
import io
import uuid
from datetime import datetime
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import asynccontextmanager
from pypdf import PdfReader

from models import Base, DeviationInvestigation, RootCauseCandidate, CAPARecommendation, AuditTrailLog, CauseVerificationStatus
from schemas import AnalyzeDocumentRequest, RcaExtractionResponse
from workflow import rca_graph

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/aivoa_qms")

# SQLite needs check_same_thread=False for FastAPI's sync endpoints
_connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as exc:
        print(f"Database initialization warning (ensure PostgreSQL/MySQL is running): {exc}")
    yield


app = FastAPI(
    title="AIVOA.AI — API Pharmaceutical Root Cause Analysis (RCA) Engine",
    description="AI-Powered Root Cause Analysis & CAPA Workflow using LangGraph, Groq (Llama-3.3-70B / Gemma2-9B), and PostgreSQL/MySQL",
    version="1.0.0",
    lifespan=lifespan,
)

CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,https://aivoa-qms-5n18.onrender.com"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/v1/rca/extract-pdf")
async def extract_from_pdf(
    file: UploadFile = File(...),
    groq_model: str = Form("llama-3.3-70b-versatile"),
    groq_api_key: Optional[str] = Form(None),
):
    """Accepts an incident/investigation PDF document, extracts text via pypdf, and invokes the LangGraph + Groq workflow."""
    content = await file.read()
    reader = PdfReader(io.BytesIO(content))
    extracted_pages = [page.extract_text() or "" for page in reader.pages]
    raw_text = "\n\n".join(extracted_pages).strip()
    if not raw_text:
        raise HTTPException(status_code=400, detail="Could not extract readable text from the uploaded PDF.")

    initial_state = {
        "raw_input_text": raw_text,
        "source_type": "PDF",
        "groq_model": groq_model,
        "groq_api_key": groq_api_key,
        "audit_log": [],
    }
    result = rca_graph.invoke(initial_state)
    return {
        "source_filename": file.filename,
        "raw_text": raw_text,
        **result["extracted_deviation"],
        "supporting_evidence": result["supporting_evidence"],
        "missing_evidence_gaps": result["missing_evidence_gaps"],
        "five_whys_chain": result["five_whys_chain"],
        "ishikawa_6m": result["ishikawa_6m"],
        "root_causes": result["root_causes"],
        "capa_actions": result["capa_actions"],
        "audit_log": result["audit_log"],
    }


@app.post("/api/v1/rca/analyze-text")
async def analyze_text_or_email(payload: AnalyzeDocumentRequest):
    """Accepts pasted investigation text or quality alert email and executes the 5-node LangGraph + Groq RCA pipeline."""
    initial_state = {
        "raw_input_text": payload.raw_text,
        "source_type": payload.source_type,
        "groq_model": payload.groq_model,
        "groq_api_key": payload.groq_api_key,
        "audit_log": [],
    }
    result = rca_graph.invoke(initial_state)
    return {
        "source_filename": payload.source_filename or "pasted_input.txt",
        **result["extracted_deviation"],
        "supporting_evidence": result["supporting_evidence"],
        "missing_evidence_gaps": result["missing_evidence_gaps"],
        "five_whys_chain": result["five_whys_chain"],
        "ishikawa_6m": result["ishikawa_6m"],
        "root_causes": result["root_causes"],
        "capa_actions": result["capa_actions"],
        "audit_log": result["audit_log"],
    }


@app.post("/api/v1/rca/investigations")
def save_investigation(data: RcaExtractionResponse, db: Session = Depends(get_db)):
    """Persists a reviewed and edited RCA investigation, root causes, and CAPAs to PostgreSQL/MySQL."""
    inv_id = f"RCA-{uuid.uuid4().hex[:8].upper()}"
    rpn = data.severity_score * data.occurrence_score * data.detectability_score

    inv = DeviationInvestigation(
        id=inv_id,
        deviation_number=data.deviation_number,
        title=data.title,
        status="UNDER_INVESTIGATION",
        api_name=data.api_name,
        batch_number=data.batch_number,
        batch_size=data.batch_size,
        process_stage=data.process_stage,
        equipment_id=data.equipment_id,
        manufacturing_site=data.manufacturing_site,
        date_occurred=data.date_occurred,
        date_discovered=data.date_discovered,
        reported_by=data.reported_by,
        criticality=data.criticality,
        severity_score=data.severity_score,
        occurrence_score=data.occurrence_score,
        detectability_score=data.detectability_score,
        rpn_score=rpn,
        batch_disposition_hold=data.batch_disposition_hold,
        cqa_cpp_impacted=data.cqa_cpp_impacted,
        problem_statement=data.problem_statement,
        immediate_containment=data.immediate_containment,
        batch_impact_assessment=data.batch_impact_assessment,
        supporting_evidence=data.supporting_evidence,
        five_whys_chain=[w.model_dump() for w in data.five_whys_chain],
        ishikawa_6m={k: [f.model_dump() for f in v] for k, v in data.ishikawa_6m.items()},
        missing_evidence_gaps=[g.model_dump() for g in data.missing_evidence_gaps],
        source_type=data.source_type,
        source_filename=data.source_filename,
        qp_reviewer_name=data.qp_reviewer_name,
        qp_signoff_justification=data.qp_reviewer_justification,
        qp_signoff_timestamp=datetime.utcnow() if data.qp_reviewer_name else None,
    )
    db.add(inv)

    for rc in data.root_causes:
        db.add(RootCauseCandidate(
            id=rc.id,
            investigation_id=inv_id,
            category_6m=rc.category_6m,
            cause_type=rc.cause_type,
            description=rc.description,
            ai_confidence=rc.ai_confidence,
            supporting_evidence_refs=rc.supporting_evidence_refs,
            verification_test_required=rc.verification_test_required,
            verification_status=rc.verification_status,
            confirmed_by_qp=rc.confirmed_by_qp,
            qp_review_notes=rc.qp_review_notes,
        ))

    for capa in data.capa_actions:
        db.add(CAPARecommendation(
            id=capa.id,
            investigation_id=inv_id,
            linked_cause_id=capa.linked_cause_id,
            action_type=capa.action_type,
            title=capa.title,
            rationale_explanation=capa.rationale_explanation,
            owner_department=capa.owner_department,
            due_date=capa.due_date,
            effectiveness_check_metric=capa.effectiveness_check_metric,
            status=capa.status,
        ))

    db.add(AuditTrailLog(
        investigation_id=inv_id,
        actor=data.reported_by,
        action="SAVED_INVESTIGATION_RECORD",
        field_changed="status",
        previous_value="AI_EXTRACTED",
        new_value="UNDER_INVESTIGATION",
    ))

    db.commit()
    return {"status": "saved", "investigation_id": inv_id, "rpn_score": rpn}


@app.get("/api/v1/rca/investigations")
def list_investigations(db: Session = Depends(get_db)):
    """Retrieves a summary list of all saved RCA investigations."""
    investigations = db.query(DeviationInvestigation).order_by(DeviationInvestigation.created_at.desc()).all()
    return [
        {
            "id": inv.id,
            "deviation_number": inv.deviation_number,
            "title": inv.title,
            "api_name": inv.api_name,
            "batch_number": inv.batch_number,
            "status": inv.status,
            "criticality": inv.criticality,
            "rpn_score": inv.rpn_score,
            "created_at": inv.created_at.isoformat() if inv.created_at else None,
        }
        for inv in investigations
    ]


@app.get("/api/v1/rca/investigations/{investigation_id}")
def get_investigation(investigation_id: str, db: Session = Depends(get_db)):
    """Retrieves a full RCA investigation record by ID, including root causes, CAPAs, and audit trail."""
    inv = db.query(DeviationInvestigation).filter(DeviationInvestigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Investigation {investigation_id} not found")

    return {
        "id": inv.id,
        "deviation_number": inv.deviation_number,
        "title": inv.title,
        "status": inv.status,
        "api_name": inv.api_name,
        "batch_number": inv.batch_number,
        "process_stage": inv.process_stage,
        "equipment_id": inv.equipment_id,
        "manufacturing_site": inv.manufacturing_site,
        "date_occurred": inv.date_occurred,
        "date_discovered": inv.date_discovered,
        "reported_by": inv.reported_by,
        "criticality": inv.criticality,
        "severity_score": inv.severity_score,
        "occurrence_score": inv.occurrence_score,
        "detectability_score": inv.detectability_score,
        "rpn_score": inv.rpn_score,
        "batch_disposition_hold": inv.batch_disposition_hold,
        "cqa_cpp_impacted": inv.cqa_cpp_impacted,
        "problem_statement": inv.problem_statement,
        "immediate_containment": inv.immediate_containment,
        "batch_impact_assessment": inv.batch_impact_assessment,
        "supporting_evidence": inv.supporting_evidence,
        "five_whys_chain": inv.five_whys_chain,
        "ishikawa_6m": inv.ishikawa_6m,
        "missing_evidence_gaps": inv.missing_evidence_gaps,
        "root_causes": [
            {
                "id": rc.id,
                "category_6m": rc.category_6m,
                "cause_type": rc.cause_type,
                "description": rc.description,
                "ai_confidence": rc.ai_confidence,
                "supporting_evidence_refs": rc.supporting_evidence_refs,
                "verification_test_required": rc.verification_test_required,
                "verification_status": rc.verification_status,
                "confirmed_by_qp": rc.confirmed_by_qp,
                "qp_review_notes": rc.qp_review_notes,
            }
            for rc in inv.root_causes
        ],
        "capa_actions": [
            {
                "id": capa.id,
                "linked_cause_id": capa.linked_cause_id,
                "action_type": capa.action_type,
                "title": capa.title,
                "rationale_explanation": capa.rationale_explanation,
                "owner_department": capa.owner_department,
                "due_date": capa.due_date,
                "effectiveness_check_metric": capa.effectiveness_check_metric,
                "status": capa.status,
            }
            for capa in inv.capa_actions
        ],
        "audit_trail": [
            {
                "id": log.id,
                "timestamp": log.timestamp.isoformat() if log.timestamp else None,
                "actor": log.actor,
                "action": log.action,
                "field_changed": log.field_changed,
                "previous_value": log.previous_value,
                "new_value": log.new_value,
            }
            for log in inv.audit_logs
        ],
    }
