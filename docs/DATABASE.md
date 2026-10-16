# Database Architecture & Schema Specification
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Supported Database Engines:**
  - **Development / Standalone Mode:** SQLite 3 (zero-dependency, embedded local file store at `backend/app/db/mausamiq.db`).
  - **Production Mode:** PostgreSQL 15+ (configurable via `DATABASE_URL`).
- **ORM / Abstraction:** SQLAlchemy 2.0 / Declarative Core + Pydantic v2 schemas.

---

## 1. Entity Relationship Model

```
+-----------------------------------------------------------------------------------+
|                                 locations                                         |
|-----------------------------------------------------------------------------------|
| district_id (PK, VARCHAR)        | Canonical slug (e.g. 'nashik')                |
| district_name (VARCHAR)          | English name                                  |
| name_mr (VARCHAR)                | Marathi name (e.g. 'नाशिक')                   |
| name_hi (VARCHAR)                | Hindi name (e.g. 'नासिक')                     |
| agro_climatic_zone (VARCHAR)     | Agro-climatic zone classification             |
| latitude (FLOAT)                 | Geographic coordinate                         |
| longitude (FLOAT)                | Geographic coordinate                         |
| normal_annual_rf_mm (FLOAT)      | 30-year normal annual rainfall                |
+-----------------------------------------------------------------------------------+
          | 1
          |
          | N
+-----------------------------------------------------------------------------------+
|                            climate_observations                                   |
|-----------------------------------------------------------------------------------|
| id (PK, INTEGER)                 | Autoincrement surrogate key                   |
| district_id (FK, VARCHAR)        | References locations.district_id              |
| date (DATE)                      | Observation date (YYYY-MM-DD)                 |
| rainfall_mm (FLOAT)              | Daily rainfall in mm (NULL if missing)        |
| tmax_c (FLOAT)                   | Daily maximum temperature °C                  |
| tmin_c (FLOAT)                   | Daily minimum temperature °C                  |
| is_synthetic (BOOLEAN)           | Flags synthetic demo fixture records          |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                                   crops                                           |
|-----------------------------------------------------------------------------------|
| crop_id (PK, VARCHAR)            | Canonical slug (e.g. 'soybean')               |
| common_name_en (VARCHAR)         | English common name                           |
| common_name_mr (VARCHAR)         | Marathi common name                           |
| common_name_hi (VARCHAR)         | Hindi common name                             |
| botanical_name (VARCHAR)         | Latin botanical binomial                      |
| primary_season (VARCHAR)         | 'kharif', 'rabi', or 'annual'                 |
| total_duration_days (INT)        | Typical lifecycle length                      |
+-----------------------------------------------------------------------------------+
          | 1
          |
          | N
+-----------------------------------------------------------------------------------+
|                                crop_stages                                        |
|-----------------------------------------------------------------------------------|
| stage_id (PK, VARCHAR)           | Stage slug (e.g. 'flowering_podding')         |
| crop_id (FK, VARCHAR)            | References crops.crop_id                      |
| stage_name_en (VARCHAR)          | English stage label                           |
| stage_name_mr (VARCHAR)          | Marathi stage label                           |
| stage_name_hi (VARCHAR)          | Hindi stage label                             |
| start_das (INTEGER)              | Days After Sowing (start)                     |
| end_das (INTEGER)                | Days After Sowing (end)                       |
| sensitivity_factor (FLOAT)       | Agronomic vulnerability multiplier            |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                                risk_rules                                         |
|-----------------------------------------------------------------------------------|
| rule_id (PK, VARCHAR)            | Unique rule code (e.g. 'SOY-CDD-01')          |
| version (VARCHAR)                | Rule-set version (e.g. '1.0.0')               |
| crop_id (FK, VARCHAR)            | Target crop slug                              |
| applicable_stage (VARCHAR)       | Target stage or 'all'                         |
| indicator (VARCHAR)              | 'rainfall_anomaly', 'consecutive_dry_days'    |
| operator (VARCHAR)               | '>=', '<=', '>', '<', 'between'               |
| threshold_value (FLOAT)          | Critical threshold numerical cut-off          |
| risk_category (VARCHAR)          | 'low', 'moderate', 'high', 'very_high'        |
| source_citation (TEXT)           | Literature reference (ICAR/KVK/SAU)           |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
|                                assessments                                        |
|-----------------------------------------------------------------------------------|
| assessment_id (PK, VARCHAR)      | UUID or timestamped slug                      |
| created_at (DATETIME)            | Timestamp of assessment                       |
| district_id (FK, VARCHAR)        | References locations.district_id              |
| crop_id (FK, VARCHAR)            | References crops.crop_id                      |
| season (VARCHAR)                 | Season evaluated                              |
| year (INTEGER)                   | Year evaluated                                |
| sowing_date (DATE)               | Sowing date specified                         |
| overall_category (VARCHAR)       | Resulting risk category                       |
| rule_version (VARCHAR)           | Rule version evaluated against                |
| data_completeness_pct (FLOAT)    | Observation completeness ratio                |
+-----------------------------------------------------------------------------------+
```

---

## 2. Integrity Constraints & Indexing Strategy
- **Indexes:**
  - `idx_climate_obs_district_date` on `climate_observations(district_id, date)`: Speeds up seasonal window queries to $< 5\text{ ms}$.
  - `idx_rules_crop_stage` on `risk_rules(crop_id, applicable_stage)`: Speeds up rule retrieval.
- **Constraints:**
  - Foreign key cascades ensure orphan observations or assessments are prevented.
  - Check constraints ensure `rainfall_mm >= 0` and `data_completeness_pct BETWEEN 0 AND 100`.
