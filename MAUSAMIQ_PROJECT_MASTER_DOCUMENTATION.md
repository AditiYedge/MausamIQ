# MausamIQ: Complete Agricultural Climate-Risk Intelligence & Decision-Support Platform
## Comprehensive Technical, Scientific, Agronomic, and Operational Master Documentation

---

## 1. Executive Summary & Platform Identity

**MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture** is a specialized, production-grade agricultural climate-risk intelligence and decision-support system engineered specifically for the state of **Maharashtra, India**.

Unlike conventional consumer weather applications that solely display raw temperatures or generic precipitation percentages, MausamIQ bridges the gap between **meteorological observations** and **crop-specific physiological vulnerabilities at distinct phenological growth stages**.

### Key Highlights
- **Geographic Coverage:** All **36 districts of Maharashtra** across **5 agro-climatic zones** (South Konkan Coastal Zone, North Konkan Coastal Zone, Western Ghat / Sub-Montane Zone, Scarcity / Rain Shadow Zone, and Vidarbha/Marathwada Central Plateau).
- **Crop Scope:** **10 primary field crops** of regional food security and commercial importance: Soybean, Cotton, Rice (Paddy), Jowar (Sorghum), Bajra (Pearl Millet), Wheat, Chickpea (Gram / Chana), Pigeonpea (Tur / Arhar), Maize (Corn), and Sugarcane.
- **Scientific Foundation:** **Zero untrained or black-box ML models.** 100% deterministic, reproducible, auditable risk rule engine derived directly from peer-reviewed publications and advisory packages from the **Indian Council of Agricultural Research (ICAR)**, **Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri**, **Dr. Panjabrao Deshmukh Krishi Vidyapeeth (PDKV), Akola**, and **Vasantrao Naik Marathwada Krishi Vidyapeeth (VNMKV), Parbhani**.
- **Climatological Baseline:** **India Meteorological Department (IMD) Pune 1981–2010 (30-year) Long-Period Average (LPA)** district normals.
- **Vernacular Accessibility:** Full trilingual localization in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**, supported by multilingual **Web Speech Voice Input** (with transcript confirmation) and **Web SpeechSynthesis Audio Readout**.

---

## 2. Problem Statement & Agronomic Rationale

### Why Generic Weather Forecasts Fail Farmers
1. **Rainfall Volume ≠ Soil Moisture Availability:** 50 mm of rainfall falling in two hours causes runoff and topsoil erosion in shallow black soils, whereas 50 mm distributed across five gentle days replenishes the root zone.
2. **Vulnerability is Phenology-Dependent:** The identical climate shock produces radically different outcomes depending on when it occurs:
   - A **12-day dry spell** during the *vegetative stage* of Soybean (*Glycine max*) slows vegetative biomass accumulation but allows recovery once rains resume.
   - The same **12-day dry spell** during *flowering and pod formation (DAS 46–80)* causes irreversible flower shedding, pod abortion, and upwards of 40% yield loss (ICAR-IISR Bulletin No. 42).
3. **Black-Box AI Risks in Agriculture:** Farmers and extension workers cannot act on unexplainable probabilities. When an advisory recommends protective irrigation or foliar potassium nitrate spray, the user must inspect the exact triggered agronomic threshold and its peer-reviewed scientific citation.

---

## 3. System Architecture & Technology Stack

MausamIQ is engineered with a modular, decoupled full-stack architecture adhering to clean domain-driven design principles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (SPA)                           │
│  React 18 + TypeScript + Vite + Vanilla CSS System (WCAG 2.1 AA)       │
│  Leaflet.js Maps | Web Speech API (Voice/Audio) | Trilingual i18n     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FASTAPI BACKEND SERVICE                         │
│  FastAPI (Python 3.11) + Pydantic v2 Domain Schemas + CORS Middleware   │
│  ├── Domain Rule Engine (Deterministic Agronomic Rule Evaluator)       │
│  ├── Phenology Calculator (Days After Sowing -> Active Growth Stage)   │
│  ├── What-If Climate Simulator (Perturbation Sensitivity Engine)       │
│  └── Voice Intent Router (Rule-Based Vernacular Query Parser)          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ In-Memory Data Loaders
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       REPRODUCIBLE DATA STORES                         │
│  ├── maharashtra_districts.json (36 Districts, Zones, IMD Normals)    │
│  ├── crops_data.json (10 Crops, Stages, DAS Windows, Water Needs)     │
│  ├── risk_rules.json (Auditable Rules, Thresholds, Citations)          │
│  └── historical_climate.json (Verified Multi-Year Climate Records)    │
└────────────────────────────────────────────────────────────────────────┘
```

### Technology Matrix

| Layer | Component | Technology Selected | Technical Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Core View Engine | **React 18** (`react`, `react-dom`) | Declarative state-driven UI for instant scenario updates. |
| **Frontend Lang** | Type Safety | **TypeScript 5.x** | Strict domain typing prevents runtime interface mismatches. |
| **Frontend Style**| Visual Foundations | **Vanilla CSS Design Tokens** | Full layout control, zero bulky dependencies, fluid clamp typography. |
| **Mapping** | Spatial Visualizer | **Leaflet 1.9** (`leaflet`, `@types/leaflet`) | Lightweight interactive mapping without heavy commercial API keys. |
| **Icons** | Editorial Assets | **Lucide React** (`lucide-react`) | Crisp, accessible SVG iconography. |
| **Backend API** | Web Framework | **FastAPI 0.115+** | High-throughput asynchronous ASGI, automatic OpenAPI docs. |
| **Runtime** | Server Runtime | **Python 3.11** + **Uvicorn** | Fast execution, standard typing support, production stability. |
| **Domain Validation**| Schemas & Types | **Pydantic v2** (`pydantic>=2.0`) | Strict request/response payload parsing and serialization. |
| **Voice Processing**| Vernacular Audio | **Web Speech API** + Rule NLP | Zero-latency browser speech recognition without paid cloud APIs. |
| **Testing** | Verification | **Pytest** + **Vite Test** | Comprehensive domain logic and end-to-end regression testing. |

---

## 4. Deterministic Rule Engine & Agronomic Methodology

### Mathematical Formulation
Let an agricultural climate evaluation $E$ for a specified district $d$, crop $c$, observation year $y$, agricultural season $s$, and sowing date $t_{sow}$ be defined as:

$$E = f(I(d, y, s), \quad P(c, t_{sow}, t_{eval}), \quad \mathcal{R}(c))$$

Where:
1. **$I(d, y, s)$** is the vector of observed and baseline meteorological indicators:
   $$I = \left[ R_{obs}, R_{norm}, \Delta R_{\%}, CDD, N_{heavy}, T_{max} \right]$$
   - $R_{obs}$: Seasonal observed rainfall in millimeters.
   - $R_{norm}$: IMD 1981–2010 30-year normal rainfall in millimeters.
   - $\Delta R_{\%} = \frac{R_{obs} - R_{norm}}{R_{norm}} \times 100$: Rainfall anomaly percentage.
   - $CDD$: Maximum consecutive dry days ($daily\_rain < 2.5\text{ mm}$).
   - $N_{heavy}$: Count of heavy rainfall events ($daily\_rain \ge 64.5\text{ mm}$).
   - $T_{max}$: Mean seasonal maximum temperature in $^{\circ}\text{C}$.

2. **$P(c, t_{sow}, t_{eval})$** is the Crop Phenology Engine calculating:
   $$DAS = t_{eval} - t_{sow}$$
   Matching $DAS$ against crop stage intervals $[DAS_{start}, DAS_{end}]$ to identify active stage $S_{active}$.

3. **$\mathcal{R}(c)$** is the versioned agronomic rule repository. A rule $r_i$ triggers if:
   $$I_{observed}[k] \quad \odot_i \quad T_i = \text{True}$$
   Where $\odot_i \in \{>, \ge, <, \le, ==\}$ and $T_i$ is the empirical threshold.

### Quantitative Composite Risk Scoring
Each triggered rule contributes a numeric severity weight:
- **Low Risk:** 1 point
- **Moderate Risk:** 2 points
- **High Risk:** 3 points
- **Very High Risk:** 4 points

The final composite risk score $R_{score}$ is computed as:
$$R_{score} = \min\left(100, \quad \sum_{r \in \mathcal{R}_{triggered}} w_r \times 25 \times \text{StageWeight}(S_{active})\right)$$

Classification thresholds:
- **$0 \le R_{score} < 25$:** Low Risk (`low` — Green)
- **$25 \le R_{score} < 55$:** Moderate Risk (`moderate` — Amber)
- **$55 \le R_{score} < 80$:** High Risk (`high` — Crimson)
- **$R_{score} \ge 80$:** Very High Risk (`very_high` — Dark Maroon)
- **Data Incomplete (< 75% observations):** `insufficient_data` (Grey)

---

## 5. Peer-Reviewed Agronomic Rules Registry

Every single rule in MausamIQ is cited and auditable. Below is the documentation of core empirical rules configured in `backend/app/data/risk_rules.json`:

### 1. Soybean (*Glycine max*)
- **`SOY-CDD-HIGH-01`**: Consecutive dry days $\ge 12$ days during Flowering & Pod Formation ($DAS\ 46\text{–}80$).
  - *Severity:* High Risk.
  - *Agronomic Impact:* High soil moisture deficit triggers abscisic acid synthesis, leading to massive flower shedding and pod abortion.
  - *Advisory:* Apply protective sprinkler irrigation (25–30 mm) or foliar spray of 1% Potassium Nitrate ($KNO_3$) to mitigate thermal stress.
  - *Citation:* ICAR-IISR Bulletin No. 42 / MPKV Agro-advisory Manual.
- **`SOY-RAIN-DEF-01`**: Rainfall anomaly $\le -25\%$ across vegetative/flowering stages.
  - *Severity:* High Risk.
  - *Advisory:* Practice in-situ moisture conservation; inter-culture with daveni/hoeing to create dust mulch and conserve root-zone capillary water.
  - *Citation:* IMD Agro-meteorological Advisory Services / MPKV Rahuri.
- **`SOY-HEAVY-RAIN-01`**: Heavy rainfall days ($\ge 64.5\text{ mm}$) $\ge 2$ events in emergence ($DAS\ 0\text{–}15$) or maturity ($DAS\ 81\text{–}105$).
  - *Severity:* High Risk.
  - *Agronomic Impact:* Emergence waterlogging causes seed rot; maturity waterlogging leads to grain discoloration and pre-harvest sprouting.
  - *Citation:* VNMKV Parbhani Crop Protection Bulletin.

### 2. Cotton (*Gossypium hirsutum*)
- **`COT-CDD-MOD-01`**: Consecutive dry days $\ge 14$ days during Square & Boll Formation ($DAS\ 61\text{–}120$).
  - *Severity:* High Risk.
  - *Agronomic Impact:* Boll shedding and reduced fiber elongation.
  - *Citation:* ICAR-CICR Nagpur Technical Bulletin on Cotton Moisture Stress.
- **`COT-WATERLOG-01`**: Consecutive wet days $\ge 4$ or seasonal rainfall $> +30\%$ in heavy Vertisols.
  - *Severity:* High Risk.
  - *Agronomic Impact:* Cotton roots are exquisitely sensitive to anoxia (oxygen starvation), causing sudden wilting (parawilt).
  - *Citation:* Dr. PDKV Akola Cotton Advisory Bulletin.

### 3. Jowar (*Sorghum bicolor*) & Bajra (*Pennisetum glaucum*)
- **`JOW-DROUGHT-TOL-01`**: Consecutive dry days $10\text{–}15$ days during Vegetative stage.
  - *Severity:* Low to Moderate Risk.
  - *Agronomic Impact:* Sorghum possesses profound drought tolerance mechanisms (leaf rolling, waxy bloom, root suberization).
  - *Citation:* ICAR-IIMR Hyderabad Sorghum Production Technology.

### 4. Sugarcane (*Saccharum officinarum*)
- **`SUG-WATER-DEF-01`**: Seasonal rainfall anomaly $\le -20\%$ in non-canal command zones.
  - *Severity:* High Risk.
  - *Agronomic Impact:* Sugarcane requires 1500–2500 mm of water; severe deficits shorten internode length and drastically depress cane tonnage.
  - *Citation:* Vasantdada Sugar Institute (VSI) Pune Agronomy Handbook.

---

## 6. Meteorological Baselines & Non-Negotiable Missing Data Policy

### India Meteorological Department (IMD) Normals
- District baselines reflect official **IMD 1981–2010 (30-year) Long-Period Averages (LPA)** for Southwest Monsoon (Kharif: June–October) and Post-Monsoon / Winter (Rabi: October–February).
- Standard IMD Rainfall Classifications:
  - **Large Excess:** $+60\%$ or more
  - **Excess:** $+20\%$ to $+59\%$
  - **Normal:** $-19\%$ to $+19\%$
  - **Deficient:** $-20\%$ to $-59\%$
  - **Scanty / Large Deficient:** $-60\%$ to $-99\%$
  - **No Rain:** $-100\%$

### Mandatory Zero-Imputation Policy
A critical defect in commercial agricultural AI models is silently imputing missing weather station observations with zero (e.g. interpreting a disconnected rain gauge as a drought day).
**MausamIQ strictly rejects silent zero-imputation:**
1. If data completeness for the district-season observation period is **$< 75\%$**, the platform transparently withholds automated risk categorization.
2. The assessment state is formally returned as `insufficient_data` with a badge and user disclaimer: *"Observation completeness is below the required 75% academic threshold. Risk computation withheld to prevent scientific fabrication."*

---

## 7. Complete Application Page-by-Page Guide

### 1. Overview / Landing Page (`/` or `overview`)
- **Hero Section:** Clear value proposition framing the mission of bridging meteorological data to crop-specific physiology in Maharashtra.
- **The Maharashtra Agro-Climatic Challenge:** Explains intra-seasonal dry spells, crop phenology dynamics, and deterministic explainability.
- **4-Step Analytical Workflow:** Visual cards outlining (1) Meteorological Ingestion, (2) Phenology Mapping, (3) Rule Evaluation, and (4) Vernacular Advisory generation.
- **Stakeholder Personas:** Dedicated paths for Farmers/Extension Workers and Researchers/Evaluators.

### 2. Dashboard — Primary Assessment Hub (`dashboard`)
- **Control Panel:**
  - District Selector (all 36 Maharashtra districts with agro-climatic zone annotations).
  - Crop Selector (10 crops with botanical names).
  - Sowing Date Datepicker (defaults to typical seasonal sowing).
  - Season (Kharif / Rabi) & Observation Year (2022–2024).
  - `Assess Agro-Climatic Vulnerability` primary action button.
- **Dual Visual Workspace:**
  - **Left Column:** Interactive Leaflet map centered on Maharashtra ($19.25^\circ\text{N}, 75.8^\circ\text{E}$) with color-coded departure circle markers (Excess = Blue, Normal = Green, Deficient = Amber, Scanty = Red). Includes a Toggle to switch to a sortable District tabular list.
  - **Right Column:** Assessment Result Overview with composite Risk Badge, Days After Sowing (DAS) counter, and an interactive **Growth Stage Phenology Stepper** highlighting the active stage.
- **Action Toolbar:**
  - **Export Audit Report:** Downloads a self-contained, print-ready, standalone HTML audit report.
  - **What-If Lab Shortcut:** Transfers current district and crop selections into the sensitivity laboratory.
- **Comparative Meteorological Indicator Bars:** Visual bars comparing observed rainfall against IMD 1981–2010 normal with anomaly percentages. Extreme metric pills for Consecutive Dry Days (CDD), Heavy Rain Days, and Mean Max Temperature.
- **Audit Explanation Drawer:** Card displaying triggered rules, observed values vs. threshold conditions, academic literature citations, and a **Spoken Audio Readout** button.

### 3. Climate Analysis Page (`climate`)
- In-depth climatological analysis of any Maharashtra district.
- IMD Departure Standards explainer (Excess, Normal, Deficient, Scanty).
- Historical longitudinal Kharif rainfall trend charts comparing 2022, 2023, and 2024 against the 30-year normal.

### 4. Crop Risk Engine Catalogue (`croprisk`)
- Interactive repository of all 10 field crops.
- Crop metadata cards detailing water requirements (mm), total duration (days), primary season, and botanical classifications.
- Complete phenological breakdown into 4 developmental stages with start/end DAS and stage-specific physiological vulnerabilities.
- Full registry of versioned agronomic risk rules and literature citations.

### 5. What-If Simulation Laboratory (`whatif`)
- Sensitivity testbed designed for agronomists and climate researchers.
- **Interactive Perturbation Levers:**
  - Rainfall Adjustment Slider: $-40\%$ (Severe Drought) to $+40\%$ (Extreme Excess).
  - Temperature Shift Slider: $-2.0^\circ\text{C}$ to $+4.0^\circ\text{C}$ (Heatwave).
  - Dry Spell Extension Slider: $0$ to $+20$ days (Monsoon Break).
- **Side-by-Side Comparative Analysis:**
  - **Baseline Card:** Empirical historical baseline indicators and triggered rule count.
  - **Simulated Card:** Perturbed indicators, resulting risk category shift, and dynamic plain-language shift rationale.

### 6. Cross-Crop Resilience Comparison (`compare`)
- Direct side-by-side evaluation of candidate crops (e.g. Jowar vs. Bajra vs. Soybean vs. Cotton) under identical meteorological exposure.
- Allows toggling up to 5 crops simultaneously to compare water demand, growth lifecycle, and relative vulnerability.

### 7. Scientific Methodology & Data Provenance (`methodology`)
- Comprehensive mathematical formulation, equations, and scoring methodology.
- Peer-reviewed research provenance and university source citations.
- Interactive **Trilingual Agronomic Glossary** supporting live filtering across English, Hindi, and Marathi agricultural terminology.

### 8. User Preferences & Settings (`settings`)
- Dedicated vernacular voice settings, language selection cards, and speech synthesis testing workbench.

---

## 8. Multi-Device Responsive Architecture

MausamIQ incorporates an editorial agricultural responsive design system that functions seamlessly from **360px smartphones** up to **4K monitors**:

```
Responsive Viewport Tiers:
├── Mobile Phones (360px – 480px)
│   ├── Compact brand title & icon
│   ├── Mobile Hamburger Drawer (Slide-down with dedicated language selection block)
│   ├── Touch-friendly 24px slider thumbs with 1.15x active feedback
│   ├── Horizontally scrollable Growth Stage Stepper (min-width 85px per stage)
│   └── 1-column adaptive cards
├── Small Tablets & Foldables (481px – 768px)
│   ├── 2-column grid adaptation for metrics and parameters
│   └── Dynamic map container height (340px)
├── Laptops & Standard Monitors (769px – 1120px)
│   ├── Fluid clamp typography preventing line overflow
│   └── Clean navigation transition to responsive drawer at ≤1120px
└── Desktop & Wide Displays (1121px – 1440px+)
    ├── Complete 8-tab desktop navigation bar centered
    ├── Unified 32px height action strip (Language Pill Toggle, Voice Button, Info Button)
    └── Dual-column map and assessment dashboard
```

---

## 9. Vernacular Localization & Speech Architecture

MausamIQ provides first-class support for Maharashtra's linguistic diversity:

### Localization Architecture (`frontend/src/i18n/`)
- **`LanguageContext.tsx`**: Context provider managing platform state across `'mr'`, `'hi'`, and `'en'`, persisted to `localStorage`.
- **`locales/mr.json`**: Official Marathi localization using regional agronomic Devanagari terminology.
- **`locales/hi.json`**: Standard Hindi localization.
- **`locales/en.json`**: English reference dictionary.

### Speech Input & Output Pipeline
1. **Speech Recognition (`useSpeechRecognition.ts`)**: Integrates browser `webkitSpeechRecognition` / `SpeechRecognition` targeting `mr-IN`, `hi-IN`, or `en-IN`.
2. **Editable Transcript Review Modal**: Voice recordings are transcribed into an editable textarea before submission, allowing users to correct regional speech recognition ambiguities before execution.
3. **Intent Parsing Engine (`backend/app/domain/voice.py`)**:
   - Substring-based inflected Devanagari entity matcher handling inflected Marathi stems (e.g. "नाशिकमध्ये" $\rightarrow$ `nashik`, "अकोल्यात" $\rightarrow$ `akola`, "सोयाबीन" $\rightarrow$ `soybean`).
   - Automatically maps queries to platform routes (`assessment`, `what_if_simulation`, `rainfall_trend`, `crop_comparison`).
4. **Speech Synthesis (`useSpeechSynthesis.ts`)**: Audio readout of plain-language advisories via browser `window.speechSynthesis` with language-specific pitch and rate settings.

---

## 10. Backend REST API Specification

The FastAPI backend exposes versioned, OpenAPI-compliant endpoints at `/api/v1`:

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health check | None |
| `GET` | `/api/v1/locations` | All 36 Maharashtra districts | `zone` (optional filter) |
| `GET` | `/api/v1/crops` | 10 Supported field crops | `season` (optional filter) |
| `GET` | `/api/v1/climate/{district_id}` | District climate summary | `season`, `year` |
| `GET` | `/api/v1/climate/{district_id}/trends` | Multi-year historical trends | None |
| `POST` | `/api/v1/assessments/run` | Execute deterministic rule assessment | `district_id`, `crop_id`, `season`, `year`, `sowing_date`, `language` |
| `POST` | `/api/v1/scenarios/run` | Execute What-If perturbation simulation | Above + `perturbations: {rainfall_delta_pct, temperature_delta_c, dry_spell_delta_days}` |
| `GET` | `/api/v1/rules` | Complete versioned rule registry | `crop_id` (optional filter) |
| `POST` | `/api/v1/compare` | Compare multiple crops in a district | `district_id`, `crop_ids`, `season`, `year`, `language` |
| `POST` | `/api/v1/voice/intent` | Parse vernacular voice query | `query_text`, `language` |
| `POST` | `/api/v1/export/report-html` | Generate self-contained HTML audit report | `AssessmentResponse` JSON |

---

## 11. Operational Verification, Testing & Deployment

### Automated Backend Test Suite
The backend is covered by 22 automated unit and integration tests under `backend/tests/`:
```bash
# Execute Pytest Suite
.\.venv\Scripts\python -m pytest backend/tests/ -v
```
- `test_climate.py`: Anomaly formulas, completeness thresholds, CDD calculations.
- `test_phenology.py`: DAS calculations, stage boundaries, out-of-bounds dates.
- `test_rules.py`: Threshold evaluations, severity scoring, missing data handling.
- `test_api.py`: HTTP status codes, schema validation, multilingual query routing.

### Frontend Production Build
```bash
# Execute TypeScript Check and Vite Production Build
cd frontend
npm run build
```
Build output: 1,527 modules transformed and bundled into `dist/` with **0 errors**.

### Local Startup Commands
```powershell
# 1. Start Backend Dev Server (Port 8000)
$env:PYTHONPATH="."
.\.venv\Scripts\python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000

# 2. Start Frontend Dev Server (Port 5173)
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

---

## 12. Academic Citations & Authoritative References

1. **India Meteorological Department (IMD):** *Climate Diagnostics and Rainfall Statistics of Maharashtra State (1981–2010 Normal Baselines)*, Climate Application and Research Center, Pune, Ministry of Earth Sciences, Government of India.
2. **ICAR - Indian Institute of Soybean Research (ICAR-IISR):** *Soybean Production Technology and Climate Vulnerability Guidelines*, Technical Bulletin No. 42, Indore, Madhya Pradesh.
3. **ICAR - Central Institute for Cotton Research (ICAR-CICR):** *Agro-Meteorological Advisory Manual for Rainfed Cotton Production in Vidarbha and Central India*, Nagpur, Maharashtra.
4. **Mahatma Phule Krishi Vidyapeeth (MPKV):** *Agro-Meteorological Advisories and Dryland Crop Management Practices for Western Maharashtra and Scarcity Zones*, Department of Agricultural Meteorology, Rahuri, Ahmednagar.
5. **Dr. Panjabrao Deshmukh Krishi Vidyapeeth (PDKV):** *Package of Practices for Kharif Field Crops Under Variable Monsoon Regimes in Vidarbha*, Akola, Maharashtra.
6. **Vasantrao Naik Marathwada Krishi Vidyapeeth (VNMKV):** *Drought Contingency Planning and Crop Phenological Advisories for Marathwada Division*, Parbhani, Maharashtra.

---
*MausamIQ: Complete Agricultural Climate-Risk Intelligence Platform — Engineered for Academic Rigor, Transparent Agronomy, and Vernacular Accessibility.*
