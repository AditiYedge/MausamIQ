# Research Methodology & Scientific Integrity Specification
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Research Discipline:** Applied Agricultural Climatology & Decision-Support Engineering
- **Geography:** Maharashtra State, India (All 36 Districts)
- **Status:** Baseline Research Methodology

---

## 1. Research Objectives & Problem Formulation

### 1.1 Academic Objectives
1. **Investigate Seasonal Climate Volatility:** Quantify intra-seasonal variations in rainfall distribution, dry spell occurrences, and temperature departures across Maharashtra's distinct agro-climatic zones.
2. **Formulate Explainable Crop Exposure Rules:** Develop a transparent, rule-based framework linking documented meteorological indicators to crop-specific vulnerability thresholds across defined phenological stages.
3. **Bridge Decision-Support Gaps:** Create an interactive, accessible digital system serving farmers, extension workers, and researchers in English, Hindi, and Marathi with voice and visual interaction.
4. **Enforce Absolute Research Honesty:** Prohibit speculative or unvalidated black-box AI/ML claims. Provide full mathematical traceability and explicit data provenance for every output.

### 1.2 Core Research Questions (RQs)
- **RQ-1 (Climatic Anomaly Identification):** How do seasonal rainfall totals and intra-seasonal dry spell lengths depart from 30-year climatological baselines (1981–2010 LPA) across Maharashtra?
- **RQ-2 (Phenological Sensitivity):** How does the coincidence of a dry spell or extreme precipitation event with a sensitive crop growth stage (e.g., podding in Soybean, boll development in Cotton, grain filling in Wheat) amplify agronomic exposure compared to non-sensitive vegetative phases?
- **RQ-3 (Explainability & Decision Support):** Can a declarative, transparent rule registry provide more actionable, trusted guidance to agricultural field practitioners than opaque black-box predictions?
- **RQ-4 (Hypothetical Sensitivity Analysis):** How do incremental perturbations in precipitation ($-20\%$ to $-40\%$) or dry spell duration ($+7$ to $+14$ days) shift crop risk classifications in water-stressed districts like Solapur, Beed, or Akola?

---

## 2. Research Design & Analytical Workflow

```
+-----------------------------------------------------------------------------------+
|                        1. Data Ingestion & Quality Control                        |
| - Verify IMD gridded daily rainfall and temperature observations                  |
| - Audit against 30-year climatological normals (1981-2010 baseline)               |
| - Check completeness (missing ratio < 15%) without zero-imputation                |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     2. Meteorological Indicator Derivation                        |
| - Cumulative Seasonal Rainfall (mm) & Anomaly Departure (%)                       |
| - Maximum Consecutive Dry Days (CDD, threshold < 2.5 mm/day)                      |
| - Heavy Precipitation Events (>= 64.5 mm/day, IMD definition)                     |
| - Extreme Temperature Days & Thermal Heat Index                                   |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                      3. Crop Phenological Synchronization                         |
| - Model Days After Sowing (DAS) from specified Sowing Date                        |
| - Map to active growth stage (Sowing, Vegetative, Flowering/Podding, Maturity)   |
| - Compute stage-coincident environmental stresses                                 |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                     4. Deterministic Rule Engine Evaluation                       |
| - Match active rules from versioned Registry (ICAR / KVK / SAU verified)          |
| - Evaluate logical conditions against computed indicators                         |
| - Record triggered rules, evidence citations, and missing variables               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                    5. Risk Aggregation & Explainable Synthesis                    |
| - Determine categorical risk (Low, Moderate, High, Very High, Insufficient Data)  |
| - Generate natural language explanations in English, Hindi, and Marathi           |
| - Render interactive visual cards, geospatial map, and auditable reports          |
+-----------------------------------------------------------------------------------+
```

---

## 3. Evaluation & Validation Without Black-Box ML

Because MausamIQ explicitly rejects fabricating model accuracy scores, academic validation is achieved through:
1. **Mathematical Hand-Calculation Benchmarks:** Unit tests verifying anomaly calculations, dry-spell streak counters, and rule condition triggers against hand-calculated meteorological tables.
2. **Sensitivity Analysis:** Testing system stability when varying rainfall by $\pm 10\%, \pm 20\%, \pm 30\%$ and evaluating whether risk level shifts follow expected biological trends.
3. **Boundary Condition & Edge Case Testing:**
   - Zero rainfall periods vs. continuous rainfall periods.
   - Leap years and variable month lengths.
   - Sowing dates at extremes of the planting window.
   - Missing data segments (flagged as `insufficient_data`).
4. **Agronomic Expert Rule Verification:** Rule thresholds cross-referenced directly with published advisory packages from MPKV Rahuri, Dr. PDKV Akola, VNMKV Parbhani, and ICAR institutes.
