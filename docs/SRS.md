# Software Requirements Specification (SRS)
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Project Identifier:** AGRI-CLIM-MAUSAMIQ-2026
- **Version:** 1.0.0
- **Status:** Approved Baseline
- **Target OS / Environment:** Cross-platform Web (Chrome, Edge, Firefox, Safari) + Containerizable Linux/Windows Server

---

## 1. Introduction

### 1.1 Purpose
This document specifies the complete functional and non-functional requirements for **MausamIQ**, an explainable, data-driven agricultural climate-risk assessment and decision-support system tailored to Maharashtra, India.

### 1.2 Scope
MausamIQ ingests verified historical climate observations and normals, pairs them with phenological crop calendars and agronomic vulnerability thresholds, and evaluates crop climate-exposure risks deterministically. It provides a trilingual interface (English, Hindi, Marathi) with Web Speech API integrations, historical analytics, interactive geographic maps, what-if simulations, and transparent audit trails.

### 1.3 Definitions and Acronyms
- **IMD:** India Meteorological Department.
- **ICAR:** Indian Council of Agricultural Research.
- **KVK:** Krishi Vigyan Kendra (Agricultural Science Centres).
- **SAU:** State Agricultural Universities (MPKV, VNMKV, Dr. PDKV, Dr. BSKKV).
- **CDD:** Consecutive Dry Days (defined as contiguous days with daily precipitation $< 2.5\text{ mm}$).
- **Heavy Rainfall Day:** Daily rainfall $\ge 64.5\text{ mm}$ (IMD threshold classification).
- **Rainfall Anomaly ($A_{\%}$):** $\frac{R_{\mathrm{observed}} - R_{\mathrm{baseline}}}{R_{\mathrm{baseline}}} \times 100$.
- **Growth Stage:** Phenological phase of crop development (Sowing, Vegetative, Flowering/Podding, Maturity).
- **Rule Registry:** A versioned, declarative collection of agronomic threshold rules mapping climate conditions to risk states.

---

## 2. Overall Description

### 2.1 Product Perspective
MausamIQ is a client-server architecture consisting of:
1. **Frontend:** React 18 / TypeScript / Tailwind CSS Single Page Application with Leaflet map visualization and Web Speech interfaces.
2. **Backend API:** FastAPI (Python 3.11) with Pandas, NumPy, and Pydantic validation engines.
3. **Storage / Analytical Store:** SQLite (local development) / PostgreSQL with relational integrity and data provenance logs.

### 2.2 User Classes and Characteristics
1. **Rural Farmers & Farm Household Members:** Primary beneficiaries; prioritize native language (Marathi, Hindi), high contrast, voice inputs, and clear categorical risk ratings.
2. **Agronomists & Extension Officers:** Professional users; require growth-stage vulnerability breakdowns, indicator formulas, and printable reports.
3. **Climate & Agronomy Researchers:** Academic evaluators; require transparent data provenance, baseline definitions, rule registry versioning, and exportable data tables.

---

## 3. Specific Requirements & Stable Identifiers

### 3.1 Functional Requirements (FR)

| Req ID | Title | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-001** | Trilingual Localization | Support instant language switching between English (`en`), Hindi (`hi`), and Marathi (`mr`). | 100% of UI strings, form labels, tooltips, risk explanations, and error messages update immediately without resetting state. |
| **FR-002** | Maharashtra Location Selection | Searchable selection across all 36 Maharashtra administrative districts grouped by agro-climatic zones. | District selection provides coordinates, agro-climatic zone, and explicit note that data reflects district-level observations. |
| **FR-003** | Crop Catalogue & Stage Mapping | Support 10 target crops (Soybean, Cotton, Rice, Jowar, Bajra, Wheat, Chickpea, Pigeonpea, Maize, Sugarcane) with translated names and canonical IDs. | Selecting a crop displays botanical name, primary season (Kharif/Rabi/Zaid), and applicable growth stages. |
| **FR-004** | Historical Baseline & Observation Period | Allow selection of historical seasonal windows (e.g., Kharif June–Oct, Rabi Oct–Feb) and reference baselines (IMD 1981–2010 normal or 1991–2020 normal). | System displays exact start/end dates, total days, and reference normal period. |
| **FR-005** | Phenological Sowing Date Input | User can specify actual or estimated sowing date. | System calculates days after sowing (DAS) and projects current/historical growth stage based on documented crop calendars. |
| **FR-006** | Climate Dashboard Indicators | Calculate and visualize seasonal rainfall total, normal departure %, mean max/min temp, Consecutive Dry Days (CDD), and heavy precipitation events. | Calculations follow documented meteorological formulas. Incomplete observations flag missing count. |
| **FR-007** | Deterministic Risk Assessment | Evaluate crop-specific, stage-specific rules against climate indicators and output an explainable risk category (`Low`, `Moderate`, `High`, `Very High`, or `Insufficient Data`). | Output lists all triggered and untriggered rules with threshold comparisons and source citations. |
| **FR-008** | Growth Stage Timeline | Display an interactive visual timeline of crop development stages with climate vulnerability markers. | Shows estimated duration in days and specific climate vulnerabilities per stage (e.g. moisture stress at podding). |
| **FR-009** | Monsoon Dynamic Analysis | Analyze monsoon onset timing, prolonged dry spells ($> 14$ days in Kharif), and rainfall concentration. | Dry spell analysis computes maximum consecutive dry window and flags stage-coincident stress. |
| **FR-010** | What-If Scenario Simulation | Interactive simulation allowing users to modify rainfall ($-40\%$ to $+40\%$), temperature ($-2^\circ\text{C}$ to $+4^\circ\text{C}$), and dry spell lengths. | Engine re-evaluates rules and presents comparative delta cards clearly labeled as *Hypothetical Scenario (Not a Forecast)*. |
| **FR-011** | Cross-Crop Resilience Comparison | Compare multiple crops (e.g., Cotton vs. Soybean vs. Jowar) exposed to the same climate indicators. | Outputs side-by-side vulnerability matrix showing which crops remain in `Low` or `Moderate` risk under identical stresses. |
| **FR-012** | Data Provenance & Source Transparency | Every screen and metric exposes the underlying publisher, reference period, units, and methodological assumptions. | Clicking a provenance badge opens a modal detailing IMD/ICAR sources, licenses, and collection methodology. |
| **FR-013** | Speech Recognition (Voice Input) | Provide microphone interface for `en-IN`, `hi-IN`, and `mr-IN` via browser Web Speech API. | Detects browser support, requests microphone permission cleanly, transcribes audio to editable text field. |
| **FR-014** | Text Input Fallback | Text entry alternative always accessible alongside voice controls. | User can type queries in English, Hindi, or Marathi seamlessly. |
| **FR-015** | Speech Synthesis (Voice Readout) | Provide audio readout of assessment summary and risk explanations in selected language. | Includes Play / Pause / Stop controls; falls back to on-screen text when voice synthesis is unavailable. |
| **FR-016** | Controlled Intent Routing | Map recognized text/voice queries to structured scientific actions using a deterministic multilingual dictionary. | Handles intents: `climate_summary`, `rainfall_trend`, `crop_risk_assessment`, `dry_spell_analysis`, `what_if_simulation`, `help`. |
| **FR-017** | Printable Report Export | Export comprehensive assessment report containing inputs, indicators, triggered rules, sources, and limitations in JSON and printable format. | Export maintains all scientific caveats and provenance metadata. |
| **FR-018** | Transparent Missing Data Policy | Handle missing daily observations without zero-imputation. | If $> 15\%$ of seasonal daily data is missing, assessment status is set to `Insufficient Data` or explicit partial disclaimer is returned. |
| **FR-019** | Interactive Geospatial Map | Leaflet-based interactive Maharashtra map with district boundaries, rainfall departure overlays, and risk color markers. | Non-map textual fallback available; works smoothly on mobile touches. |
| **FR-020** | User Preference Persistence | Store user's selected language, recent district, and accessibility preferences in local storage. | Preferences survive page reload and navigation without requiring account creation. |

---

### 3.2 Non-Functional Requirements (NFR)

- **NFR-001 (Usability):** Farmers with non-technical backgrounds can complete a 3-step risk assessment in under 60 seconds.
- **NFR-002 (Responsiveness):** Fluid responsive layout tested across 360px (mobile), 768px (tablet), 1024px (laptop), and 1440px (desktop).
- **NFR-003 (Performance):** Backend calculation response time $< 100\text{ ms}$; initial frontend bundle load $< 1.5\text{ s}$ over standard 4G networks.
- **NFR-004 (Reliability):** Zero unhandled exceptions or white-screen crashes; structured error boundaries across all components.
- **NFR-005 (Maintainability):** Modular separation between presentation, API transport, domain climate analytics, and declarative rule definitions.
- **NFR-006 (Reproducibility):** Deterministic calculations guarantee that identical parameters produce byte-identical outputs.
- **NFR-007 (Accessibility):** WCAG 2.1 AA compliant text contrast, keyboard navigation, visible focus indicators, and screen reader labels.
- **NFR-008 (Security):** Strict input sanitization, CORS restrictions, no hardcoded API secrets, parameterized queries.
- **NFR-009 (Scientific Honesty):** Zero machine learning hallucination or speculative yield predictions.
- **NFR-010 (Observability):** Structured logging with request IDs, response times, and calculation audit logs.

---

### 3.3 Data Requirements (DATA)

- **DATA-001:** Climate datasets must store daily precipitation (mm), maximum temperature (°C), minimum temperature (°C), and mean temperature (°C) linked to administrative district codes.
- **DATA-002:** Reference baselines must specify the exact normal window (e.g., 1981–2010 or 1991–2020) and source authority (IMD Pune).
- **DATA-003:** Crop phenological calendars must define min, typical, and max duration in days for each growth stage across Kharif and Rabi seasons.
- **DATA-004:** Risk rules must declare crop ID, stage ID, indicator, operator (`>`, `<`, `between`), threshold values, risk severity, and literature citation.
- **DATA-005:** Synthetic demonstration fixtures must be explicitly tagged with `is_synthetic: true` and excluded from research aggregations.

---

### 3.4 Security & Privacy Requirements (SEC)

- **SEC-001:** All client-server communication must use secure HTTPS protocols in production.
- **SEC-002:** Voice input audio streams are processed locally in-browser; no persistent raw audio recordings are stored on server disks.
- **SEC-003:** Environment variables are strictly managed through `.env` files and validated via Pydantic settings.
- **SEC-004:** Public endpoints do not expose stack traces or server file system paths in error responses.
