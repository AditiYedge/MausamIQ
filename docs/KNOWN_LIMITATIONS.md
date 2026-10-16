# Known Limitations, Boundary Conditions & Evidence Gaps
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Standard:** Absolute Academic & Scientific Honesty

---

## 1. Meteorological & Geospatial Boundaries

1. **Spatial Aggregation (District-Level Resolution):**
   - Climate indicators (precipitation, temperatures, CDD) reflect district-wide observations or gridded centroid approximations.
   - Micro-climatic variations (e.g. difference between Ghat-facing Western slopes and rain-shadow Eastern plains of Nashik or Pune) cannot be captured at single-station district resolution.
   - *User Guidance:* Never interpret district assessments as exact plot-level or farm-gate measurements.

2. **Climatological Reference Baselines:**
   - Calculations reference the IMD 1981–2010 Long-Period Average (LPA) or 1991–2020 updated normals.
   - Longitudinal shifts in monsoon onset dates over the last decade are currently treated as departures from the 1981–2010 normal.

3. **Missing Data Policy:**
   - If historical observations for a target seasonal window exhibit $> 15\%$ missing dates, the assessment is terminated with `status: insufficient_data`. Zero-imputation is strictly prohibited.

---

## 2. Agronomic & Biological Boundaries

1. **Absence of Black-Box Machine Learning:**
   - MausamIQ relies strictly on deterministic, versioned rules derived from published ICAR, KVK, and State Agricultural University literature.
   - It does NOT claim to use or train predictive neural networks, random forests, or black-box yield forecasters.

2. **Soil & Management Variable Exclusions:**
   - Current rule evaluations do not ingest dynamic soil moisture sensors, deep-profile water-holding capacity, or farmer irrigation schedules unless explicitly specified via What-If scenario levers.
   - Soil texture variation (e.g., shallow red soils vs. deep black cotton vertisols) strongly influences real-world drought resilience.

3. **Pest, Disease & Market Risks Excluded:**
   - Assessments evaluate *climatic exposure* only. Biotic pressures (e.g., pink bollworm in cotton, rust in wheat) and market volatility are outside platform scope.

---

## 3. Web Speech & Browser Environment Boundaries

1. **Browser Speech API Compatibility:**
   - SpeechRecognition is standard in Chromium-based browsers (Google Chrome, Microsoft Edge). Safari and Firefox provide varied or experimental support.
   - In unsupported browsers, microphone controls cleanly disable and present a helpful explanatory toast, seamlessly defaulting to text input.

2. **Vernacular Speech Recognition & Synthesis:**
   - While modern speech engines support `mr-IN` (Marathi) and `hi-IN` (Hindi), dialectal slang or noisy farm environments may yield transcription imperfections.
   - MausamIQ explicitly provides an **editable transcript field** before any query is dispatched to the analytical engine.
