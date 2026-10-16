# Crop Climate-Risk Methodology & Rule Engine Specification
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Engine Type:** Declarative, Explainable, Deterministic Agro-Climatic Rule Engine
- **Target Crops:** 10 Maharashtra Field Crops
- **Status:** Baseline Specification

---

## 1. Mathematical Definitions of Climate Indicators

### 1.1 Cumulative Rainfall & Normal Anomaly
Let $r_t$ be the daily precipitation observed on day $t \in [1, N]$ within the target season, and let $R_{\mathrm{normal}}$ be the 30-year Long-Period Average (LPA) baseline normal for the district:

$$\text{Cumulative Rainfall } R_{\mathrm{obs}} = \sum_{t=1}^{N} r_t \quad (\text{where } r_t \text{ is valid and not null})$$

The **Percentage Rainfall Anomaly** ($A_{\%}$) is computed as:
$$A_{\%} = \left( \frac{R_{\mathrm{obs}} - R_{\mathrm{normal}}}{R_{\mathrm{normal}}} \right) \times 100$$

Following IMD meteorological conventions:
- **Excess:** $A_{\%} \ge +20\%$
- **Normal:** $-19\% \le A_{\%} \le +19\%$
- **Deficient:** $-59\% \le A_{\%} \le -20\%$
- **Scanty:** $A_{\%} \le -60\%$

### 1.2 Consecutive Dry Days (CDD)
A dry day is defined as any day where daily rainfall $r_t < 2.5\text{ mm}$ (standard IMD definition):
$$\text{CDD} = \max_{k} \left\{ \text{length of contiguous sequence where } r_t < 2.5\text{ mm} \right\}$$

### 1.3 Heavy Rainfall Events
A heavy rainfall event is defined as any single calendar day where:
$$r_t \ge 64.5\text{ mm} \quad (\text{IMD Heavy Rainfall criterion})$$
Very heavy rainfall: $r_t \ge 115.6\text{ mm}$.

### 1.4 Heat Stress Indicator ($T_{\mathrm{stress}}$)
Maximum temperature threshold violation during flowering or grain-filling stages:
$$T_{\mathrm{max}} \ge T_{\mathrm{critical}} \quad (\text{e.g., } 35^\circ\text{C for Wheat, } 38^\circ\text{C for Soybean})$$

---

## 2. Risk Classification Framework

Risk classifications do NOT indicate crop loss percentages. They represent **climatic exposure and management urgency categories**:

| Risk Category | Color Code | Operational Meaning | Suggested Agronomic Posture |
| :--- | :--- | :--- | :--- |
| **Low** | Forest Green (`#1E5E3A`) | Observed climate conditions fall within optimal or tolerable physiological ranges. | Standard agronomic management; maintain regular monitoring. |
| **Moderate** | Amber Gold (`#B7791F`) | Sub-optimal conditions detected (e.g., mild dry spell or minor rainfall deficit). | Prepare supplemental protective irrigation; mulch to conserve soil moisture. |
| **High** | Coral Rust (`#C53030`) | Severe climatic stress detected (e.g., prolonged dry spell during flowering or extreme waterlogging). | Immediate protective measures required: foliar sprays (KNO3), drainage channels, protective irrigation. |
| **Very High** | Deep Crimson (`#9B2C2C`) | Compounded or catastrophic weather exposure (e.g., severe rainfall failure or acute heatwave coincident with reproduction). | Consult local KVK extension officers immediately for contingency crop planning. |
| **Insufficient Data** | Muted Slate (`#718096`) | Climate observations for the selected period are $< 75\%$ complete. | Rely on local meteorological advisories; assessment withheld to prevent erroneous conclusions. |

---

## 3. Versioned Rule Registry Structure

Each rule in the registry has the declarative JSON structure:
```json
{
  "rule_id": "SOY-CDD-01",
  "version": "1.0.0",
  "crop_id": "soybean",
  "crop_name": "Soybean",
  "applicable_stages": ["flowering_podding"],
  "season": "kharif",
  "indicator": "consecutive_dry_days",
  "operator": ">=",
  "threshold": 12,
  "unit": "days",
  "risk_category": "high",
  "source_citation": "ICAR-Indian Institute of Soybean Research (IISR), Technical Bulletin No. 42 / MPKV Advisory Guidelines",
  "evidence_classification": "verified_research_literature",
  "explanation_en": "Soybean is critically sensitive to moisture stress during flowering and pod development. A dry spell exceeding 12 consecutive days causes substantial flower drop and impaired pod filling.",
  "explanation_hi": "फूल आने और फली बनने के दौरान सोयाबीन नमी के प्रति अत्यधिक संवेदनशील होता है। 12 से अधिक दिनों का सूखा फूल झड़ने और फली न बनने का कारण बनता है।",
  "explanation_mr": "फुलधारणा आणि शेंगा भरण्याच्या काळात सोयाबीन पिकास पाण्याची अत्यंत गरज असते. सलग १२ दिवसांपेक्षा जास्त पावसाचा खंड पडल्यास फुलगळ आणि शेंगा पोचट राहण्याचा मोठा धोका निर्माण होतो."
}
```

---

## 4. Rule Aggregation & Conflict Resolution

When multiple rules trigger for a given crop and climate period:
1. **Dominant Severity Rule:** The overall category is determined by the highest severity triggered among all valid rules:
   $$\text{Overall Category} = \max \left( \text{Severity}(R_1), \text{Severity}(R_2), \dots, \text{Severity}(R_m) \right)$$
2. **Compound Escalation:** If two or more distinct indicators trigger a `Moderate` risk independently (e.g., Moderate Rainfall Deficit AND a Moderate Dry Spell), the compounded stress escalates the overall assessment to `High`.
3. **Traceability Guarantee:** The response output retains every triggered rule, the exact calculated metric value, the comparison operator, and the bibliographic citation.
