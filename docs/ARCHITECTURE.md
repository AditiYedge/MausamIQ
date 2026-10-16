# System Architecture & Technical Design Document
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **System Name:** MausamIQ
- **Document Version:** 1.0.0
- **Architectural Style:** Decoupled Domain-Driven Single-Page Application (SPA) + High-Performance Scientific REST API
- **Date:** October 2026

---

## 1. Architectural Vision & Principles

The architectural foundation of **MausamIQ** is built around three non-negotiable principles:
1. **Separation of Presentation and Scientific Logic:** All agricultural vulnerability rules, climate indicator formulas, anomaly metrics, and growth-stage calculations reside strictly in the Python backend domain layer (`app/domain/`), never in frontend UI components.
2. **Determinism and Auditability:** Given the exact same inputs (district, crop, season/sowing date, climate dataset), the engine generates identical outputs. Every risk score is decomposable into its constituent triggered rules, threshold values, and bibliographic citations.
3. **Resilient Multilingual & Voice Integration:** The user interface decouples presentation from localization tokens. The Web Speech API is backed by continuous fallback to text input and structured deterministic intent routing.

---

## 2. High-Level System Context (C4 Model - Level 1)

```
+-----------------------------------------------------------------------------------------+
|                                        MausamIQ                                         |
+-----------------------------------------------------------------------------------------+
                                             |
         +-----------------------------------+-----------------------------------+
         |                                   |                                   |
         v                                   v                                   v
+------------------+               +-------------------+               +------------------+
|      Farmer      |               |     Extension     |               |    Researcher    |
| (Marathi, Hindi, |               |   Officer / KVK   |               |   / Agronomist   |
|  Voice & Visual) |               |  (What-If Scenarios)|               | (Audit & Exports)|
+------------------+               +-------------------+               +------------------+
         |                                   |                                   |
         +-----------------------------------+-----------------------------------+
                                             |
                                             v
                           +-----------------------------------+
                           |         Frontend Client           |
                           |   React 18 / TypeScript / Vite    |
                           |  - Leaflet Map (Maharashtra)     |
                           |  - Trilingual UI (en / hi / mr)   |
                           |  - Web Speech API (Voice In/Out)  |
                           |  - Recharts / Canvas Charts       |
                           +-----------------------------------+
                                             |  JSON / HTTPS
                                             v
                           +-----------------------------------+
                           |       Backend API Gateway         |
                           |      FastAPI (Python 3.11)        |
                           |  - Request Validation (Pydantic)  |
                           |  - CORS & Rate Limiting           |
                           |  - Intent Routing Subsystem       |
                           +-----------------------------------+
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
                   v                                                   v
+------------------------------------+               +------------------------------------+
|       Domain Analytics Layer       |               |        Data & Storage Layer        |
|  - Climate Indicators (Pandas)     |               |  - IMD Observations & Baselines    |
|  - Phenology & Growth Stages       | <-----------> |  - Maharashtra District Boundaries |
|  - Deterministic Rule Engine       |               |  - Versioned Agronomic Rules       |
|  - What-If Scenario Simulator      |               |  - SQLite / PostgreSQL Store       |
|  - Natural Language Explanations   |               |  - Provenance & Audit Registry     |
+------------------------------------+               +------------------------------------+
```

---

## 3. Component Architecture & Layering

### 3.1 Frontend Architecture (`frontend/src/`)
- **`i18n/`**: Localization subsystem providing `LanguageContext`, dictionary stores (`en.json`, `hi.json`, `mr.json`), and agricultural terminology glossary (`glossary.ts`).
- **`voice/`**: `useSpeechRecognition` hook wrapping browser speech recognition with language hints (`mr-IN`, `hi-IN`, `en-IN`), permission checks, editable buffer; `useSpeechSynthesis` hook for audio readout.
- **`components/`**: Atomic and composite UI components:
  - `Header` & `Navigation`: Language switcher, voice assistant trigger, brand identity.
  - `DistrictMap`: Interactive Leaflet choropleth/marker view of Maharashtra districts.
  - `ClimateCharts`: Time-series rainfall, temperature departures, and dry-spell histograms.
  - `GrowthStageTimeline`: Visual phenology stepper showing stress points.
  - `RiskBadge` & `ExplanationCard`: Categorical badges with deep-dive audit drawers.
- **`pages/`**: Main application views:
  - `LandingPage`: Educational product introduction and methodology overview.
  - `DashboardPage`: Unified quick-assessment view.
  - `ClimateAnalysisPage`: Meteorological deep dive (rainfall, CDD, heatwaves, baselines).
  - `CropRiskPage`: In-depth crop-stage vulnerability assessment.
  - `WhatIfLabPage`: Interactive climate lever simulator.
  - `CropComparisonPage`: Multi-crop resilience evaluator.
  - `DataMethodologyPage`: Scientific citations, formulas, and source metadata.
  - `SettingsPage`: Dialect, units, audio settings, and accessibility preferences.

### 3.2 Backend Architecture (`backend/app/`)
- **`api/v1/`**: FastAPI REST endpoints with typed Pydantic v2 schemas:
  - `/health`: Health status, runtime stats, dataset checksums.
  - `/locations`: Maharashtra districts, agro-climatic zones, and coordinates.
  - `/crops`: 10 supported crops with localized labels and phenology templates.
  - `/climate`: Historical observations, baselines, CDD calculations, anomalies.
  - `/assessments`: Core crop-climate risk assessment endpoint.
  - `/scenarios`: What-if simulation engine.
  - `/rules`: Declarative rule catalogue inspection.
  - `/voice`: Multilingual intent routing pipeline.
  - `/export`: Comprehensive PDF/HTML/JSON report generation.
- **`domain/`**:
  - `climate/`: Indicators (`rainfall_total`, `rainfall_anomaly_pct`, `consecutive_dry_days`, `heavy_rainfall_days`, `temperature_anomalies`).
  - `crops/`: Phenological progression models based on Sowing Date.
  - `risk/`: Rule evaluation engine executing condition checks against climate metrics.
  - `scenarios/`: Perturbation model adjusting baseline inputs without data contamination.
  - `explanations/`: Natural language synthesis combining triggered rules into human-readable English, Hindi, and Marathi narratives.
  - `voice_intent/`: Keyword-phrase entity extractor mapping natural speech to structured API queries.

---

## 4. Data Flow: End-to-End Risk Assessment

1. **Input Submission:** User specifies District (`Nashik`), Crop (`Soybean`), Season (`Kharif 2024`), and Sowing Date (`2024-06-25`).
2. **Validation:** FastAPI verifies district validity and date boundaries.
3. **Climate Metric Extraction:** Domain service queries historical climate observations for Nashik between 2024-06-01 and 2024-10-31, comparing daily observations against 1981–2010 IMD baselines.
4. **Phenological Mapping:** Computes Days After Sowing (DAS) and identifies active growth stage (e.g., Flowering / Pod Formation at DAS 50–70).
5. **Rule Matching:** Evaluates all rules targeting `soybean` under active or cumulative stages:
   - *Rule SOY-CDD-01:* If CDD $\ge 12$ days during Pod Formation $\rightarrow$ Risk = High (Yield penalty from moisture stress).
   - *Rule SOY-RAIN-02:* If Kharif Rainfall Anomaly $\le -25\%$ $\rightarrow$ Risk = Moderate.
6. **Risk Aggregation:** Combines triggered rule severities using maximum severity with multi-factor escalation.
7. **Explanation Synthesis:** Constructs localized rationale explaining the why, linking to ICAR/KVK references.
8. **Delivery:** JSON response received by frontend; rendered in UI cards, highlighted on map, and made ready for voice readout.

---

## 5. Security, Reliability & Privacy Architecture

- **No Server Audio Storage:** Speech recognition runs directly in the client browser via Web Speech API; audio streams never touch the server disk.
- **Deterministic Guardrails:** Voice queries are parsed by a strict intent router mapping to pre-defined domain functions; no arbitrary SQL or script execution.
- **Input Sanitization:** All query parameters and JSON payloads are validated against strict Pydantic schemas.
- **Graceful Degradation:** If Web Speech is unsupported or blocked by browser permissions, the UI seamlessly provides text input without interruption.
