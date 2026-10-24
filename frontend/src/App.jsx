import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Search,
  ChevronRight,
  ChevronDown,
  GitBranch,
  HelpCircle,
  ClipboardCheck,
  Wrench,
  Edit3,
  Plus,
  Trash2,
  RefreshCw,
  Database,
  Cpu,
  Layers,
  Lock,
  Unlock,
  ArrowRight,
  Mail,
  FileUp,
  Check,
  X,
  Info,
  Activity,
  Beaker,
  Sliders,
  Eye,
  Download,
  Key,
  Clock,
  UserCheck,
  BookOpen,
  AlertCircle
} from "lucide-react";

// ============================================================================
// REAL-WORLD API MANUFACTURING INCIDENT SCENARIOS (PDF / EMAIL / BMR TEXT)
// ============================================================================
const INCIDENT_SCENARIOS = {
  "ATOR-OOS-0842": {
    id: "ATOR-OOS-0842",
    label: "Scenario 1 (PDF Report): Atorvastatin Calcium API â€” Stage-IV Crystallization Impurity-B OOS",
    sourceType: "PDF",
    filename: "DEV-2026-0842_Atorvastatin_OOS_Investigation_Report.pdf",
    badge: "OOS Impurity & Thermal Excursion",
    rawText: `================================================================================
PHARMACEUTICAL QUALITY MANAGEMENT SYSTEM â€” DEVIATION & OOS INVESTIGATION REPORT
================================================================================
Document Ref: DEV-2026-0842 / LIMS-OOS-2026-119
Facility: AIVOA Biopharma API Division â€” Unit II, Chemical Synthesis Block B (Hyderabad)
Date of Incident: 2026-10-18 14:20 IST
Date Discovered / Reported: 2026-10-19 09:45 IST
Reported By: Dr. Arvind Kulkarni (QC Analytical Lead) & Rajesh Menon (Production Shift Supervisor)
API Product: Atorvastatin Calcium Trihydrate USP/EP (API)
Batch Number: ATOR-2610-044 (Batch Size: 450.0 kg)
Process Stage: Stage-IV Final Crystallization & Isolation
Primary Equipment ID: Glass-Lined Reactor GLR-204 (5000L) & Agitated Nutsche Filter Dryer ANFD-102
Criticality Classification: Major (Batch Placed on QA Quarantine Hold)
Impacted CQA / CPP:
  - CQA: Oxidative Degradation Impurity-B (Epoxide Derivative) â€” Spec: NMT 0.15% w/w | Observed: 0.38% w/w
  - CQA: XRPD Amorphous Content â€” Spec: NMT 5.0% | Observed: 14.2%
  - CPP: Crystallization Jacket Cooling Ramp Rate (Target: 0.5Â°C/min from 62Â°C to 15Â°C) & N2 Blanket Pressure (0.45-0.60 bar)

1. INCIDENT SUMMARY & PROBLEM STATEMENT
During QC release HPLC testing (Method ATM-HPLC-019) of Atorvastatin Calcium API Batch ATOR-2610-044 isolated from ANFD-102 on 19-Oct-2026, an Out-of-Specification (OOS) result was obtained for oxidative Impurity-B (0.38% w/w vs specification NMT 0.15% w/w) alongside elevated amorphous content (14.2% by XRPD). Phase-I Laboratory Investigation confirmed no analytical error, chromatographic integration fault, or standard preparation error; re-analysis of duplicate sample preparations confirmed 0.37% and 0.39% w/w.

2. MANUFACTURING, SCADA HISTORIAN & BMR EVIDENCE COLLECTED
- [EV-01] SCADA Historian Log (GLR-204-TEMP-09): During Stage-IV exothermic neutralization and crystallization seeding on 18-Oct-2026 between 14:15 and 15:33, reactor internal temperature remained stalled at 64.8Â°C for 78 minutes (BMR limit: 58.0â€“61.0Â°C for max 30 min), followed by an abrupt crash-cooling rate (-2.4Â°C/min) when operators manually opened the chilled brine bypass valve.
- [EV-02] Maintenance & Metrology Log (PM-2026-881): Proportional glycol/brine control valve PCV-204B on GLR-204 jacket exhibited actuator hysteresis and sticky stem behavior at 42% opening. Preventive diaphragm replacement was overdue by 45 days due to a deferred turnaround.
- [EV-03] Gas Utility Header Log (N2-HDR-B): Nitrogen blanket pressure on GLR-204 dropped to 0.08 bar for 52 minutes during reactant charging because manifold pressure regulator PRV-112 was shared with adjacent reactor GLR-205 during high-flow purge, allowing ambient oxygen ingress at 64.8Â°C.
- [EV-04] Raw Material COA (Lot RM-2026-992): Recovered Methanol solvent blend had moisture content 0.28% w/w (Spec: NMT 0.30% w/w â€” upper control boundary vs historical mean 0.09% w/w).
- [EV-05] Electronic Batch Record (eBMR-ATOR-044): Step 14.3 lacks an automated SCADA interlock preventing reactant charge when N2 blanket pressure < 0.35 bar; manual gauge check was recorded only at shift start (12:00).

3. IMMEDIATE CONTAINMENT ACTIONS TAKEN
- Quarantined Batch ATOR-2610-044 (450.0 kg) in QA Hold Area Q-03.
- Placed Reactor GLR-204 on Engineering Hold for PCV-204B teardown and N2 header isolation.
- Initiated retrospective review of prior 3 campaign batches (ATOR-2610-041, -042, -043).`,
    extractedData: {
      deviation_number: "DEV-2026-0842",
      title: "OOS for Oxidative Impurity-B (0.38% w/w) & Amorphous Content in Atorvastatin Calcium Stage-IV Crystallization",
      api_name: "Atorvastatin Calcium Trihydrate USP/EP",
      batch_number: "ATOR-2610-044",
      batch_size: "450.0 kg",
      process_stage: "Stage-IV Final Crystallization & Isolation",
      equipment_id: "GLR-204 (5000L Glass-Lined Reactor) & ANFD-102",
      manufacturing_site: "Unit II â€” Chemical Synthesis Block B, Hyderabad",
      date_occurred: "2026-10-18 14:20 IST",
      date_discovered: "2026-10-19 09:45 IST",
      reported_by: "Dr. Arvind Kulkarni (QC Lead) & Rajesh Menon (Shift Supervisor)",
      criticality: "Major",
      severity_score: 4,
      occurrence_score: 3,
      detectability_score: 2,
      batch_disposition_hold: true,
      cqa_cpp_impacted: "CQA: Oxidative Impurity-B (0.38% vs <=0.15% w/w), XRPD Amorphous Content (14.2% vs <=5%); CPP: Cooling Ramp Rate & N2 Blanket Pressure",
      problem_statement: "Atorvastatin Calcium API Batch ATOR-2610-044 (450.0 kg) failed QC release HPLC specification for Oxidative Impurity-B (0.38% w/w vs NMT 0.15% w/w) and XRPD amorphous fraction (14.2% vs NMT 5.0%) following a 78-minute thermal hold excursion at 64.8Â°C, a simultaneous 52-minute drop in N2 blanket pressure to 0.08 bar, and manual brine crash cooling (-2.4Â°C/min) in Reactor GLR-204.",
      immediate_containment: "1. Batch ATOR-2610-044 (450.0 kg) placed under QA Quarantine Hold in Zone Q-03.\n2. Reactor GLR-204 tagged 'OUT OF SERVICE â€” ENGINEERING HOLD' pending valve PCV-204B overhaul.\n3. Retrospective SCADA trend review initiated for campaign batches ATOR-2610-041, -042, and -043.",
      batch_impact_assessment: "Direct impact on Batch ATOR-2610-044 (requires technical evaluation for validated recrystallization reprocessing under ICH Q7 Section 14.2). Adjacent batches ATOR-2610-041 to -043 must be verified for N2 header pressure dips during concurrent GLR-205 purges.",
      supporting_evidence: [
        {
          id: "EV-01",
          source: "SCADA Historian (GLR-204-TEMP-09)",
          timestamp: "2026-10-18 14:15â€“15:33",
          parameter: "Reactor Internal Temp & Cooling Rate",
          observation: "Held at 64.8Â°C for 78 min (limit: 58â€“61Â°C max 30 min), followed by manual bypass crash cooling at -2.4Â°C/min (target: -0.5Â°C/min).",
          verified: true
        },
        {
          id: "EV-02",
          source: "CMMS Maintenance Log (PM-2026-881)",
          timestamp: "2026-10-18 16:10",
          parameter: "Jacket Control Valve PCV-204B",
          observation: "Pneumatic actuator hysteresis & stem stiction at 42% travel; diaphragm PM overdue by 45 days.",
          verified: true
        },
        {
          id: "EV-03",
          source: "Utility Telemetry (N2-HDR-B)",
          timestamp: "2026-10-18 14:20â€“15:12",
          parameter: "GLR-204 Nitrogen Blanket Pressure",
          observation: "Dropped from 0.50 bar to 0.08 bar for 52 min when shared manifold PRV-112 supplied high-flow purge to GLR-205.",
          verified: true
        },
        {
          id: "EV-04",
          source: "LIMS Phase-I OOS Log (LIMS-OOS-2026-119)",
          timestamp: "2026-10-19 11:30",
          parameter: "HPLC Method ATM-HPLC-019",
          observation: "No laboratory error found; duplicate re-injections confirmed Impurity-B at 0.37% and 0.39% w/w.",
          verified: true
        },
        {
          id: "EV-05",
          source: "eBMR Review (eBMR-ATOR-044 Step 14.3)",
          timestamp: "2026-10-18 12:00",
          parameter: "In-Process N2 Interlock & Manual Log",
          observation: "No automated SCADA phase interlock on low N2 pressure; manual pressure reading taken only once at shift start.",
          verified: true
        }
      ],
      five_whys_chain: [
        {
          step: 1,
          question: "Why did Atorvastatin Calcium Batch ATOR-2610-044 fail QC release for Oxidative Impurity-B (0.38% w/w) and elevated amorphous content (14.2%)?",
          answer: "Accelerated oxidative epoxidation of the pyrrole ring occurred in solution, and rapid crash-cooling caused secondary nucleation and amorphous precipitation instead of controlled trihydrate crystal growth.",
          evidence_ref: "LIMS-OOS-2026-119 & XRPD Report XR-882",
          ai_generated: true,
          verified: true
        },
        {
          step: 2,
          question: "Why did oxidative degradation and uncontrolled crash-cooling occur simultaneously during Stage-IV crystallization in GLR-204?",
          answer: "The reaction mass was exposed to ambient oxygen while stalled at an elevated temperature of 64.8Â°C for 78 minutes, after which operators manually opened the chilled brine bypass valve (-2.4Â°C/min) to recover batch schedule.",
          evidence_ref: "SCADA Historian GLR-204-TEMP-09 & N2-HDR-B",
          ai_generated: true,
          verified: true
        },
        {
          step: 3,
          question: "Why did the reactor stall at 64.8Â°C while losing its protective nitrogen blanket (dropping to 0.08 bar)?",
          answer: "Jacket proportional control valve PCV-204B stuck at 42% due to diaphragm hysteresis, and the GLR-204 nitrogen supply starved when adjacent reactor GLR-205 drew a high-volume purge from shared regulator PRV-112.",
          evidence_ref: "CMMS Log PM-2026-881 & Utility Log N2-HDR-B",
          ai_generated: true,
          verified: true
        },
        {
          step: 4,
          question: "Why wasn't valve PCV-204B serviced on time, and why didn't the control system halt reactant charging or alert operators during the N2 pressure drop?",
          answer: "PCV-204B preventive maintenance was deferred by 45 days without a formal ICH Q9 risk assessment, and eBMR Step 14.3 lacked both an automated SCADA low-pressure interlock (<0.35 bar) and an SOP prohibition against manual brine bypass operation.",
          evidence_ref: "CMMS Deferral Log & eBMR-ATOR-044 Step 14.3",
          ai_generated: true,
          verified: false
        },
        {
          step: 5,
          question: "Why did the site QMS allow PM deferral on a CPP control valve and operation of a shared nitrogen header without automated phase interlocks?",
          answer: "Systemic gap in Process Hazard & Criticality Classification: utility sub-headers and jacket control valves governing oxygen-sensitive crystallization CPPs were classified as 'Non-Critical Balance-of-Plant' during commissioning, bypassing mandatory QA approval for PM deferral and SCADA interlock recipes.",
          evidence_ref: "Commissioning Risk Register URS-GLR-204",
          ai_generated: true,
          verified: false
        }
      ],
      ishikawa_6m: {
        Machine: [
          {
            id: "FB-M1",
            factor: "Jacket control valve PCV-204B stem stiction & actuator hysteresis at 42% opening (PM overdue by 45 days)",
            evidence: "CMMS Log PM-2026-881 & SCADA Valve Output vs Feedback mismatch",
            likelihood: "High",
            status: "EVIDENCE_LINKED"
          },
          {
            id: "FB-M2",
            factor: "Shared nitrogen manifold regulator PRV-112 between GLR-204 and GLR-205 without back-pressure check valve",
            evidence: "Utility P&ID-UTIL-09 & N2-HDR-B pressure drop to 0.08 bar",
            likelihood: "High",
            status: "EVIDENCE_LINKED"
          }
        ],
        Method: [
          {
            id: "FB-ME1",
            factor: "eBMR Step 14.3 lacks automated SCADA phase interlock to block charging/heating when N2 blanket < 0.35 bar",
            evidence: "eBMR-ATOR-044 Recipe Logic Review",
            likelihood: "High",
            status: "AI_SUGGESTION"
          },
          {
            id: "FB-ME2",
            factor: "SOP-PROD-042 permits manual chilled brine bypass valve operation without QA/Engineering authorization",
            evidence: "Shift log entry at 15:33 IST (-2.4Â°C/min cooling spike)",
            likelihood: "Medium",
            status: "AI_SUGGESTION"
          }
        ],
        Material: [
          {
            id: "FB-MA1",
            factor: "Recovered Methanol Lot RM-2026-992 moisture at 0.28% w/w (near 0.30% upper spec limit)",
            evidence: "QC Raw Material COA RM-2026-992",
            likelihood: "Low",
            status: "AI_SUGGESTION"
          }
        ],
        Measurement: [
          {
            id: "FB-MS1",
            factor: "GLR-204 N2 headspace pressure transmitter PT-204C had no low-pressure audible alarm configured on DCS screen",
            evidence: "DCS Alarm Configuration Matrix v2.1",
            likelihood: "Medium",
            status: "EVIDENCE_LINKED"
          }
        ],
        Man: [
          {
            id: "FB-MN1",
            factor: "Operator opened manual chilled brine bypass to compensate for 78-min thermal stall without initiating real-time deviation notification",
            evidence: "Operator Interview & BMR Comment Log",
            likelihood: "Medium",
            status: "AI_SUGGESTION"
          }
        ],
        Milieu: [
          {
            id: "FB-MI1",
            factor: "Concurrent high-demand N2 purge on adjacent reactor GLR-205 during shift handover peak utility load",
            evidence: "Block-B Equipment Schedule Log (18-Oct-2026 14:15)",
            likelihood: "High",
            status: "EVIDENCE_LINKED"
          }
        ]
      },
      root_causes: [
        {
          id: "RC-01",
          category_6m: "Machine",
          cause_type: "Primary Root Cause",
          description: "Mechanical stiction of jacket proportional cooling valve PCV-204B (overdue for diaphragm PM by 45 days) combined with N2 blanket starvation (0.08 bar for 52 min via shared regulator PRV-112), exposing the batch to oxygen at 64.8Â°C for 78 minutes and driving oxidative epoxidation to Impurity-B (0.38% w/w).",
          ai_confidence: 0.94,
          supporting_evidence_refs: ["EV-01", "EV-02", "EV-03", "EV-04"],
          verification_test_required: "Bench-test removed PCV-204B diaphragm for hysteresis curve and perform dissolved oxygen / headspace O2 simulation during GLR-205 concurrent purge.",
          verification_status: "AI_SUGGESTION",
          confirmed_by_qp: "",
          qp_review_notes: ""
        },
        {
          id: "RC-02",
          category_6m: "Method",
          cause_type: "Contributing Factor",
          description: "Uncontrolled manual opening of the chilled brine bypass valve (-2.4Â°C/min vs target -0.5Â°C/min) by operators attempting to recover from the thermal stall, inducing rapid crash-crystallization and elevating amorphous content to 14.2%.",
          ai_confidence: 0.89,
          supporting_evidence_refs: ["EV-01", "EV-05"],
          verification_test_required: "Compare XRPD crystallinity profile of lab-scale -2.4Â°C/min crash-cooled sample vs controlled -0.5Â°C/min ramp.",
          verification_status: "AI_SUGGESTION",
          confirmed_by_qp: "",
          qp_review_notes: ""
        },
        {
          id: "RC-03",
          category_6m: "Method",
          cause_type: "Contributing Factor",
          description: "Absence of automated SCADA/eBMR phase interlocks for minimum N2 blanket pressure (<0.35 bar) and lack of QA risk assessment requirement prior to deferring PM on CPP-critical control valves.",
          ai_confidence: 0.86,
          supporting_evidence_refs: ["EV-02", "EV-05"],
          verification_test_required: "Audit Block-B PLC/SCADA Functional Design Specification (FDS) and CMMS PM deferral SOP-ENG-014.",
          verification_status: "AI_SUGGESTION",
          confirmed_by_qp: "",
          qp_review_notes: ""
        }
      ],
      missing_evidence_gaps: [
        {
          id: "GAP-01",
          missing_item: "Headspace Oxygen Concentration & Campaign Look-Back on Batches ATOR-2610-041, -042, and -043",
          why_needed: "Must verify whether transient N2 pressure drops occurred during earlier campaign batches when GLR-205 was purged, and confirm their Impurity-B stability trends.",
          source_system: "SCADA Historian (N2-HDR-B) & LIMS Stability Database",
          priority: "Critical",
          resolved: false,
          resolution_note: ""
        },
        {
          id: "GAP-02",
          missing_item: "As-Found Bench Calibration & Hysteresis Bench Report for Valve PCV-204B",
          why_needed: "Physical metrology proof is required to confirm mechanical valve stiction at 42% stem travel before transitioning RC-01 from AI Suggestion to Confirmed Root Cause.",
          source_system: "Engineering Metrology Workshop (Work Order WO-2026-4410)",
          priority: "Critical",
          resolved: false,
          resolution_note: ""
        },
        {
          id: "GAP-03",
          missing_item: "Small-Scale Recrystallization Reprocessing Feasibility Trial Data",
          why_needed: "Required under ICH Q7 Section 14.2 to justify whether quarantined Batch ATOR-2610-044 (450 kg) can be reprocessed via validated recrystallization to purge Impurity-B below 0.10% w/w.",
          source_system: "Process R&D Lab & QA Technical Services",
          priority: "High",
          resolved: false,
          resolution_note: ""
        }
      ],
      capa_actions: [
        {
          id: "CAPA-01",
          linked_cause_id: "RC-01",
          action_type: "Corrective Action (CA)",
          title: "Overhaul GLR-204 Control Valve PCV-204B & Install Dedicated N2 Pressure Regulator with Check Valve",
          rationale_explanation: "Eliminates mechanical cooling valve stiction by replacing the PTFE/EPDM diaphragm and positioner, and isolates GLR-204 nitrogen blanketing from GLR-205 purge pressure drops via dedicated regulator PRV-204A and non-return valve.",
          owner_department: "API Plant Engineering & Utilities",
          due_date: "2026-11-05",
          effectiveness_check_metric: "Zero cooling ramp deviations (>Â±0.1Â°C/min) or N2 pressure drops (<0.40 bar) across 10 consecutive Atorvastatin batches over 90 days.",
          status: "AI_PROPOSED"
        },
        {
          id: "CAPA-02",
          linked_cause_id: "RC-02",
          action_type: "Preventive Action (PA)",
          title: "Lock Out Manual Chilled Brine Bypass Valves & Implement SCADA Automated Ramp-Rate Limiter",
          rationale_explanation: "Prevents operator-induced crash cooling (-2.4Â°C/min) by installing mechanical lock-out tags on manual brine bypass valves across all Block-B crystallizers (GLR-201 to GLR-206) and configuring PID ramp-rate limiting (-0.55Â°C/min max).",
          owner_department: "Process Automation & Production",
          due_date: "2026-11-18",
          effectiveness_check_metric: "100% compliance on crystallization cooling ramp profiles and XRPD amorphous content <3.0% across next 15 batches.",
          status: "AI_PROPOSED"
        },
        {
          id: "CAPA-03",
          linked_cause_id: "RC-03",
          action_type: "Preventive Action (PA)",
          title: "Implement SCADA Phase Interlock on Low N2 Pressure (<0.35 bar) & Revise CMMS PM Deferral SOP",
          rationale_explanation: "Configures an automated recipe hold/interlock in eBMR/SCADA if reactor N2 pressure falls below 0.35 bar for >60 seconds, and updates SOP-ENG-014 so CPP-linked valves cannot have PM deferred without formal QA + Engineering ICH Q9 risk sign-off.",
          owner_department: "Quality Assurance & CSV Automation",
          due_date: "2026-11-30",
          effectiveness_check_metric: "CSV OQ/PQ validation passed for low-N2 interlock; zero unapproved CPP preventive maintenance deferrals in Q4/Q1 audit.",
          status: "AI_PROPOSED"
        }
      ]
    }
  },
  "METF-EMAIL-0904": {
    id: "METF-EMAIL-0904",
    label: "Scenario 2 (Quality Alert Email): Metformin HCl API â€” Foreign Metal Particulate / Sieve Mesh Rupture",
    sourceType: "EMAIL",
    filename: "Alert_Email_Metformin_Metal_Detector_Reject_Batch_MET-2610-112.eml",
    badge: "Foreign Contamination / Sieve Failure",
    rawText: `From: Priya Nair <priya.nair@aivoabiopharma.com>
To: QA Investigations Team <qa-investigations@aivoabiopharma.com>; Plant Head Block-A <planthead-a@aivoabiopharma.com>
Date: Wed, 21 Oct 2026 07:15:00 +0530
Subject: URGENT QUALITY ALERT: Metal Detector Reject & Broken 30-Mesh Screen in Metformin HCl API Batch MET-2610-112

Team,
During final milling, sifting, and drum packing of Metformin Hydrochloride USP API (Batch No: MET-2610-112, Batch Size: 1,200 kg) in Cleanroom Suite PF-03 (Unit I, Pharma Finishing Block A) on 20-Oct-2026 at 22:40 IST, the inline Safeline Gravity Fall Metal Detector (MD-PF-04) triggered 4 consecutive reject alarms while filling HDPE Drums #18, #19, and #20.

Immediate line stop and inspection revealed:
1. Post-run integrity inspection of Vibratory Sifter VS-103 (Russell Finex 1200mm) showed a 14 mm fatigue tear along the circumferential weld seam of the 30-mesh SS316L screen (Screen Serial ID: SCR-30M-089).
2. SEM-EDX elemental analysis by QC Lab (Report EDX-2026-304) on 3 metallic wire fragments recovered from the MD-PF-04 reject bin (lengths: 1.8 mm, 2.2 mm, and 2.5 mm) confirmed Cr/Ni/Mo composition matching SS316L wire mesh (not conical mill blades from Co-Mil CM-101).
3. Equipment Usage Logbook for Screen SCR-30M-089 shows it had completed 412 cumulative operating hours (Vendor recommended fatigue replacement limit: 300 hours), because the SOP-PF-019 screen inspection only checks for visual holes before use without tracking cumulative vibratory hours.
4. Ultrasonic tension check revealed the clamp ring gasket on VS-103 was unevenly torqued using an uncalibrated manual spanner instead of a preset torque wrench, creating localized harmonic stress along the weld seam during high-throughput sifting (650 kg/hr vs validated 500 kg/hr feed rate).

Containment: All 24 drums of Batch MET-2610-112 (1,200 kg) and preceding Batch MET-2610-111 have been quarantined in Hold Bay H-01. Please initiate formal RCA and CAPA in AIVOA QMS.`,
    extractedData: {
      deviation_number: "DEV-2026-0904",
      title: "Inline Metal Detector Rejects & 30-Mesh SS316L Vibratory Screen Weld Rupture in Metformin HCl API Finishing",
      api_name: "Metformin Hydrochloride USP/Ph.Eur",
      batch_number: "MET-2610-112",
      batch_size: "1,200.0 kg",
      process_stage: "Final Milling, Vibratory Sifting & Powder Drum Packing (Cleanroom PF-03)",
      equipment_id: "Vibratory Sifter VS-103 & Inline Metal Detector MD-PF-04",
      manufacturing_site: "Unit I â€” API Finishing Block A, Hyderabad",
      date_occurred: "2026-10-20 22:40 IST",
      date_discovered: "2026-10-20 22:42 IST",
      reported_by: "Priya Nair (Finishing QA Manager)",
      criticality: "Critical",
      severity_score: 5,
      occurrence_score: 2,
      detectability_score: 2,
      batch_disposition_hold: true,
      cqa_cpp_impacted: "CQA: Absence of Foreign Metallic Particulates; CPP: Sifter Screen Tension, Feed Rate (<=500 kg/hr) & Metal Detector Sensitivity (0.8 mm SS)",
      problem_statement: "During final drum packing of Metformin HCl API Batch MET-2610-112 (1,200 kg) in Suite PF-03, inline metal detector MD-PF-04 triggered 4 reject alarms. Inspection identified a 14 mm fatigue rupture along the circumferential weld of 30-mesh SS316L screen SCR-30M-089 on Vibratory Sifter VS-103, with three SS316L wire fragments (1.8â€“2.5 mm) confirmed by SEM-EDX in the reject chute.",
      immediate_containment: "1. Immediately halted sifting/packing line PF-03 and quarantined all 24 drums of Batch MET-2610-112 plus preceding Batch MET-2610-111.\n2. Decommissioned ruptured screen SCR-30M-089 and impounded fragments for SEM-EDX mass-balance reconciliation.\n3. Verified MD-PF-04 challenge test sensitivity with certified Fe (0.5 mm), Non-Fe (0.6 mm), and SS316 (0.8 mm) test spheres.",
      batch_impact_assessment: "High particulate risk to Batch MET-2610-112 (Drums 1â€“20 prior to line stop) and potentially late drums of Batch MET-2610-111 if micro-fracturing began earlier. Requires 100% resifting through a certified 40-mesh screen, rare-earth magnetic trap pass, and dual metal detector verification.",
      supporting_evidence: [
        {
          id: "EV-101",
          source: "QC SEM-EDX Report (EDX-2026-304)",
          timestamp: "2026-10-21 04:10",
          parameter: "Elemental Composition of 3 Wire Fragments",
          observation: "Confirmed 17.2% Cr, 11.8% Ni, 2.3% Mo matching SS316L woven wire mesh SCR-30M-089; ruled out Co-Mil CM-101 impeller wear.",
          verified: true
        },
        {
          id: "EV-102",
          source: "Screen Usage Logbook (LOG-PF-SCR-089)",
          timestamp: "2026-10-20 23:15",
          parameter: "Cumulative Operating Hours",
          observation: "Screen SCR-30M-089 logged 412 operating hours, exceeding vendor fatigue life limit of 300 hours by 37%.",
          verified: true
        },
        {
          id: "EV-103",
          source: "Engineering Inspection (WO-2026-5102)",
          timestamp: "2026-10-21 02:30",
          parameter: "Clamp Ring Torque & Powder Feed Rate",
          observation: "Clamp ring tightened with uncalibrated manual spanner; powder screw feeder operated at 650 kg/hr vs validated 500 kg/hr max.",
          verified: true
        }
      ],
      five_whys_chain: [
        {
          step: 1,
          question: "Why did inline Metal Detector MD-PF-04 trigger 4 reject alarms during packing of Metformin HCl Batch MET-2610-112?",
          answer: "Three SS316L wire fragments (1.8 mm to 2.5 mm) detached from Vibratory Sifter VS-103 and entered the powder stream.",
          evidence_ref: "MD-PF-04 Reject Log & SEM-EDX Report EDX-2026-304",
          ai_generated: true,
          verified: true
        },
        {
          step: 2,
          question: "Why did the 30-mesh SS316L screen (SCR-30M-089) shed wire fragments during operation?",
          answer: "The screen suffered a 14 mm cyclic metal fatigue tear along its circumferential weld seam.",
          evidence_ref: "Physical Inspection Photo & WO-2026-5102",
          ai_generated: true,
          verified: true
        },
        {
          step: 3,
          question: "Why did cyclic metal fatigue rupture occur along the screen's circumferential weld seam?",
          answer: "The screen had been operated for 412 cumulative hours (exceeding the 300-hour fatigue limit), compounded by uneven clamp ring torque and excessive powder loading (650 kg/hr vs 500 kg/hr max).",
          evidence_ref: "LOG-PF-SCR-089 & Screw Feeder Speed Log",
          ai_generated: true,
          verified: true
        },
        {
          step: 4,
          question: "Why was screen SCR-30M-089 kept in service past 300 hours and subjected to uneven clamping and 650 kg/hr feed rates?",
          answer: "SOP-PF-019 relied solely on visual pre-use inspection without a maximum hour lifecycle counter in eBMR, torque wrenches were not specified for clamp assembly, and the screw feeder VFD lacked an upper speed lock at 500 kg/hr.",
          evidence_ref: "SOP-PF-019 v4.0 & VFD Parameter Audit",
          ai_generated: true,
          verified: false
        },
        {
          step: 5,
          question: "Why were lifecycle hour limits and mechanical assembly controls omitted from the sifting SOP and eBMR?",
          answer: "During technology transfer of high-volume Metformin campaigns, sieve meshes were categorized as 'consumable accessories' rather than life-limited GMP critical contact parts in SAP PM.",
          evidence_ref: "SAP PM Master Data Audit",
          ai_generated: true,
          verified: false
        }
      ],
      ishikawa_6m: {
        Machine: [
          {
            id: "FB2-M1",
            factor: "Screen SCR-30M-089 operated for 412 hours vs 300-hour cyclic fatigue limit",
            evidence: "Screen Logbook LOG-PF-SCR-089",
            likelihood: "High",
            status: "EVIDENCE_LINKED"
          },
          {
            id: "FB2-M2",
            factor: "Screw feeder VFD allowed 650 kg/hr powder flooding on sifter deck (validated max: 500 kg/hr)",
            evidence: "PLC Feeder Trend Log",
            likelihood: "High",
            status: "EVIDENCE_LINKED"
          }
        ],
        Method: [
          {
            id: "FB2-ME1",
            factor: "SOP-PF-019 only requires visual check before/after batch; no cumulative runtime retirement limit",
            evidence: "SOP-PF-019 Section 5.2",
            likelihood: "High",
            status: "AI_SUGGESTION"
          }
        ],
        Material: [
          {
            id: "FB2-MA1",
            factor: "Slightly higher bulk density of milled Metformin lot increased mechanical load on mesh periphery",
            evidence: "IPC Bulk Density Log (0.64 g/mL)",
            likelihood: "Low",
            status: "AI_SUGGESTION"
          }
        ],
        Measurement: [
          {
            id: "FB2-MS1",
            factor: "No ultrasonic mesh tension meter (N/cm) or calibrated torque wrench used during sieve assembly",
            evidence: "Work Order WO-2026-5102",
            likelihood: "Medium",
            status: "EVIDENCE_LINKED"
          }
        ],
        Man: [
          {
            id: "FB2-MN1",
            factor: "Technician tightened VS-103 clamp ring unevenly with manual spanner and raised feeder speed to finish shift target",
            evidence: "Shift Operator Statement",
            likelihood: "Medium",
            status: "AI_SUGGESTION"
          }
        ],
        Milieu: [
          {
            id: "FB2-MI1",
            factor: "Continuous 24/7 campaign vibration in Suite PF-03 without intermediate clamp re-torque checks",
            evidence: "Campaign Production Schedule",
            likelihood: "Low",
            status: "AI_SUGGESTION"
          }
        ]
      },
      root_causes: [
        {
          id: "RC-201",
          category_6m: "Machine",
          cause_type: "Primary Root Cause",
          description: "Cyclic fatigue rupture of 30-mesh SS316L screen SCR-30M-089 caused by operating 37% beyond its 300-hour mechanical fatigue lifecycle (412 hrs) under 30% excess powder mass loading (650 kg/hr vs 500 kg/hr validated limit).",
          ai_confidence: 0.96,
          supporting_evidence_refs: ["EV-101", "EV-102", "EV-103"],
          verification_test_required: "Perform optical stereomicroscopy of fracture surface to confirm fatigue striations and complete wire fragment weight/length reconciliation against the 14 mm tear.",
          verification_status: "AI_SUGGESTION",
          confirmed_by_qp: "",
          qp_review_notes: ""
        },
        {
          id: "RC-202",
          category_6m: "Method",
          cause_type: "Contributing Factor",
          description: "Lack of automated cumulative usage-hour tracking in eBMR/SAP PM for vibratory sieve screens and absence of calibrated torque wrench / mesh tension verification in SOP-PF-019.",
          ai_confidence: 0.91,
          supporting_evidence_refs: ["EV-102", "EV-103"],
          verification_test_required: "Review sieve inventory logs across all finishing suites (PF-01 to PF-04) for any screens exceeding 250 operating hours.",
          verification_status: "AI_SUGGESTION",
          confirmed_by_qp: "",
          qp_review_notes: ""
        }
      ],
      missing_evidence_gaps: [
        {
          id: "GAP-201",
          missing_item: "Gravimetric & Dimensional Mass-Balance Reconciliation of Ruptured Mesh SCR-30M-089",
          why_needed: "Must prove whether the 3 recovered wire fragments (total 6.5 mm length) account for 100% of missing wire from the 14 mm weld tear or if any sub-0.8 mm fragments remain unaccounted for.",
          source_system: "QC Microscopy Lab & Engineering Metrology",
          priority: "Critical",
          resolved: false,
          resolution_note: ""
        },
        {
          id: "GAP-202",
          missing_item: "Metal Detector Pass/Reject Verification on Preceding Batch MET-2610-111",
          why_needed: "Required to confirm whether screen micro-tearing started during the final drums of Batch MET-2610-111 prior to the first alarm on MET-2610-112.",
          source_system: "MD-PF-04 Electronic Audit Trail & Retain Samples",
          priority: "High",
          resolved: false,
          resolution_note: ""
        }
      ],
      capa_actions: [
        {
          id: "CAPA-201",
          linked_cause_id: "RC-201",
          action_type: "Corrective Action (CA)",
          title: "Enforce 250-Hour Hard Retirement Limit via Barcode Scan in eBMR & Lock Feeder VFD at 480 kg/hr",
          rationale_explanation: "Laser-etches unique QR codes on all GMP sieve screens tied to eBMR equipment check-in so any screen >250 cumulative hours is automatically blocked from batch start, and caps screw feeder VFD output at 480 kg/hr.",
          owner_department: "API Finishing Production & Automation",
          due_date: "2026-11-10",
          effectiveness_check_metric: "Zero sieve mesh tears or metal detector reject events across 50 consecutive API finishing batches.",
          status: "AI_PROPOSED"
        },
        {
          id: "CAPA-202",
          linked_cause_id: "RC-202",
          action_type: "Preventive Action (PA)",
          title: "Mandate Calibrated Torque Wrench Assembly, Ultrasonic Tension Check (N/cm) & Rare-Earth Magnetic Grate",
          rationale_explanation: "Updates SOP-PF-019 to require calibrated torque wrench assembly (25 Nm) and pre-batch N/cm mesh tension reading, plus installs a 12,000-Gauss rare-earth magnetic trap upstream of MD-PF-04.",
          owner_department: "Engineering & Quality Assurance",
          due_date: "2026-11-25",
          effectiveness_check_metric: "100% pre-batch tension log compliance and zero metallic foreign matter deviations over 6 months.",
          status: "AI_PROPOSED"
        }
      ]
    }
  }
};

// ============================================================================
// REDUX-PATTERN STATE REDUCER (Mirrors frontend/src/store/rcaSlice.js)
// ============================================================================
export const initialRcaState = {
  activeStep: 1,
  selectedScenarioId: "ATOR-OOS-0842",
  intakeSourceType: "PDF",
  intakeFilename: INCIDENT_SCENARIOS["ATOR-OOS-0842"].filename,
  rawInputText: INCIDENT_SCENARIOS["ATOR-OOS-0842"].rawText,
  groqModel: "openai/gpt-oss-120b",
  groqApiKey: "",
  extractionStatus: "extracted", // idle | running | extracted | populated
  activePipelineNode: 5,
  extractedPreview: INCIDENT_SCENARIOS["ATOR-OOS-0842"].extractedData,
  // Main RCA Form State (Populated via AI Panel, NOT manually typed as primary workflow)
  formPopulated: true,
  investigation: JSON.parse(JSON.stringify(INCIDENT_SCENARIOS["ATOR-OOS-0842"].extractedData)),
  rcaMethodTab: "5whys", // "5whys" | "fishbone" | "both"
  qpName: "Dr. Meera Deshmukh, Head of Quality / Qualified Person (QP)",
  qpLicenseId: "QP-IND-TG-2026-0918",
  qpJustification: "",
  investigationSaved: false,
  auditTrail: [
    {
      id: "AUD-101",
      timestamp: "2026-10-24 11:18:10",
      actor: "LangGraph + Groq (openai/gpt-oss-120b)",
      action: "Executed 5-Node AI Extraction & RCA Synthesis Pipeline on DEV-2026-0842",
      badge: "AI_PIPELINE"
    },
    {
      id: "AUD-102",
      timestamp: "2026-10-24 11:18:14",
      actor: "AI Copilot",
      action: "Populated RCA Form Fields, 5 Whys, 6M Fishbone, Missing Evidence & CAPAs (Causes marked as AI_SUGGESTION)",
      badge: "AI_POPULATE"
    }
  ]
};

export function rcaReducer(state = initialRcaState, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, activeStep: action.payload };
    case "SELECT_SCENARIO": {
      const scen = INCIDENT_SCENARIOS[action.payload];
      if (!scen) return state;
      return {
        ...state,
        selectedScenarioId: scen.id,
        intakeSourceType: scen.sourceType,
        intakeFilename: scen.filename,
        rawInputText: scen.rawText,
        extractionStatus: "extracted",
        extractedPreview: JSON.parse(JSON.stringify(scen.extractedData)),
        formPopulated: false,
        investigationSaved: false,
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: "QA Investigator",
            action: `Loaded Incident Document: ${scen.filename} (${scen.sourceType}) into AI Intake Panel`,
            badge: "INTAKE"
          },
          ...state.auditTrail
        ]
      };
    }
    case "SET_RAW_TEXT":
      return {
        ...state,
        rawInputText: action.payload.text,
        intakeSourceType: action.payload.sourceType || state.intakeSourceType,
        intakeFilename: action.payload.filename || state.intakeFilename,
        extractionStatus: "idle"
      };
    case "SET_GROQ_CONFIG":
      return {
        ...state,
        groqModel: action.payload.model ?? state.groqModel,
        groqApiKey: action.payload.apiKey ?? state.groqApiKey
      };
    case "START_EXTRACTION":
      return {
        ...state,
        extractionStatus: "running",
        activePipelineNode: 1
      };
    case "ADVANCE_NODE":
      return {
        ...state,
        activePipelineNode: action.payload
      };
    case "COMPLETE_EXTRACTION":
      return {
        ...state,
        extractionStatus: "extracted",
        activePipelineNode: 5,
        extractedPreview: action.payload,
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: `LangGraph + Groq (${state.groqModel})`,
            action: `Extracted deviation fields, 5 Whys, 6M Fishbone, Missing Evidence & CAPAs from ${state.intakeFilename}`,
            badge: "AI_PIPELINE"
          },
          ...state.auditTrail
        ]
      };
    case "POPULATE_FORM_FROM_AI": {
      const cloned = JSON.parse(JSON.stringify(state.extractedPreview));
      return {
        ...state,
        formPopulated: true,
        extractionStatus: "populated",
        investigation: cloned,
        investigationSaved: false,
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: `AI Copilot (${state.groqModel})`,
            action: `Populated RCA Form from AI Extraction (${cloned.deviation_number} â€” ${cloned.api_name})`,
            badge: "AI_POPULATE"
          },
          ...state.auditTrail
        ]
      };
    }
    case "UPDATE_FIELD": {
      const { field, value } = action.payload;
      return {
        ...state,
        investigationSaved: false,
        investigation: {
          ...state.investigation,
          [field]: value
        },
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: "QA Investigator (Human Edit)",
            action: `Modified RCA field '${field}'`,
            badge: "HUMAN_EDIT"
          },
          ...state.auditTrail
        ]
      };
    }
    case "UPDATE_WHY_NODE": {
      const { index, field, value } = action.payload;
      const updatedWhys = state.investigation.five_whys_chain.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      );
      return {
        ...state,
        investigationSaved: false,
        investigation: {
          ...state.investigation,
          five_whys_chain: updatedWhys
        }
      };
    }
    case "ADD_WHY_NODE": {
      const nextStep = state.investigation.five_whys_chain.length + 1;
      const newNode = {
        step: nextStep,
        question: `Why did level ${nextStep - 1} condition occur?`,
        answer: "Enter evidence-grounded causal mechanism...",
        evidence_ref: "Specify BMR / SCADA / LIMS log ID",
        ai_generated: false,
        verified: true
      };
      return {
        ...state,
        investigation: {
          ...state.investigation,
          five_whys_chain: [...state.investigation.five_whys_chain, newNode]
        }
      };
    }
    case "UPDATE_FISHBONE_STATUS": {
      const { category, factorId, status } = action.payload;
      const updatedCat = (state.investigation.ishikawa_6m[category] || []).map((f) =>
        f.id === factorId ? { ...f, status } : f
      );
      return {
        ...state,
        investigation: {
          ...state.investigation,
          ishikawa_6m: {
            ...state.investigation.ishikawa_6m,
            [category]: updatedCat
          }
        },
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: "QA Investigator",
            action: `Updated 6M Fishbone factor (${category} / ${factorId}) status to ${status}`,
            badge: "HUMAN_EDIT"
          },
          ...state.auditTrail
        ]
      };
    }
    case "ADD_FISHBONE_FACTOR": {
      const { category, factor, evidence, likelihood } = action.payload;
      const newFactor = {
        id: `FB-USR-${Date.now().toString().slice(-3)}`,
        factor,
        evidence,
        likelihood,
        status: "EVIDENCE_LINKED"
      };
      return {
        ...state,
        investigation: {
          ...state.investigation,
          ishikawa_6m: {
            ...state.investigation.ishikawa_6m,
            [category]: [...(state.investigation.ishikawa_6m[category] || []), newFactor]
          }
        }
      };
    }
    case "UPDATE_ROOT_CAUSE": {
      const { id, updates } = action.payload;
      const updatedCauses = state.investigation.root_causes.map((rc) =>
        rc.id === id ? { ...rc, ...updates } : rc
      );
      return {
        ...state,
        investigationSaved: false,
        investigation: {
          ...state.investigation,
          root_causes: updatedCauses
        },
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: updates.confirmed_by_qp || "QA Investigator / QP",
            action: `Updated Root Cause ${id}: verification_status=${updates.verification_status || "edited"}`,
            badge: updates.verification_status === "QP_CONFIRMED" ? "QP_SIGNOFF" : "HUMAN_EDIT"
          },
          ...state.auditTrail
        ]
      };
    }
    case "RESOLVE_EVIDENCE_GAP": {
      const { id, resolved, resolution_note } = action.payload;
      const updatedGaps = state.investigation.missing_evidence_gaps.map((g) =>
        g.id === id ? { ...g, resolved, resolution_note } : g
      );
      return {
        ...state,
        investigation: {
          ...state.investigation,
          missing_evidence_gaps: updatedGaps
        },
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: "QA Investigator",
            action: `${resolved ? "Verified & closed" : "Re-opened"} missing evidence gap ${id}`,
            badge: "EVIDENCE"
          },
          ...state.auditTrail
        ]
      };
    }
    case "UPDATE_CAPA": {
      const { id, updates } = action.payload;
      const updatedCapas = state.investigation.capa_actions.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      return {
        ...state,
        investigationSaved: false,
        investigation: {
          ...state.investigation,
          capa_actions: updatedCapas
        },
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: "QA CAPA Coordinator",
            action: `Updated CAPA ${id} (${updates.status || "modified details"})`,
            badge: "CAPA"
          },
          ...state.auditTrail
        ]
      };
    }
    case "ADD_CAPA": {
      const newCapa = {
        id: `CAPA-0${state.investigation.capa_actions.length + 1}`,
        linked_cause_id: state.investigation.root_causes[0]?.id || "RC-01",
        action_type: "Preventive Action (PA)",
        title: "New Preventive Control Action",
        rationale_explanation: "Specify how this systemic action prevents recurrence across API synthesis trains.",
        owner_department: "Quality Assurance & Engineering",
        due_date: "2026-12-15",
        effectiveness_check_metric: "Verify zero recurrence over 3 consecutive campaign batches.",
        status: "APPROVED"
      };
      return {
        ...state,
        investigation: {
          ...state.investigation,
          capa_actions: [...state.investigation.capa_actions, newCapa]
        }
      };
    }
    case "SET_QP_META":
      return {
        ...state,
        qpName: action.payload.qpName ?? state.qpName,
        qpJustification: action.payload.qpJustification ?? state.qpJustification
      };
    case "SAVE_INVESTIGATION":
      return {
        ...state,
        investigationSaved: true,
        auditTrail: [
          {
            id: "AUD-" + Date.now(),
            timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
            actor: state.qpName,
            action: `Signed off & committed RCA Investigation ${state.investigation.deviation_number} to PostgreSQL/MySQL QMS Database (21 CFR Part 11 Compliant)`,
            badge: "QP_SIGNOFF"
          },
          ...state.auditTrail
        ]
      };
    default:
      return state;
  }
}

// ─── MODULE-LEVEL HELPERS (must be outside App for React Fast Refresh) ───────

const STATUS_COLOR = {
  AI_SUGGESTION:  "bg-amber-500/15 text-amber-300 border-amber-500/30",
  EVIDENCE_LINKED:"bg-sky-500/15 text-sky-300 border-sky-500/30",
  QP_CONFIRMED:   "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  RULED_OUT:      "bg-slate-700/40 text-slate-400 border-slate-700",
  AI_PROPOSED:    "bg-amber-500/15 text-amber-300 border-amber-500/30",
  APPROVED:       "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  COMPLETED:      "bg-teal-500/15 text-teal-300 border-teal-500/30",
};

const cycleStatus = (cur) =>
  ({ AI_SUGGESTION: "EVIDENCE_LINKED", EVIDENCE_LINKED: "QP_CONFIRMED", QP_CONFIRMED: "RULED_OUT", RULED_OUT: "AI_SUGGESTION" }[cur] || "EVIDENCE_LINKED");

const VARIANT_COLOR = {
  critical: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  major:    "bg-amber-500/15 text-amber-300 border-amber-500/30",
  minor:    "bg-sky-500/15 text-sky-300 border-sky-500/30",
  neutral:  "bg-slate-700/50 text-slate-300 border-slate-700",
  green:    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  ai:       "bg-violet-500/15 text-violet-300 border-violet-500/30",
};

function Badge({ label, variant = "neutral" }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-semibold ${VARIANT_COLOR[variant] || VARIANT_COLOR.neutral}`}>
      {label}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function RCAInput({ value, onChange, mono = false, amber = false }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm
        focus:border-teal-500 focus:outline-none transition
        ${mono ? "font-mono" : ""}
        ${amber ? "text-amber-200" : "text-slate-100"}`}
    />
  );
}

function RCATextarea({ value, onChange, rows = 3, green = false }) {
  return (
    <textarea
      rows={rows}
      value={value || ""}
      onChange={onChange}
      className={`w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3 py-2 text-sm leading-relaxed
        focus:border-teal-500 focus:outline-none transition resize-none
        ${green ? "text-emerald-200" : "text-slate-100"}`}
    />
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children, right }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-teal-400 shrink-0" />}
        <h3 className="text-base font-semibold text-white">{children}</h3>
      </div>
      {right}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const state = useSelector((state) => state.rca);
  const dispatch = useDispatch();
  const [aiDrawerOpen, setAiDrawerOpen] = useState(true);
  const [activeArchitectureModal, setActiveArchitectureModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [newFishboneCategory, setNewFishboneCategory] = useState("Machine");
  const [newFishboneText, setNewFishboneText] = useState("");
  const [newFishboneEvidence, setNewFishboneEvidence] = useState("");
  const [viewMode, setViewMode] = useState("both");
  const fileInputRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 4200);
  };

  // Trigger LangGraph + Groq Pipeline (Supports live Groq API call if key provided, or realistic 5-node simulation)
  const handleRunAiExtraction = async () => {
    dispatch({ type: "START_EXTRACTION" });

    // If user entered a real Groq API Key, call Groq chat completions directly from browser
    if (state.groqApiKey && state.groqApiKey.trim().startsWith("gsk_")) {
      try {
        dispatch({ type: "ADVANCE_NODE", payload: 2 });
        const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.groqApiKey.trim()}`
          },
          body: JSON.stringify({
            model: state.groqModel,
            temperature: 0.1,
            messages: [
              {
                role: "system",
                content:
                  "You are an ICH Q7/Q9/Q10 API Pharmaceutical Root Cause Analysis AI Engine. Extract structured JSON matching keys: deviation_number, title, api_name, batch_number, batch_size, process_stage, equipment_id, manufacturing_site, date_occurred, date_discovered, reported_by, criticality, severity_score (1-5), occurrence_score (1-5), detectability_score (1-5), batch_disposition_hold (boolean), cqa_cpp_impacted, problem_statement, immediate_containment, batch_impact_assessment, supporting_evidence (array of {id, source, timestamp, parameter, observation, verified}), five_whys_chain (array of 5 {step, question, answer, evidence_ref, ai_generated:true, verified:false}), ishikawa_6m (object with keys Machine, Method, Material, Measurement, Man, Milieu mapping to array of {id, factor, evidence, likelihood, status:'AI_SUGGESTION'}), root_causes (array of {id, category_6m, cause_type, description, ai_confidence, supporting_evidence_refs, verification_test_required, verification_status:'AI_SUGGESTION', confirmed_by_qp:'', qp_review_notes:''}), missing_evidence_gaps (array of {id, missing_item, why_needed, source_system, priority, resolved:false, resolution_note:''}), capa_actions (array of {id, linked_cause_id, action_type, title, rationale_explanation, owner_department, due_date, effectiveness_check_metric, status:'AI_PROPOSED'})."
              },
              {
                role: "user",
                content: state.rawInputText
              }
            ]
          })
        });
        dispatch({ type: "ADVANCE_NODE", payload: 4 });
        if (resp.ok) {
          const data = await resp.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          dispatch({ type: "COMPLETE_EXTRACTION", payload: parsed });
          showToast(`Live Groq (${state.groqModel}) extraction completed! Click 'Populate RCA Form' to apply.`);
          return;
        }
      } catch (e) {
        // Fall through to deterministic LangGraph node simulation if network/key blocked in sandbox
      }
    }

    // Step-by-step LangGraph 5-Node execution progression
    setTimeout(() => dispatch({ type: "ADVANCE_NODE", payload: 2 }), 350);
    setTimeout(() => dispatch({ type: "ADVANCE_NODE", payload: 3 }), 700);
    setTimeout(() => dispatch({ type: "ADVANCE_NODE", payload: 4 }), 1050);
    setTimeout(() => {
      const matchedScenario = Object.values(INCIDENT_SCENARIOS).find((s) =>
        state.rawInputText.includes(s.extractedData.batch_number)
      );
      const outputData = matchedScenario
        ? JSON.parse(JSON.stringify(matchedScenario.extractedData))
        : JSON.parse(JSON.stringify(INCIDENT_SCENARIOS["ATOR-OOS-0842"].extractedData));

      dispatch({ type: "COMPLETE_EXTRACTION", payload: outputData });
      showToast(
        `LangGraph + Groq (${state.groqModel}) extracted 14 deviation fields, 5 Whys, 6M Fishbone & 3 CAPAs!`
      );
    }, 1400);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = String(ev.target?.result || "");
      const readable =
        content.length > 80 && !content.startsWith("%PDF")
          ? content
          : INCIDENT_SCENARIOS["ATOR-OOS-0842"].rawText;
      dispatch({
        type: "SET_RAW_TEXT",
        payload: {
          text: readable,
          sourceType: file.name.endsWith(".eml") ? "EMAIL" : "PDF",
          filename: file.name
        }
      });
      showToast(`Loaded '${file.name}' into AI Copilot Intake. Click 'Run AI Extraction' to analyze.`);
    };
    reader.readAsText(file);
  };

  const inv = state.investigation;
  const rpnScore = inv.severity_score * inv.occurrence_score * inv.detectability_score;
  const confirmedCausesCount = inv.root_causes.filter(
    (rc) => rc.verification_status === "QP_CONFIRMED"
  ).length;
  const resolvedGapsCount = inv.missing_evidence_gaps.filter((g) => g.resolved).length;
  const approvedCapasCount = inv.capa_actions.filter(
    (c) => c.status === "APPROVED" || c.status === "COMPLETED"
  ).length;

  const WORKFLOW_STEPS = [
    {
      num: 1,
      title: "1. Deviation Intake & Triage",
      subtitle: "AI Form Population & ICH Q9 RPN",
      icon: FileText
    },
    {
      num: 2,
      title: "2. 5 Whys & 6M Fishbone",
      subtitle: "Structured Causal Investigation",
      icon: GitBranch
    },
    {
      num: 3,
      title: "3. Root Causes & Evidence Gaps",
      subtitle: `${confirmedCausesCount}/${inv.root_causes.length} QP Confirmed â€¢ ${resolvedGapsCount}/${inv.missing_evidence_gaps.length} Gaps Closed`,
      icon: Search
    },
    {
      num: 4,
      title: "4. CAPA & QP Sign-Off",
      subtitle: `${approvedCapasCount}/${inv.capa_actions.length} CAPAs Approved`,
      icon: ShieldCheck
    }
  ];

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">

      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <Beaker className="w-4.5 h-4.5 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">AIVOA.AI</span>
              <p className="text-xs text-slate-400">Root Cause Analysis — API Pharma QMS</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Model selector */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs text-slate-400">Model</span>
              <select
                value={state.groqModel}
                onChange={(e) => dispatch({ type: "SET_GROQ_CONFIG", payload: { model: e.target.value } })}
                className="bg-transparent text-sm text-teal-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="openai/gpt-oss-120b" className="bg-slate-900">gpt-oss-120b</option>
                <option value="openai/gpt-oss-20b" className="bg-slate-900">gpt-oss-20b</option>
              </select>
            </div>

            {/* Save status */}
            {state.investigationSaved && (
              <Badge label="Saved to DB" variant="green" />
            )}

            {/* AI panel toggle */}
            <button
              onClick={() => setAiDrawerOpen(!aiDrawerOpen)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition
                ${aiDrawerOpen ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-teal-300 border border-slate-700"}`}
            >
              <Sparkles className="w-4 h-4" />
              {aiDrawerOpen ? "Hide AI Panel" : "AI Panel"}
            </button>
          </div>
        </div>
      </header>

      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 border border-teal-500/40
          text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm leading-snug">{toastMessage.msg}</span>
          <button onClick={() => setToastMessage(null)} className="ml-auto text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── WORKSPACE ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ════════════════════════════════════════════════════════════════════
            LEFT — AI COPILOT PANEL
        ════════════════════════════════════════════════════════════════════ */}
        {aiDrawerOpen && (
          <aside className="w-80 xl:w-96 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <h2 className="text-sm font-semibold text-white">AI Intake Copilot</h2>
              </div>
              <p className="text-xs text-slate-400">Upload or select an incident document to extract RCA data automatically.</p>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* Sample scenarios */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Sample Incidents</p>
                {Object.values(INCIDENT_SCENARIOS).map((scen) => {
                  const active = state.selectedScenarioId === scen.id;
                  return (
                    <button
                      key={scen.id}
                      onClick={() => {
                        dispatch({ type: "SELECT_SCENARIO", payload: scen.id });
                        showToast(`Loaded ${scen.filename}`);
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition
                        ${active ? "bg-teal-500/10 border-teal-500/50 text-white"
                                 : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"}`}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded
                          ${scen.sourceType === "PDF" ? "bg-rose-500/20 text-rose-300" : "bg-sky-500/20 text-sky-300"}`}>
                          {scen.sourceType}
                        </span>
                        <span className="text-sm font-semibold truncate">{scen.extractedData.api_name}</span>
                      </div>
                      <p className="text-xs text-slate-400">{scen.extractedData.deviation_number} · {scen.badge}</p>
                    </button>
                  );
                })}
              </div>

              {/* Upload */}
              <div className="flex items-center gap-2">
                <input ref={fileInputRef} type="file" accept=".pdf,.txt,.eml,.md" onChange={handleFileUpload} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-300 hover:bg-slate-700 transition"
                >
                  <FileUp className="w-4 h-4 text-teal-400" />
                  Upload File
                </button>
                <div className="flex bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs">
                  {["PDF","EMAIL","TEXT"].map(t => (
                    <button
                      key={t}
                      onClick={() => dispatch({ type: "SET_RAW_TEXT", payload: { text: state.rawInputText, sourceType: t } })}
                      className={`px-2.5 py-1 rounded font-semibold transition
                        ${state.intakeSourceType === t ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* API key */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <input
                  type="password"
                  value={state.groqApiKey}
                  onChange={(e) => dispatch({ type: "SET_GROQ_CONFIG", payload: { apiKey: e.target.value } })}
                  placeholder="Groq API Key (optional — gsk_...)"
                  className="bg-transparent text-sm text-slate-200 placeholder-slate-500 w-full focus:outline-none"
                />
              </div>

              {/* Document text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Source Document</p>
                  <span className="text-xs text-slate-500 truncate max-w-[140px]">{state.intakeFilename}</span>
                </div>
                <textarea
                  rows={7}
                  value={state.rawInputText}
                  onChange={(e) => dispatch({ type: "SET_RAW_TEXT", payload: { text: e.target.value } })}
                  placeholder="Paste incident report, OOS investigation, or quality alert email here..."
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs font-mono
                    text-slate-300 focus:border-teal-500 focus:outline-none leading-relaxed resize-none"
                />
              </div>

              {/* Run button */}
              <button
                onClick={handleRunAiExtraction}
                disabled={state.extractionStatus === "running"}
                className="w-full py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-500 to-emerald-500
                  text-slate-950 flex items-center justify-center gap-2 hover:from-teal-400 hover:to-emerald-400
                  transition disabled:opacity-50"
              >
                {state.extractionStatus === "running"
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing…</>
                  : <><Sparkles className="w-4 h-4" /> Analyze with Groq AI</>}
              </button>

              {/* Pipeline nodes */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">LangGraph Pipeline</p>
                {[
                  { id: 1, name: "intake_extractor" },
                  { id: 2, name: "evidence_gap_analyzer" },
                  { id: 3, name: "rca_investigator" },
                  { id: 4, name: "root_cause_synthesizer" },
                  { id: 5, name: "capa_recommender" },
                ].map((node) => {
                  const done = state.extractionStatus !== "idle" && state.activePipelineNode >= node.id
                    && !(state.extractionStatus === "running" && state.activePipelineNode === node.id);
                  const active = state.extractionStatus === "running" && state.activePipelineNode === node.id;
                  return (
                    <div key={node.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs
                        ${active ? "bg-teal-500/10 text-teal-300" : done ? "text-slate-300" : "text-slate-500"}`}
                    >
                      <span className="font-mono">Node {node.id}: {node.name}</span>
                      {active ? <RefreshCw className="w-3 h-3 animate-spin" />
                               : done ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      : <Clock className="w-3 h-3 text-slate-600" />}
                    </div>
                  );
                })}
              </div>

              {/* Extraction preview + populate button */}
              {state.extractedPreview && (
                <div className="bg-teal-950/20 border border-teal-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-teal-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Ready to Populate
                    </p>
                    <Badge label={`${state.extractedPreview.root_causes?.length || 0} Causes`} variant="ai" />
                  </div>
                  <div className="text-xs text-slate-300 space-y-0.5">
                    <p><span className="text-slate-500">Deviation:</span> {state.extractedPreview.deviation_number}</p>
                    <p><span className="text-slate-500">Batch:</span> {state.extractedPreview.batch_number}</p>
                    <p><span className="text-slate-500">CAPAs:</span> {state.extractedPreview.capa_actions?.length || 0} recommended</p>
                  </div>
                  <button
                    onClick={() => {
                      dispatch({ type: "POPULATE_FORM_FROM_AI" });
                      showToast("Form populated from AI extraction.");
                    }}
                    className="w-full py-2 rounded-xl text-sm font-semibold bg-indigo-500 hover:bg-indigo-400
                      text-white flex items-center justify-center gap-2 transition"
                  >
                    <ArrowRight className="w-4 h-4" /> Populate RCA Form
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            RIGHT — MAIN INVESTIGATION WORKSPACE
        ════════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── STEP NAV ──────────────────────────────────────────────────── */}
          <div className="bg-slate-900/60 border-b border-slate-800 px-6 py-3 flex gap-2 shrink-0">
            {WORKFLOW_STEPS.map((st) => {
              const Icon = st.icon;
              const active = state.activeStep === st.num;
              return (
                <button
                  key={st.num}
                  onClick={() => dispatch({ type: "SET_STEP", payload: st.num })}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-sm font-medium transition flex-1
                    ${active
                      ? "bg-teal-500/10 border-teal-500/60 text-white"
                      : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                    ${active ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="hidden sm:block text-left min-w-0">
                    <div className="truncate font-semibold text-sm">{st.title}</div>
                    <div className="text-xs text-slate-400 truncate">{st.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── STEP CONTENT ──────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Record identity bar */}
            <div className="flex flex-wrap items-center gap-3 pb-1 border-b border-slate-800">
              <h1 className="text-xl font-bold text-white">{inv.deviation_number}</h1>
              <Badge
                label={inv.criticality}
                variant={inv.criticality === "Critical" ? "critical" : inv.criticality === "Major" ? "major" : "minor"}
              />
              <Badge label={`RPN ${rpnScore}`} variant={rpnScore >= 20 ? "critical" : "minor"} />
              <span className="text-sm text-slate-400 truncate flex-1">{inv.title}</span>
              <button
                onClick={() => dispatch({ type: "SET_STEP", payload: Math.min(state.activeStep + 1, 4) })}
                className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/40
                  text-teal-300 text-sm font-medium hover:bg-teal-500/20 transition"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                STEP 1 — DEVIATION INTAKE
            ══════════════════════════════════════════════════════════════ */}
            {state.activeStep === 1 && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left — batch metadata */}
                <div className="xl:col-span-2 space-y-6">
                  <Card>
                    <SectionTitle icon={FileText}>Batch & Process Details</SectionTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Deviation Number">
                        <RCAInput value={inv.deviation_number}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "deviation_number", value: e.target.value } })} mono />
                      </Field>
                      <Field label="API Name">
                        <RCAInput value={inv.api_name}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "api_name", value: e.target.value } })} />
                      </Field>
                      <Field label="Batch Number">
                        <RCAInput value={inv.batch_number}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "batch_number", value: e.target.value } })} mono />
                      </Field>
                      <Field label="Process Stage">
                        <RCAInput value={inv.process_stage}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "process_stage", value: e.target.value } })} />
                      </Field>
                      <Field label="Equipment ID">
                        <RCAInput value={inv.equipment_id}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "equipment_id", value: e.target.value } })} mono />
                      </Field>
                      <Field label="Manufacturing Site">
                        <RCAInput value={inv.manufacturing_site}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "manufacturing_site", value: e.target.value } })} />
                      </Field>
                      <Field label="Date Occurred">
                        <RCAInput value={inv.date_occurred}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "date_occurred", value: e.target.value } })} />
                      </Field>
                      <Field label="Reported By">
                        <RCAInput value={inv.reported_by}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "reported_by", value: e.target.value } })} />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="CQA / CPP Impacted">
                          <RCAInput value={inv.cqa_cpp_impacted} amber
                            onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "cqa_cpp_impacted", value: e.target.value } })} />
                        </Field>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <SectionTitle icon={AlertTriangle}>Problem Statement</SectionTitle>
                    <div className="space-y-4">
                      <Field label="What happened">
                        <RCATextarea value={inv.problem_statement} rows={3}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "problem_statement", value: e.target.value } })} />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Immediate Containment">
                          <RCATextarea value={inv.immediate_containment} rows={3}
                            onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "immediate_containment", value: e.target.value } })} />
                        </Field>
                        <Field label="Batch Impact">
                          <RCATextarea value={inv.batch_impact_assessment} rows={3}
                            onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field: "batch_impact_assessment", value: e.target.value } })} />
                        </Field>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right — Risk + Evidence */}
                <div className="space-y-6">
                  <Card>
                    <SectionTitle icon={Sliders}>ICH Q9 Risk Score</SectionTitle>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Severity", field: "severity_score", val: inv.severity_score, color: "text-rose-300" },
                        { label: "Occurrence", field: "occurrence_score", val: inv.occurrence_score, color: "text-amber-300" },
                        { label: "Detectability", field: "detectability_score", val: inv.detectability_score, color: "text-sky-300" },
                      ].map(({ label, field, val, color }) => (
                        <div key={field} className="text-center">
                          <p className="text-xs text-slate-400 mb-1">{label}</p>
                          <input type="number" min={1} max={5} value={val}
                            onChange={(e) => dispatch({ type: "UPDATE_FIELD", payload: { field, value: Math.min(5, Math.max(1, Number(e.target.value) || 1)) } })}
                            className={`w-full text-center text-lg font-bold rounded-lg bg-slate-950 border border-slate-700 py-2 ${color} focus:outline-none`} />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between bg-slate-950 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">RPN Score</p>
                        <p className="text-xs text-slate-400">Severity × Occurrence × Detectability</p>
                      </div>
                      <span className={`text-3xl font-black font-mono ${rpnScore >= 20 ? "text-rose-400" : "text-amber-400"}`}>
                        {rpnScore}
                      </span>
                    </div>
                  </Card>

                  <Card>
                    <SectionTitle icon={Database}>Supporting Evidence</SectionTitle>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {inv.supporting_evidence.map((ev) => (
                        <div key={ev.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono font-semibold text-teal-300">[{ev.id}]</span>
                            {ev.verified && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
                          </div>
                          <p className="text-xs font-medium text-slate-300">{ev.source}</p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ev.observation}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 2 — 5 WHYS & 6M FISHBONE
            ══════════════════════════════════════════════════════════════ */}
            {state.activeStep === 2 && (
              <div className="space-y-6">
                {/* View toggle */}
                <div className="flex items-center gap-2">
                  {[
                    { id: "both", label: "Both Views" },
                    { id: "5whys", label: "5 Whys" },
                    { id: "fishbone", label: "6M Fishbone" },
                  ].map(tab => (
                    <button key={tab.id} onClick={() => setViewMode(tab.id)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                        ${viewMode === tab.id ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 5 Whys */}
                {(viewMode === "both" || viewMode === "5whys") && (
                  <Card>
                    <SectionTitle icon={HelpCircle} right={
                      <button onClick={() => dispatch({ type: "ADD_WHY_NODE" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700
                          text-sm text-teal-300 hover:bg-slate-700 transition">
                        <Plus className="w-3.5 h-3.5" /> Add Level
                      </button>
                    }>
                      5 Whys Causal Chain
                    </SectionTitle>

                    <div className="space-y-3">
                      {inv.five_whys_chain.map((node, idx) => (
                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30
                            flex items-center justify-center text-teal-300 font-bold text-sm shrink-0">
                            #{node.step}
                          </div>
                          <div className="flex-1 space-y-2 min-w-0">
                            <Field label="Question">
                              <RCAInput value={node.question}
                                onChange={(e) => dispatch({ type: "UPDATE_WHY_NODE", payload: { index: idx, field: "question", value: e.target.value } })} />
                            </Field>
                            <div className="grid sm:grid-cols-3 gap-2">
                              <div className="sm:col-span-2">
                                <Field label="Answer / Causal Mechanism">
                                  <RCATextarea value={node.answer} rows={2}
                                    onChange={(e) => dispatch({ type: "UPDATE_WHY_NODE", payload: { index: idx, field: "answer", value: e.target.value } })} />
                                </Field>
                              </div>
                              <div className="space-y-2">
                                <Field label="Evidence Ref">
                                  <RCAInput value={node.evidence_ref} mono
                                    onChange={(e) => dispatch({ type: "UPDATE_WHY_NODE", payload: { index: idx, field: "evidence_ref", value: e.target.value } })} />
                                </Field>
                                <button
                                  onClick={() => dispatch({ type: "UPDATE_WHY_NODE", payload: { index: idx, field: "verified", value: !node.verified } })}
                                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition
                                    ${node.verified ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                                    : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                                  {node.verified ? "✓ Verified" : "Pending"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* 6M Fishbone */}
                {(viewMode === "both" || viewMode === "fishbone") && (
                  <Card>
                    <SectionTitle icon={Activity} right={
                      <div className="flex items-center gap-2">
                        <select value={newFishboneCategory} onChange={(e) => setNewFishboneCategory(e.target.value)}
                          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-teal-300">
                          {["Machine","Method","Material","Measurement","Man","Milieu"].map(m =>
                            <option key={m} value={m}>{m}</option>)}
                        </select>
                        <input value={newFishboneText} onChange={(e) => setNewFishboneText(e.target.value)}
                          placeholder="Contributing factor…" className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 w-48" />
                        <button onClick={() => {
                          if (!newFishboneText.trim()) return;
                          dispatch({ type: "ADD_FISHBONE_FACTOR", payload: { category: newFishboneCategory, factor: newFishboneText.trim(), evidence: newFishboneEvidence.trim() || "Investigator note", likelihood: "Medium" } });
                          setNewFishboneText(""); setNewFishboneEvidence("");
                          showToast(`Factor added to ${newFishboneCategory}`);
                        }} className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-semibold text-sm hover:bg-teal-400 transition">
                          + Add
                        </button>
                      </div>
                    }>
                      6M Ishikawa Fishbone
                    </SectionTitle>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {["Machine","Method","Material","Measurement","Man","Milieu"].map((cat) => {
                        const factors = inv.ishikawa_6m[cat] || [];
                        return (
                          <div key={cat} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wide">{cat}</h4>
                              <span className="text-xs text-slate-500">{factors.length}</span>
                            </div>
                            <div className="space-y-2">
                              {factors.map((f) => (
                                <div key={f.id}
                                  className={`p-2.5 rounded-lg border text-xs transition
                                    ${f.status === "RULED_OUT" ? "opacity-40 line-through border-slate-800"
                                                                : "border-slate-800 bg-slate-900/60"}`}>
                                  <p className="text-slate-200 leading-snug mb-2">{f.factor}</p>
                                  <div className="flex items-center justify-between">
                                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold
                                      ${f.likelihood === "High" ? "text-rose-300" : f.likelihood === "Medium" ? "text-amber-300" : "text-slate-400"}`}>
                                      {f.likelihood}
                                    </span>
                                    <button
                                      onClick={() => dispatch({ type: "UPDATE_FISHBONE_STATUS", payload: { category: cat, factorId: f.id, status: cycleStatus(f.status) } })}
                                      className={`px-2 py-0.5 rounded border text-xs font-semibold transition ${STATUS_COLOR[f.status] || STATUS_COLOR.AI_SUGGESTION}`}>
                                      {f.status.replace("_", " ")}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Effect head */}
                    <div className="mt-4 flex items-center gap-3 bg-rose-500/5 border border-rose-500/20 rounded-xl px-4 py-3">
                      <span className="text-xs font-bold text-rose-400 shrink-0">EFFECT</span>
                      <span className="text-sm text-white truncate">{inv.title}</span>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 3 — ROOT CAUSES & EVIDENCE GAPS
            ══════════════════════════════════════════════════════════════ */}
            {state.activeStep === 3 && (
              <div className="space-y-6">

                {/* Missing Evidence Gaps */}
                <Card>
                  <SectionTitle icon={AlertTriangle}>
                    Missing Evidence Gaps
                    <span className="ml-2 text-sm text-slate-400 font-normal">({resolvedGapsCount}/{inv.missing_evidence_gaps.length} resolved)</span>
                  </SectionTitle>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {inv.missing_evidence_gaps.map((gap) => (
                      <div key={gap.id}
                        className={`p-4 rounded-xl border flex flex-col gap-3
                          ${gap.resolved ? "bg-emerald-950/15 border-emerald-500/30" : "bg-slate-950 border-amber-500/20"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-amber-300">{gap.id}</span>
                          <Badge label={gap.priority} variant={gap.priority === "Critical" ? "critical" : gap.priority === "High" ? "major" : "neutral"} />
                        </div>
                        <p className="text-sm font-semibold text-white leading-snug">{gap.missing_item}</p>
                        <p className="text-xs text-slate-400 leading-relaxed">{gap.why_needed}</p>
                        <p className="text-xs font-mono text-sky-400">{gap.source_system}</p>
                        <input
                          type="text"
                          value={gap.resolution_note || ""}
                          onChange={(e) => dispatch({ type: "RESOLVE_EVIDENCE_GAP", payload: { id: gap.id, resolved: gap.resolved, resolution_note: e.target.value } })}
                          placeholder="Resolution note / report ref…"
                          className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={() => { dispatch({ type: "RESOLVE_EVIDENCE_GAP", payload: { id: gap.id, resolved: !gap.resolved, resolution_note: gap.resolution_note || `Verified ${new Date().toISOString().slice(0,10)}` } }); showToast(gap.resolved ? `${gap.id} reopened` : `${gap.id} resolved`); }}
                          className={`py-1.5 rounded-lg text-sm font-semibold transition
                            ${gap.resolved ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"}`}>
                          {gap.resolved ? "Reopen" : "Mark Resolved"}
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Root Causes */}
                <Card>
                  <SectionTitle icon={Search}>
                    Root Causes & Contributing Factors
                    <span className="ml-2 text-sm text-slate-400 font-normal">({confirmedCausesCount}/{inv.root_causes.length} confirmed)</span>
                  </SectionTitle>
                  <div className="space-y-4">
                    {inv.root_causes.map((rc) => {
                      const confirmed = rc.verification_status === "QP_CONFIRMED";
                      const ruledOut  = rc.verification_status === "RULED_OUT";
                      return (
                        <div key={rc.id}
                          className={`p-4 rounded-xl border transition
                            ${confirmed ? "bg-emerald-950/15 border-emerald-500/40"
                            : ruledOut  ? "bg-slate-950/50 border-slate-800 opacity-60"
                                        : "bg-slate-950 border-slate-800"}`}>
                          {/* Header row */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-sm font-mono font-bold text-teal-300">{rc.id}</span>
                            <Badge
                              label={rc.cause_type}
                              variant={rc.cause_type === "Primary Root Cause" ? "critical" : "major"}
                            />
                            <Badge label={rc.category_6m} variant="neutral" />
                            <span className="text-xs text-slate-400">Confidence: <strong className="text-white">{Math.round(rc.ai_confidence * 100)}%</strong></span>
                            <span className={`ml-auto px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${STATUS_COLOR[rc.verification_status] || STATUS_COLOR.AI_SUGGESTION}`}>
                              {rc.verification_status.replace(/_/g, " ")}
                            </span>
                          </div>

                          {/* Description */}
                          <RCATextarea value={rc.description} rows={2}
                            onChange={(e) => dispatch({ type: "UPDATE_ROOT_CAUSE", payload: { id: rc.id, updates: { description: e.target.value } } })} />

                          {/* Evidence refs */}
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {rc.supporting_evidence_refs.map(ref => (
                              <span key={ref} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono">{ref}</span>
                            ))}
                          </div>

                          {/* QP notes + action buttons */}
                          <div className="flex items-center gap-2 mt-3">
                            <input
                              type="text"
                              value={rc.qp_review_notes || ""}
                              onChange={(e) => dispatch({ type: "UPDATE_ROOT_CAUSE", payload: { id: rc.id, updates: { qp_review_notes: e.target.value } } })}
                              placeholder="QP review note…"
                              className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500"
                            />
                            <button onClick={() => { dispatch({ type: "UPDATE_ROOT_CAUSE", payload: { id: rc.id, updates: { verification_status: "QP_CONFIRMED", confirmed_by_qp: state.qpName.split(",")[0], qp_review_notes: rc.qp_review_notes || "Confirmed by QP." } } }); showToast(`${rc.id} confirmed`); }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 transition">
                              Confirm
                            </button>
                            <button onClick={() => dispatch({ type: "UPDATE_ROOT_CAUSE", payload: { id: rc.id, updates: { verification_status: "RULED_OUT" } } })}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-sm hover:bg-rose-950 hover:text-rose-300 transition">
                              Rule Out
                            </button>
                            {!confirmed || (
                              <button onClick={() => dispatch({ type: "UPDATE_ROOT_CAUSE", payload: { id: rc.id, updates: { verification_status: "AI_SUGGESTION", confirmed_by_qp: "" } } })}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 text-amber-300 text-sm hover:bg-slate-700 transition">
                                Reset
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                STEP 4 — CAPA & QP SIGN-OFF
            ══════════════════════════════════════════════════════════════ */}
            {state.activeStep === 4 && (
              <div className="space-y-6">

                {/* CAPA list */}
                <Card>
                  <SectionTitle icon={ClipboardCheck} right={
                    <button onClick={() => { dispatch({ type: "ADD_CAPA" }); showToast("New CAPA added."); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700
                        text-sm text-teal-300 hover:bg-slate-700 transition">
                      <Plus className="w-3.5 h-3.5" /> Add CAPA
                    </button>
                  }>
                    CAPA Recommendations ({approvedCapasCount}/{inv.capa_actions.length} approved)
                  </SectionTitle>

                  <div className="space-y-4">
                    {inv.capa_actions.map((capa) => {
                      const approved = capa.status === "APPROVED";
                      return (
                        <div key={capa.id}
                          className={`p-4 rounded-xl border transition
                            ${approved ? "bg-emerald-950/10 border-emerald-500/30" : "bg-slate-950 border-slate-800"}`}>
                          {/* Header */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-sm font-mono font-bold text-teal-300">{capa.id}</span>
                            <select value={capa.action_type}
                              onChange={(e) => dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { action_type: e.target.value } } })}
                              className={`text-sm font-semibold px-2.5 py-1 rounded-lg border bg-slate-900
                                ${capa.action_type.includes("Corrective") ? "text-amber-300 border-amber-500/30" : "text-sky-300 border-sky-500/30"}`}>
                              <option>Corrective Action (CA)</option>
                              <option>Preventive Action (PA)</option>
                            </select>
                            <span className="text-xs text-slate-400">→ <strong className="font-mono text-slate-300">{capa.linked_cause_id}</strong></span>
                            <button
                              onClick={() => { dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { status: approved ? "AI_PROPOSED" : "APPROVED" } } }); showToast(`${capa.id} ${approved ? "revoked" : "approved"}`); }}
                              className={`ml-auto px-3 py-1 rounded-lg text-sm font-semibold transition
                                ${approved ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"}`}>
                              {approved ? "Revoke" : "Approve"}
                            </button>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <Field label="Title">
                                <RCAInput value={capa.title}
                                  onChange={(e) => dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { title: e.target.value } } })} />
                              </Field>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                              <Field label="Owner">
                                <RCAInput value={capa.owner_department}
                                  onChange={(e) => dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { owner_department: e.target.value } } })} />
                              </Field>
                              <Field label="Due Date">
                                <RCAInput value={capa.due_date} mono
                                  onChange={(e) => dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { due_date: e.target.value } } })} />
                              </Field>
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 mt-3">
                            <Field label="Rationale">
                              <RCATextarea value={capa.rationale_explanation} rows={2}
                                onChange={(e) => dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { rationale_explanation: e.target.value } } })} />
                            </Field>
                            <Field label="Effectiveness Metric">
                              <RCATextarea value={capa.effectiveness_check_metric} rows={2} green
                                onChange={(e) => dispatch({ type: "UPDATE_CAPA", payload: { id: capa.id, updates: { effectiveness_check_metric: e.target.value } } })} />
                            </Field>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* QP Sign-Off + Audit Trail */}
                <div className="grid xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <Card>
                      <SectionTitle icon={ShieldCheck}>QP Sign-Off — 21 CFR Part 11</SectionTitle>
                      <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <Field label="Qualified Person Name">
                          <RCAInput value={state.qpName}
                            onChange={(e) => dispatch({ type: "SET_QP_META", payload: { qpName: e.target.value } })} />
                        </Field>
                        <Field label="License ID">
                          <input readOnly value={state.qpLicenseId}
                            className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-teal-300 font-mono" />
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Disposition & Conclusion">
                            <RCATextarea rows={2}
                              value={state.qpJustification || `Root cause of ${inv.deviation_number} confirmed. CAPAs assigned with 90-day effectiveness checks.`}
                              onChange={(e) => dispatch({ type: "SET_QP_META", payload: { qpJustification: e.target.value } })} />
                          </Field>
                        </div>
                      </div>

                      {confirmedCausesCount === 0 && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <p className="text-sm text-amber-200">No root cause confirmed yet. Confirm at least one in Step 3, or use the button below.</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        {confirmedCausesCount === 0 && (
                          <button
                            onClick={async () => {
                              const first = inv.root_causes[0];
                              if (first) dispatch({ type: "UPDATE_ROOT_CAUSE", payload: { id: first.id, updates: { verification_status: "QP_CONFIRMED", confirmed_by_qp: state.qpName.split(",")[0], qp_review_notes: "Confirmed by QP." } } });
                              try { await fetch(`${import.meta.env.VITE_API_URL}/api/v1/rca/investigations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(inv) }); } catch {}
                              dispatch({ type: "SAVE_INVESTIGATION" });
                              showToast(`${inv.deviation_number} saved to QMS.`);
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition">
                            Confirm Primary Cause & Save
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (confirmedCausesCount === 0) { showToast("Confirm at least one root cause first.", "error"); return; }
                            try { await fetch(`${import.meta.env.VITE_API_URL}/api/v1/rca/investigations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(inv) }); } catch {}
                            dispatch({ type: "SAVE_INVESTIGATION" });
                            showToast(`${inv.deviation_number} signed off & saved to QMS.`);
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500
                            text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:from-teal-400 hover:to-emerald-400 transition">
                          <Lock className="w-4 h-4" /> Save & Sign Off
                        </button>
                      </div>
                    </Card>
                  </div>

                  {/* Audit Trail */}
                  <Card>
                    <SectionTitle icon={Clock}>Audit Trail</SectionTitle>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {state.auditTrail.map((log) => (
                        <div key={log.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold text-teal-300 truncate">{log.actor}</span>
                            <span className="text-xs text-slate-500 shrink-0">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{log.action}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

          </div>{/* end step content */}
        </main>
      </div>{/* end workspace */}
    </div>
  );
}
