# MausamIQ: Climate Change and Seasonal Variation Impact on Agriculture

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20Python%203.11-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**MausamIQ** is an explainable, data-driven agricultural climate-risk assessment and decision-support platform engineered specifically for **Maharashtra, India**. 

It evaluates intra-seasonal climate variability (rainfall departures from 30-year IMD baselines, prolonged dry spells, extreme rainfall occurrences, and temperature shifts) against phenological growth-stage vulnerability thresholds for 10 key field crops.

---

## Key Capabilities

1. **Deterministic & Explainable Crop Climate-Risk Engine:**
   - 10 Target Crops: Soybean, Cotton, Rice, Jowar, Bajra, Wheat, Chickpea, Pigeonpea, Maize, Sugarcane.
   - Declarative rules citing research from ICAR, MPKV Rahuri, and Dr. PDKV Akola.
   - Full audit trail: Every assessment decomposes into specific triggered rules, indicator values, and citations.
   - Zero black-box machine learning; strict scientific honesty without fabricated yield loss claims.

2. **Full Trilingual Localization:**
   - English (`en`), Hindi (`hi`), and Marathi (`मराठी`) supported natively across all navigation, forms, risk breakdowns, and advisories.

3. **Multilingual Voice Interaction:**
   - Speech-to-text input with live capability check, microphone permissions, and editable transcript modal.
   - Spoken audio readout (SpeechSynthesis) of risk explanations in Marathi, Hindi, or English.
   - Deterministic intent router mapping natural vernacular queries into structured analytical operations.

4. **Interactive Geospatial & Visual Analytics:**
   - Interactive Leaflet Maharashtra district map displaying rainfall departures and risk categorizations.
   - Growth-stage phenology timeline tracking stress points from Sowing to Maturity.
   - Climate time series charts (Rainfall vs. 1981–2010 Normal, Consecutive Dry Days, Heavy Precipitation events).

5. **What-If Simulation Laboratory:**
   - Interactive climate levers allowing users to simulate rainfall adjustments ($\pm 40\%$), temperature shifts, dry spell extensions, and altered sowing dates.

6. **Comprehensive Documentation Suite:**
   - [`docs/PRD.md`](docs/PRD.md): Product Requirements Document.
   - [`docs/SRS.md`](docs/SRS.md): Software Requirements Specification (`FR-001` to `FR-020`).
   - [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): System Architecture & C4 Diagrams.
   - [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md): IMD / ICAR provenance & missing-data policy.
   - [`docs/RESEARCH_METHODOLOGY.md`](docs/RESEARCH_METHODOLOGY.md): Academic methodology & research questions.
   - [`docs/RISK_METHODOLOGY.md`](docs/RISK_METHODOLOGY.md): Mathematical formulas and rule aggregation.
   - [`docs/API.md`](docs/API.md): OpenAPI specification.
   - [`docs/DATABASE.md`](docs/DATABASE.md): Schema & entity relationships.
   - [`docs/LOCALIZATION_AND_VOICE.md`](docs/LOCALIZATION_AND_VOICE.md): Vernacular & Web Speech architecture.
   - [`docs/TESTING.md`](docs/TESTING.md): Quality assurance & test cases.
   - [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Production readiness & Docker deployment.
   - [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md): Transparent scientific boundaries.

---

## Quickstart

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm 9+

### 1. Backend API Server Setup
```powershell
# From project root:
.\.venv\Scripts\python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Web Client Setup
```powershell
# From project root:
cd frontend
npm install
npm run dev
```
Client will be live at `http://localhost:5173`.

### 3. Running Test Suites
```powershell
# Run backend scientific & API tests
.\.venv\Scripts\pytest -v backend/tests/
```
