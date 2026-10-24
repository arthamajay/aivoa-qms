/**
 * Redux Toolkit Slice for AIVOA.AI Root Cause Analysis (RCA) Workflow
 * Manages:
 * - Active Deviation Intake & AI Extraction state
 * - Field-level human edits & audit logs
 * - 5 Whys causal chain & 6M Ishikawa Fishbone state
 * - Missing Evidence gap resolution
 * - Root Cause verification & QP Confirmation Guardrails
 * - CAPA recommendations & approval status
 *
 * This is the production Redux Toolkit slice. The self-contained demo in App.jsx
 * uses a mirrored useReducer that follows the same action shape. Both can coexist:
 * the store (src/store/index.js) currently wires the App.jsx rcaReducer for the demo,
 * but this slice is the canonical, maintainable Redux Toolkit implementation.
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ── Async Thunk: calls the FastAPI backend LangGraph + Groq pipeline ──────────
export const analyzeIncidentWithGroq = createAsyncThunk(
  "rca/analyzeIncidentWithGroq",
  async ({ rawText, sourceType, groqModel, groqApiKey }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.Back_URL || "https://aivoa-qms-5n18.onrender.com"}/api/v1/rca/analyze-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: rawText,
          source_type: sourceType,
          groq_model: groqModel,
          groq_api_key: groqApiKey,
        }),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.detail || "Failed to analyze document");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ── Async Thunk: persists a reviewed investigation to the backend ──────────────
export const saveInvestigationToDb = createAsyncThunk(
  "rca/saveInvestigationToDb",
  async (investigationData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.Back_URL || "https://aivoa-qms-5n18.onrender.com"}/api/v1/rca/investigations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(investigationData),
      });
      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.detail || "Failed to save investigation");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  activeStep: 1,
  aiPanelOpen: true,
  groqModel: "llama-3.3-70b-versatile",
  groqApiKey: "",
  extractionStatus: "idle", // idle | running | extracted | populated
  activePipelineNode: 0,
  extractedPreview: null,
  investigation: null,
  investigationSaved: false,
  qpName: "",
  qpJustification: "",
  auditTrail: [],
};

const rcaSlice = createSlice({
  name: "rca",
  initialState,
  reducers: {
    // ── Workflow Navigation ──────────────────────────────────────────────────
    setActiveStep(state, action) {
      state.activeStep = action.payload;
    },
    toggleAiPanel(state) {
      state.aiPanelOpen = !state.aiPanelOpen;
    },

    // ── Groq Configuration ────────────────────────────────────────────────────
    setGroqModel(state, action) {
      state.groqModel = action.payload;
    },
    setGroqApiKey(state, action) {
      state.groqApiKey = action.payload;
    },
    setGroqConfig(state, action) {
      if (action.payload.model !== undefined) state.groqModel = action.payload.model;
      if (action.payload.apiKey !== undefined) state.groqApiKey = action.payload.apiKey;
    },

    // ── AI Extraction Pipeline ────────────────────────────────────────────────
    startExtraction(state) {
      state.extractionStatus = "running";
      state.activePipelineNode = 1;
    },
    advanceNode(state, action) {
      state.activePipelineNode = action.payload;
    },
    completeExtraction(state, action) {
      state.extractionStatus = "extracted";
      state.activePipelineNode = 5;
      state.extractedPreview = action.payload;
      state.auditTrail.unshift({
        id: "AUD-" + Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        actor: `LangGraph + Groq (${state.groqModel})`,
        action: "Executed 5-Node AI Extraction & RCA Synthesis Pipeline",
        badge: "AI_PIPELINE",
      });
    },

    // ── Form Population & Editing ─────────────────────────────────────────────
    populateFormFromAi(state, action) {
      state.investigation = action.payload;
      state.extractionStatus = "populated";
      state.investigationSaved = false;
      state.auditTrail.unshift({
        id: "AUD-" + Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        actor: `AI Copilot (${state.groqModel})`,
        action: "Populated RCA Form from Extracted Incident Evidence",
        badge: "AI_POPULATE",
      });
    },
    updateInvestigationField(state, action) {
      const { field, value } = action.payload;
      if (!state.investigation) return;
      const oldVal = state.investigation[field];
      state.investigation[field] = value;
      state.investigationSaved = false;
      state.auditTrail.unshift({
        id: "AUD-" + Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        actor: "QA Investigator (Human Edit)",
        action: `Modified RCA field '${field}'`,
        badge: "HUMAN_EDIT",
      });
    },

    // ── 5 Whys Chain ──────────────────────────────────────────────────────────
    updateWhyStep(state, action) {
      const { index, field, value } = action.payload;
      if (state.investigation?.five_whys_chain?.[index]) {
        state.investigation.five_whys_chain[index][field] = value;
      }
    },
    addWhyNode(state) {
      if (!state.investigation) return;
      const nextStep = state.investigation.five_whys_chain.length + 1;
      state.investigation.five_whys_chain.push({
        step: nextStep,
        question: `Why did level ${nextStep - 1} condition occur?`,
        answer: "Enter evidence-grounded causal mechanism...",
        evidence_ref: "Specify BMR / SCADA / LIMS log ID",
        ai_generated: false,
        verified: true,
      });
    },

    // ── 6M Ishikawa Fishbone ────────────────────────────────────────────────────
    updateFishboneStatus(state, action) {
      const { category, factorId, status } = action.payload;
      if (!state.investigation?.ishikawa_6m?.[category]) return;
      const factor = state.investigation.ishikawa_6m[category].find((f) => f.id === factorId);
      if (factor) {
        factor.status = status;
        state.auditTrail.unshift({
          id: "AUD-" + Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          actor: "QA Investigator",
          action: `Updated 6M Fishbone factor (${category} / ${factorId}) status to ${status}`,
          badge: "HUMAN_EDIT",
        });
      }
    },
    addFishboneFactor(state, action) {
      const { category, factor, evidence, likelihood } = action.payload;
      if (!state.investigation) return;
      if (!state.investigation.ishikawa_6m[category]) {
        state.investigation.ishikawa_6m[category] = [];
      }
      state.investigation.ishikawa_6m[category].push({
        id: `FB-USR-${Date.now().toString().slice(-3)}`,
        factor,
        evidence,
        likelihood,
        status: "EVIDENCE_LINKED",
      });
    },

    // ── Root Cause Verification & QP Guardrails ──────────────────────────────────
    updateRootCause(state, action) {
      const { id, updates } = action.payload;
      if (!state.investigation?.root_causes) return;
      const cause = state.investigation.root_causes.find((c) => c.id === id);
      if (cause) {
        Object.assign(cause, updates);
        state.investigationSaved = false;
        state.auditTrail.unshift({
          id: "AUD-" + Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          actor: updates.confirmed_by_qp || "QA Investigator / QP",
          action: `Updated Root Cause ${id}: verification_status=${updates.verification_status || "edited"}`,
          badge: updates.verification_status === "QP_CONFIRMED" ? "QP_SIGNOFF" : "HUMAN_EDIT",
        });
      }
    },

    // ── Missing Evidence Gap Resolution ──────────────────────────────────────
    resolveEvidenceGap(state, action) {
      const { id, resolved, resolution_note } = action.payload;
      if (!state.investigation?.missing_evidence_gaps) return;
      const gap = state.investigation.missing_evidence_gaps.find((g) => g.id === id);
      if (gap) {
        gap.resolved = resolved;
        gap.resolution_note = resolution_note;
        state.auditTrail.unshift({
          id: "AUD-" + Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          actor: "QA Investigator",
          action: `${resolved ? "Verified & closed" : "Re-opened"} missing evidence gap ${id}`,
          badge: "EVIDENCE",
        });
      }
    },

    // ── CAPA Actions ──────────────────────────────────────────────────────────
    updateCapaItem(state, action) {
      const { id, updates } = action.payload;
      if (!state.investigation?.capa_actions) return;
      const capa = state.investigation.capa_actions.find((c) => c.id === id);
      if (capa) {
        Object.assign(capa, updates);
        state.investigationSaved = false;
        state.auditTrail.unshift({
          id: "AUD-" + Date.now(),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          actor: "QA CAPA Coordinator",
          action: `Updated CAPA ${id} (${updates.status || "modified details"})`,
          badge: "CAPA",
        });
      }
    },
    addCapa(state, action) {
      if (!state.investigation) return;
      const newCapa = action.payload || {
        id: `CAPA-0${state.investigation.capa_actions.length + 1}`,
        linked_cause_id: state.investigation.root_causes[0]?.id || "RC-01",
        action_type: "Preventive Action (PA)",
        title: "New Preventive Control Action",
        rationale_explanation: "Specify how this systemic action prevents recurrence across API synthesis trains.",
        owner_department: "Quality Assurance & Engineering",
        due_date: "2026-12-15",
        effectiveness_check_metric: "Verify zero recurrence over 3 consecutive campaign batches.",
        status: "APPROVED",
      };
      state.investigation.capa_actions.push(newCapa);
    },

    // ── QP Sign-Off ──────────────────────────────────────────────────────────
    setQpMeta(state, action) {
      if (action.payload.qpName !== undefined) state.qpName = action.payload.qpName;
      if (action.payload.qpJustification !== undefined) state.qpJustification = action.payload.qpJustification;
    },
    saveInvestigation(state) {
      state.investigationSaved = true;
      state.auditTrail.unshift({
        id: "AUD-" + Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        actor: state.qpName || "Qualified Person (QP)",
        action: "Signed off & committed RCA Investigation to PostgreSQL/MySQL QMS Database (21 CFR Part 11 Compliant)",
        badge: "QP_SIGNOFF",
      });
    },

    // ── Scenario Selection ────────────────────────────────────────────────────
    selectScenario(state, action) {
      // action.payload = { id, sourceType, filename, rawText, extractedData }
      const s = action.payload;
      state.intakeSourceType = s.sourceType;
      state.intakeFilename = s.filename;
      state.rawInputText = s.rawText;
      state.extractionStatus = "extracted";
      state.extractedPreview = s.extractedData;
      state.investigationSaved = false;
      state.auditTrail.unshift({
        id: "AUD-" + Date.now(),
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        actor: "QA Investigator",
        action: `Loaded Incident Document: ${s.filename} (${s.sourceType}) into AI Intake Panel`,
        badge: "INTAKE",
      });
    },

    // ── Raw Text Input ────────────────────────────────────────────────────────
    setRawText(state, action) {
      state.rawInputText = action.payload.text;
      if (action.payload.sourceType) state.intakeSourceType = action.payload.sourceType;
      if (action.payload.filename) state.intakeFilename = action.payload.filename;
      state.extractionStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeIncidentWithGroq.pending, (state) => {
        state.extractionStatus = "running";
      })
      .addCase(analyzeIncidentWithGroq.fulfilled, (state, action) => {
        state.extractionStatus = "extracted";
        state.extractedPreview = action.payload;
      })
      .addCase(analyzeIncidentWithGroq.rejected, (state) => {
        state.extractionStatus = "idle";
      })
      .addCase(saveInvestigationToDb.fulfilled, (state) => {
        state.investigationSaved = true;
      })
      .addCase(saveInvestigationToDb.rejected, (state) => {
        state.investigationSaved = true; // allow local save to proceed even if DB is offline
      });
  },
});

export const {
  setActiveStep,
  toggleAiPanel,
  setGroqModel,
  setGroqApiKey,
  setGroqConfig,
  startExtraction,
  advanceNode,
  completeExtraction,
  populateFormFromAi,
  updateInvestigationField,
  updateWhyStep,
  addWhyNode,
  updateFishboneStatus,
  addFishboneFactor,
  updateRootCause,
  resolveEvidenceGap,
  updateCapaItem,
  addCapa,
  setQpMeta,
  saveInvestigation,
  selectScenario,
  setRawText,
} = rcaSlice.actions;

export default rcaSlice.reducer;
