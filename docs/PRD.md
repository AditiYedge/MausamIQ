# Product Requirements Document (PRD)
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Information
- **Product Name:** MausamIQ
- **Full Title:** MausamIQ: Climate Change and Seasonal Variation Impact on Agriculture
- **Version:** 1.0.0
- **Document Date:** October 2026
- **Status:** Approved / Active Baseline
- **Primary Geography:** Maharashtra, India (36 Districts across Konkan, Western Maharashtra, Marathwada, Vidarbha, and Khandesh)

---

## 1. Executive Summary & Product Vision

### 1.1 The Core Problem
Agricultural systems in Maharashtra are increasingly stressed by seasonal climatic volatility: erratic monsoon onsets, prolonged dry spells during critical vegetative/flowering windows, abrupt heavy precipitation events exceeding soil absorption capacities, and unseasonal heatwaves. 

Standard weather forecast applications offer generalized temperature and precipitation forecasts, but fail to answer the farmer's or agronomist's central operational question:
> *"Given observed climate variability and documented thresholds for my specific crop and its current growth stage, what is the exposure risk, why is that risk level assigned, and what agronomic factors drive it?"*

### 1.2 Core Product Proposition
MausamIQ is an **explainable, data-driven agricultural climate-risk assessment and decision-support framework**. It integrates validated historical climate observations (India Meteorological Department normals, gridded rainfall and temperature baselines), documented crop-specific agronomic thresholds (ICAR, State Agricultural Universities like MPKV Rahuri and PDKV Akola, and KVK guidance), and phenological growth-stage calendars across Maharashtra's key agro-climatic zones.

### 1.3 Key Non-Goals (Scientific Integrity)
To maintain strict research integrity:
1. **No Untrained Machine Learning Models:** MausamIQ does NOT claim to use or train black-box deep learning or predictive crop loss models. All risk classifications are deterministic, rule-based, and traceable to documented agro-climatic literature.
2. **Not a Weather Prediction Engine:** Historical observations and climatological baselines are strictly distinguished from operational forecasts.
3. **Not Automated Yield Guarantees:** Assessments represent *exposure and climate risk categories*, not actuarial crop damage or guaranteed harvest losses.
4. **No Replacement for Agronomists:** System outputs serve as decision-support intelligence for farmers, extension officers, and researchers, not legal or financial determinations.
5. **Zero Fabricated Data:** Missing observations are explicitly flagged as `insufficient_data` or `missing_indicators` and never silently imputed as zeros.

---

## 2. Target Users & Stakeholders

| User Persona | Context & Needs | Key Product Value |
| :--- | :--- | :--- |
| **Smallholder & Commercial Farmers** | Agricultural households in rural Maharashtra. Need accessible insights in Marathi and Hindi with voice guidance. | Multilingual voice assistance, simple growth-stage risk indicators, actionable plain-language explanations. |
| **Agricultural Extension Workers & KVKs** | Field coordinators and Krishi Vigyan Kendra personnel advising clusters of villages. | District-level comparison, what-if scenario simulations, printable analytical reports. |
| **Agricultural Students & Researchers** | Universities (MPKV, VNMKV, Dr. BSKKV, PDKV) studying climate vulnerability and seasonal trends. | Transparent mathematical formulas, documented rule sets, historical baselines, data provenance, and reproducible indicators. |
| **Academic Evaluators & Supervisors** | Engineering and research project committees. | Rigorous SRS/PRD traceability, zero scientific fabrication, audit trails, and deterministic calculations. |

---

## 3. Supported Languages

MausamIQ provides complete, first-class localization across all screens, navigation, forms, risk summaries, tooltips, and voice interactions:
- **English (`en`)**
- **हिंदी (`hi`)**
- **मराठी (`mr`)**

---

## 4. Geographic & Crop Catalog

### 4.1 Geographic Coverage (Maharashtra - 36 Districts)
All 36 administrative districts spanning Maharashtra's 5 agro-climatic regions:
1. **Vidarbha:** Nagpur, Amravati, Akola, Yavatmal, Wardha, Chandrapur, Gadchiroli, Bhandara, Gondia, Buldhana, Washim.
2. **Marathwada:** Chhatrapati Sambhajinagar (Aurangabad), Jalna, Beed, Nanded, Osmanabad (Dharashiv), Latur, Parbhani, Hingoli.
3. **Western Maharashtra:** Pune, Satara, Sangli, Kolhapur, Solapur, Ahmednagar.
4. **Khandesh (North Maharashtra):** Nashik, Jalgaon, Dhule, Nandurbar.
5. **Konkan:** Mumbai City, Mumbai Suburban, Thane, Palghar, Raigad, Ratnagiri, Sindhudurg.

### 4.2 Supported Crops
1. **Soybean (*Glycine max*)** — Oilseed, predominantly Kharif (Vidarbha, Marathwada).
2. **Cotton (*Gossypium hirsutum*)** — Fiber crop, Kharif/Extended (Vidarbha, Marathwada, Khandesh).
3. **Rice (*Oryza sativa*)** — Cereal, Kharif (Konkan, Eastern Vidarbha).
4. **Jowar / Sorghum (*Sorghum bicolor*)** — Cereal, Kharif & Rabi (Marathwada, Western Maharashtra).
5. **Bajra / Pearl Millet (*Pennisetum glaucum*)** — Cereal, Kharif (Khandesh, Western Maharashtra).
6. **Wheat (*Triticum aestivum*)** — Cereal, Rabi (Western Maharashtra, Vidarbha).
7. **Chickpea / Gram (*Cicer arietinum*)** — Pulse, Rabi (Marathwada, Vidarbha).
8. **Pigeonpea / Tur (*Cajanus cajan*)** — Pulse, Kharif/Long duration (Vidarbha, Marathwada).
9. **Maize (*Zea mays*)** — Cereal/Fodder, Kharif & Rabi.
10. **Sugarcane (*Saccharum officinarum*)** — Perennial/Cash crop (Western Maharashtra).

---

## 5. User Journeys

### Journey A: First-Time Visitor & Explorer
1. Enters landing page; greets user with clear visual identity and mission statement.
2. Selects language (Marathi / Hindi / English).
3. Explores high-level overview of Maharashtra climate variability and the explainable risk methodology.
4. Directly launches the interactive dashboard without mandatory authentication walls.

### Journey B: End-to-End Crop Climate-Risk Assessment
1. Selects district (e.g., Nashik) and crop (e.g., Soybean).
2. Selects agricultural season (Kharif) and optional Sowing Date.
3. System fetches observed climate variables (rainfall totals, normal baseline, dry spells, heavy rainfall days, mean temperatures).
4. Computes phenological growth stages (Sowing, Vegetative, Flowering/Pod Formation, Maturity).
5. Runs rule engine evaluating environmental indicators against documented agronomic vulnerability thresholds.
6. Presents overall risk category (`Low`, `Moderate`, `High`, `Very High`, or `Insufficient Data`).
7. User expands transparent audit cards displaying triggered rules, formulas, threshold origins, and evidence citations.
8. User exports comprehensive PDF/JSON report.

### Journey C: Multilingual Voice Interaction
1. User clicks microphone button in header or assistant modal.
2. Browser checks Web Speech API capability and mic permission.
3. User speaks in Marathi (e.g., *"नाशिकमधील पावसाचा कल आणि सोयाबीन जोखीम दाखवा"*).
4. System transcribes speech into an editable text field.
5. User confirms or edits text and submits.
6. Intent router extracts location (`Nashik`), crop (`Soybean`), indicator (`Rainfall Trend & Risk`).
7. System processes analytical request and displays visual assessment with text explanation.
8. User triggers audio playback (SpeechSynthesis) to hear the explanation in Marathi.

### Journey D: What-If Climate Scenario Simulation
1. Agronomist or student navigates to What-If Lab.
2. Selects baseline district (e.g., Akola) and crop (e.g., Cotton).
3. Modifies environmental levers:
   - Rainfall adjustment (-40% to +40%)
   - Temperature shift (-2°C to +4°C)
   - Dry spell extension (+5 to +20 days)
   - Sowing date shift (early by 15 days, late by 20 days)
4. Evaluates altered conditions through deterministic rule engine.
5. Views side-by-side comparative cards and delta metrics, clearly marked as **Hypothetical Simulation (Not a Forecast)**.

### Journey E: Cross-Crop Resilience Comparison
1. User selects district (e.g., Solapur) and time window.
2. Selects 2-4 candidate crops (e.g., Jowar vs. Bajra vs. Soybean).
3. System evaluates identical climatic exposure against each crop's biological thresholds.
4. Outputs multi-criteria matrix showing water requirement stress, dry-spell sensitivity, and heat tolerance.

---

## 6. Functional & Quality Acceptance Metrics
- **Reproducibility:** Two runs with identical inputs and rule-set version yield identical results down to floating point precision.
- **Traceability:** 100% of triggered risk rules link to published agronomic sources (ICAR/KVK/SAU) or are flagged as `Provisional Research Assumption`.
- **Latency:** Core rule-based risk calculation executes in < 50ms on the backend.
- **Accessibility:** Fully responsive across mobile (360px+), tablet, and desktop viewports, with WCAG 2.1 AA compliant color contrast.
