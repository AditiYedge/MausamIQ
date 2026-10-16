# Data Sources, Metadata & Provenance Specification
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Scope:** Complete provenance, access methods, quality assurance, and missing data policies for all datasets utilized in MausamIQ.
- **Geography:** Maharashtra State (36 Districts).

---

## 1. Primary Data Sources Directory

### 1.1 IMD Gridded Rainfall & Climatological Normals
- **Dataset Name:** India Meteorological Department (IMD) High-Resolution Daily Gridded Rainfall & District Normals.
- **Publisher:** India Meteorological Department (IMD), Ministry of Earth Sciences, Government of India / IMD Climate Research & Services, Pune.
- **Official Access Point:** IMD Pune Data Supply Portal (`https://www.imdpune.gov.in/` / `https://mausam.imd.gov.in/`).
- **Variables Utilized:**
  - `rainfall_mm`: Daily rainfall total (mm).
  - `rf_normal_mm`: Long-Period Average (LPA) monthly and seasonal rainfall normal (mm).
- **Spatial Resolution:** District aggregates across all 36 Maharashtra districts.
- **Reference Climatological Baseline Period:** 1981–2010 (30-year WMO-standard baseline for normal rainfall distribution) and 1991–2020 updated normals.
- **Temporal Resolution:** Daily observations aggregated seasonally (Kharif: June 1 – October 31; Rabi: October 1 – February 28; Zaid/Summer: March 1 – May 31).
- **Licensing & Attribution:** Open government data for academic and non-commercial decision support; IMD citation mandatory.

### 1.2 IMD Gridded Surface Temperature
- **Dataset Name:** IMD High-Resolution Daily Gridded Maximum and Minimum Temperature.
- **Publisher:** IMD National Climate Centre, Pune.
- **Variables Utilized:**
  - `tmax_c`: Daily maximum 2-meter air temperature (°C).
  - `tmin_c`: Daily minimum 2-meter air temperature (°C).
  - `tmean_c`: Derived daily mean temperature: $\frac{T_{\mathrm{max}} + T_{\mathrm{min}}}{2}$ (°C).
- **Baselines:** 30-year daily temperature means by district.
- **Applications:** Consecutive heatwave day detection ($T_{\mathrm{max}} \ge 40^\circ\text{C}$ or $+4.5^\circ\text{C}$ departure from normal during reproductive stages).

### 1.3 Crop Phenology & Agro-climatic Vulnerability Thresholds
- **Publishers:**
  1. **ICAR** (Indian Council of Agricultural Research) — Central Institute for Cotton Research (CICR Nagpur), Indian Institute of Soybean Research (IISR Indore).
  2. **Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri** — Agro-meteorological advisory guidelines for Western Maharashtra & Marathwada.
  3. **Dr. Panjabrao Deshmukh Krishi Vidyapeeth (PDKV), Akola** — Crop calendar and dryland farming guidelines for Vidarbha.
  4. **Vasantrao Naik Marathwada Krishi Vidyapeeth (VNMKV), Parbhani** — Pulses and oilseeds weather risk bulletins.
- **Variables & Metadata:**
  - `stage_name`: Sowing/Emergence, Vegetative, Flowering/Podding/Tasseling, Maturity/Ripening.
  - `stage_duration_days`: Minimum, standard, and maximum duration by agro-climatic zone.
  - `water_requirement_mm`: Seasonal and stage-specific evapotranspiration requirements.
  - `cdd_stress_threshold_days`: Consecutive Dry Days triggering mild, moderate, or severe yield penalties.
  - `excess_rain_threshold_mm`: Daily/3-day precipitation triggering waterlogging and root rot conditions.

---

## 2. Missing-Data & Data-Quality Policy

### 2.1 Non-Negotiable Scientific Principles
1. **No Silent Zero Imputation:** Missing precipitation records (`NaN`, `null`, missing date) are NEVER replaced with `0.0 mm`. Imputing zeros would falsely simulate a severe drought or artificial dry spell.
2. **Missing Ratio Thresholds:**
   - **Completeness $\ge 90\%$:** Full assessment calculation enabled; missing days explicitly noted in summary metadata.
   - **Completeness between $75\%$ and $89\%$:** Assessment generated with status `completed_with_limitations` and an explicit missing indicator advisory.
   - **Completeness $< 75\%$:** Assessment aborted or flagged as `insufficient_data`; no overall risk score is assigned.
3. **Synthetic Demonstration Fixtures:**
   - Clearly isolated in `backend/app/data/` or tagged with `is_synthetic: true`.
   - Never blended with empirical research data.
   - Distinct visual banner in UI whenever synthetic fixtures are loaded.

---

## 3. Geographic & Agro-Climatic Zone Classification (Maharashtra)

| Zone Code | Agro-Climatic Zone | Typical Annual Rainfall | Representative Districts | Dominant Target Crops |
| :--- | :--- | :--- | :--- | :--- |
| **ACZ-1** | South Konkan Coastal Zone | $2500 - 3500\text{ mm}$ | Ratnagiri, Sindhudurg | Rice, Sugarcane |
| **ACZ-2** | North Konkan Coastal Zone | $2000 - 3000\text{ mm}$ | Palghar, Thane, Raigad | Rice |
| **ACZ-3** | Western Ghat Zone (Ghatmatha) | $3000 - 5000\text{ mm}$ | Western fringes of Satara, Kolhapur, Pune | Rice, Millets |
| **ACZ-4** | Transition Zone 1 & 2 (Sub-montane) | $700 - 1250\text{ mm}$ | Kolhapur, Pune, Satara, Nashik | Soybean, Sugarcane, Maize, Wheat |
| **ACZ-5** | Scarcity Zone (Drought-Prone) | $500 - 750\text{ mm}$ | Solapur, Ahmednagar, parts of Sangli, Beed, Osmanabad | Jowar, Bajra, Chickpea |
| **ACZ-6** | Central Maharashtra Plateau (Marathwada) | $700 - 900\text{ mm}$ | Chhatrapati Sambhajinagar, Jalna, Latur, Parbhani, Nanded | Soybean, Cotton, Pigeonpea, Jowar |
| **ACZ-7** | Central Vidarbha (Moderate Rainfall) | $900 - 1100\text{ mm}$ | Amravati, Akola, Yavatmal, Wardha, Buldhana, Washim | Cotton, Soybean, Chickpea, Pigeonpea |
| **ACZ-8** | Eastern Vidarbha (High Rainfall) | $1100 - 1500\text{ mm}$ | Nagpur, Chandrapur, Gadchiroli, Bhandara, Gondia | Rice, Soybean, Cotton, Chickpea |
| **ACZ-9** | North Maharashtra (Khandesh) | $600 - 850\text{ mm}$ | Jalgaon, Dhule, Nandurbar | Cotton, Bajra, Maize |
