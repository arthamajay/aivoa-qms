"""
SQLAlchemy ORM Models for AIVOA.AI Root Cause Analysis (RCA) Module
Compliant with ICH Q7 (API Manufacturing GMP), ICH Q9 (Quality Risk Management),
ICH Q10 (Pharmaceutical Quality System), and FDA 21 CFR Part 11 audit trail expectations.
Compatible with PostgreSQL and MySQL.
"""
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Text, DateTime, ForeignKey, JSON, Enum
)
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()


class InvestigationStatus(str, enum.Enum):
    DRAFT_INTAKE = "DRAFT_INTAKE"
    AI_EXTRACTED = "AI_EXTRACTED"
    UNDER_INVESTIGATION = "UNDER_INVESTIGATION"
    PENDING_QP_REVIEW = "PENDING_QP_REVIEW"
    CAPA_ASSIGNED = "CAPA_ASSIGNED"
    CLOSED_VERIFIED = "CLOSED_VERIFIED"


class CauseVerificationStatus(str, enum.Enum):
    AI_SUGGESTION = "AI_SUGGESTION"
    EVIDENCE_LINKED = "EVIDENCE_LINKED"
    QP_CONFIRMED = "QP_CONFIRMED"
    REJECTED_RULED_OUT = "REJECTED_RULED_OUT"


class DeviationInvestigation(Base):
    __tablename__ = "deviation_investigations"

    id = Column(String(64), primary_key=True, index=True)
    deviation_number = Column(String(64), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default=InvestigationStatus.DRAFT_INTAKE.value)

    # API Manufacturing Specific Metadata (ICH Q7)
    api_name = Column(String(128), nullable=False)
    batch_number = Column(String(64), nullable=False, index=True)
    batch_size = Column(String(64))  # e.g., "450.0 kg"
    process_stage = Column(String(128), nullable=False)  # e.g., Stage III Crystallization, Hydrogenation
    equipment_id = Column(String(128), nullable=False)   # e.g., GLR-204, ANFD-102
    manufacturing_site = Column(String(128), default="Unit II - API Synthesis Block B, Hyderabad")
    date_occurred = Column(String(64), nullable=False)
    date_discovered = Column(String(64), nullable=False)
    reported_by = Column(String(128), nullable=False)

    # Risk & Triage Classification (ICH Q9)
    criticality = Column(String(32), default="Major")    # Critical, Major, Minor
    severity_score = Column(Integer, default=4)          # 1-5
    occurrence_score = Column(Integer, default=3)        # 1-5
    detectability_score = Column(Integer, default=2)     # 1-5
    rpn_score = Column(Integer, default=24)
    batch_disposition_hold = Column(Boolean, default=True)
    cqa_cpp_impacted = Column(String(255))               # Critical Quality Attribute / Process Parameter

    # Structured Narrative & Problem Statement
    problem_statement = Column(Text, nullable=False)
    immediate_containment = Column(Text)
    batch_impact_assessment = Column(Text)

    # Raw Intake Source
    source_type = Column(String(32))  # PDF, EMAIL, TEXT
    source_filename = Column(String(255))
    raw_intake_text = Column(Text)
    groq_model_used = Column(String(64), default="llama-3.3-70b-versatile")

    # Structured Investigation Artifacts (JSON columns for flexible 5 Whys & Fishbone nodes)
    five_whys_chain = Column(JSON, default=list)
    ishikawa_6m = Column(JSON, default=dict)
    missing_evidence_gaps = Column(JSON, default=list)
    supporting_evidence = Column(JSON, default=list)

    # Qualified Person (QP) Sign-Off
    qp_reviewer_name = Column(String(128))
    qp_reviewer_role = Column(String(128))
    qp_signoff_timestamp = Column(DateTime, nullable=True)
    qp_signoff_justification = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    root_causes = relationship("RootCauseCandidate", back_populates="investigation", cascade="all, delete-orphan")
    capa_actions = relationship("CAPARecommendation", back_populates="investigation", cascade="all, delete-orphan")
    audit_logs = relationship("AuditTrailLog", back_populates="investigation", cascade="all, delete-orphan")


class RootCauseCandidate(Base):
    __tablename__ = "root_cause_candidates"

    id = Column(String(64), primary_key=True)
    investigation_id = Column(String(64), ForeignKey("deviation_investigations.id"), nullable=False)
    category_6m = Column(String(64), nullable=False)  # Machine, Method, Material, Measurement, Man, Milieu
    cause_type = Column(String(64), default="Potential Root Cause")  # Primary Root Cause, Contributing Factor
    description = Column(Text, nullable=False)
    ai_confidence = Column(Float, default=0.82)
    supporting_evidence_refs = Column(JSON, default=list)
    verification_test_required = Column(Text)

    # Strict Regulatory Guardrail: Always defaults to AI_SUGGESTION until human QP confirms with evidence
    verification_status = Column(String(50), default=CauseVerificationStatus.AI_SUGGESTION.value)
    confirmed_by_qp = Column(String(128), nullable=True)
    qp_review_notes = Column(Text, nullable=True)

    investigation = relationship("DeviationInvestigation", back_populates="root_causes")


class CAPARecommendation(Base):
    __tablename__ = "capa_recommendations"

    id = Column(String(64), primary_key=True)
    investigation_id = Column(String(64), ForeignKey("deviation_investigations.id"), nullable=False)
    linked_cause_id = Column(String(64), nullable=True)
    action_type = Column(String(32), nullable=False)  # Corrective Action (CA), Preventive Action (PA), Systemic CAPA
    title = Column(String(255), nullable=False)
    rationale_explanation = Column(Text, nullable=False)
    owner_department = Column(String(128), nullable=False)
    due_date = Column(String(64), nullable=False)
    effectiveness_check_metric = Column(Text, nullable=False)
    effectiveness_window_days = Column(Integer, default=90)
    status = Column(String(32), default="AI_PROPOSED")  # AI_PROPOSED, APPROVED, IN_PROGRESS, COMPLETED

    investigation = relationship("DeviationInvestigation", back_populates="capa_actions")


class AuditTrailLog(Base):
    __tablename__ = "audit_trail_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    investigation_id = Column(String(64), ForeignKey("deviation_investigations.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    actor = Column(String(128), nullable=False)
    action = Column(String(128), nullable=False)
    field_changed = Column(String(128))
    previous_value = Column(Text)
    new_value = Column(Text)

    investigation = relationship("DeviationInvestigation", back_populates="audit_logs")
