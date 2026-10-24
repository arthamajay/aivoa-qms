# AIVOA.AI — AI-Powered Root Cause Analysis (RCA) Module for API Manufacturing

## Overview
An end-to-end **AI-Powered Root Cause Analysis (RCA) & CAPA Module** tailored for Active Pharmaceutical Ingredient (API) manufacturers operating under **ICH Q7 (Good Manufacturing Practice for APIs)**, **ICH Q9 (Quality Risk Management)**, **ICH Q10 (Pharmaceutical Quality System)**, and **FDA 21 CFR Part 11**.

This repository contains both:
1. **Full-Stack Production Codebase**:
   - **Frontend (`frontend/`)**: React 18 + Redux Toolkit (`@reduxjs/toolkit`) + Tailwind CSS + Lucide Icons
   - **Backend (`backend/`)**: Python + FastAPI + SQLAlchemy ORM
   - **AI Orchestration (`backend/workflow.py`)**: **LangGraph** 5-node stateful agent workflow powered by **Groq** (`llama-3.3-70b-versatile` and `gemma2-9b-it`)
   - **Database (`backend/models.py`)**: Relational schema compatible with **PostgreSQL** and **MySQL**
2. **Interactive Self-Contained React Application (`aivoa_rca_app.jsx`)**: Runs directly in the browser/Canvas with pre-loaded real-world API manufacturing deviation documents, live Groq API key integration (plus built-in high-precision LangGraph simulation mode), interactive 5 Whys & 6M Fishbone analysis, Missing Evidence gap detection, CAPA recommendations, and Qualified Person (QP) verification guardrails.

## End-to-End API Pharmaceutical Quality Workflow
```
[1. Deviation Intake (PDF / Email / BMR Text)]
        │
        ▼  (LangGraph Node 1: intake_extractor_node via Groq)
[2. AI Extraction & ICH Q9 Risk Triage (CQA/CPP Impact, RPN Score, Quarantine Hold)]
        │
        ▼  (LangGraph Node 2: evidence_gap_analyzer_node)
[3. Supporting Evidence Verification & Missing Evidence / Investigation Gap Detector]
        │
        ▼  (LangGraph Node 3: rca_investigator_node)
[4. Root Cause Analysis: Interactive 5 Whys Chain + 6M Ishikawa Fishbone Diagram]
        │
        ▼  (LangGraph Node 4: root_cause_synthesizer_node + Human-in-the-Loop Guardrail)
[5. Candidate Root Causes & Contributing Factors (Flagged as AI_SUGGESTION until QP Confirmed)]
        │
        ▼  (LangGraph Node 5: capa_recommender_node)
[6. Corrective & Preventive Actions (CAPA) + Effectiveness Check & 21 CFR Part 11 QP Sign-Off]
```

## Quick Start (Full-Stack Local Deployment)

### 1. Backend Setup (Python + FastAPI + LangGraph + Groq + PostgreSQL/MySQL)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure Groq API Key (https://console.groq.com/keys) and PostgreSQL/MySQL URL
cp .env.example .env
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup (React + Redux Toolkit)
```bash
cd frontend
npm install
npm run dev
```
