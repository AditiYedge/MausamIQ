# Testing Strategy & Quality Assurance Plan
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Test Frameworks:**
  - Python: `pytest` 8.x + `httpx` (FastAPI TestClient)
  - Frontend: `vitest` / React Testing Library & Playwright browser test runners
- **Scientific Validation:** Deterministic hand-benchmarks for meteorological indicators and rule evaluations

---

## 1. Test Levels & Strategy

```
                      +---------------------------------------+
                      |         End-to-End (E2E) Browser      |
                      |  - Trilingual navigation & switching  |
                      |  - Complete assessment submission     |
                      |  - What-If slider scenario simulation |
                      +---------------------------------------+
                                          |
                      +---------------------------------------+
                      |       Integration & API Testing       |
                      |  - FastAPI endpoint contracts         |
                      |  - Pydantic request/response schemas  |
                      |  - Error handling & missing data flags|
                      +---------------------------------------+
                                          |
                      +---------------------------------------+
                      |        Domain Unit Testing            |
                      |  - Rainfall sum & anomaly calculation |
                      |  - CDD dry spell streak algorithm     |
                      |  - Phenology & growth stage projection|
                      |  - Deterministic rule matching engine |
                      +---------------------------------------+
```

---

## 2. Scientific Benchmark Test Cases

| Test Case ID | Target Component | Input Conditions | Expected Deterministic Output | Verification Standard |
| :--- | :--- | :--- | :--- | :--- |
| **TEST-SCI-001** | Rainfall Anomaly ($A_{\%}$) | Observed: $600\text{ mm}$, Baseline Normal: $750\text{ mm}$ | $A_{\%} = -20.0\%$ (Classification: Deficient) | Hand-calculated formula |
| **TEST-SCI-002** | CDD Algorithm | Daily rain sequence: `[0, 1.2, 0, 15.0, 0, 0, 0, 0, 2.1, 40.0]` | Max CDD streak $= 5$ (days 5 to 9, where rain $< 2.5\text{ mm}$) | IMD $< 2.5\text{ mm}$ dry day rule |
| **TEST-SCI-003** | Heavy Rain Days | Sequence: `[12.0, 65.0, 4.0, 118.0, 0.0]` | Heavy rain count $= 2$ ($\ge 64.5\text{ mm}$) | IMD heavy rain criteria |
| **TEST-SCI-004** | Missing Data Handling | 100 days requested, 20 days null | Missing count $= 20$, Completeness $= 80.0\%$, Status: `completed_with_limitations` | Zero-imputation strictly rejected |
| **TEST-SCI-005** | Rule Evaluation | Soybean flowering stage, CDD $= 14$ days | Trigger `SOY-CDD-01` $\rightarrow$ Severity: `high` | ICAR-IISR Bulletin #42 |
| **TEST-SCI-006** | Compound Escalation | Moderate dry spell + Moderate rainfall deficit | Escalates overall category from Moderate $\rightarrow$ `High` | Multi-factor risk escalation |
| **TEST-SCI-007** | Voice Intent Routing | Transcript: *"नाशिकमध्ये सोयाबीनचा पाऊस आणि जोखीम दाखवा"* (`mr`) | Intent: `crop_risk_assessment`, District: `nashik`, Crop: `soybean` | Multilingual intent dictionary |

---

## 3. How to Run the Test Suites

### 3.1 Backend Test Execution
```powershell
# From repository root
.\.venv\Scripts\pytest -v backend/tests/
```

### 3.2 Frontend Test Execution
```powershell
# From frontend directory
cd frontend
npm run test
```
