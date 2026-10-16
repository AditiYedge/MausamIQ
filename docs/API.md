# REST API Specification (OpenAPI v3 Aligned)
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Base URL: `/api/v1`
Interactive Swagger Documentation available at: `/docs` (when server is running).
Interactive ReDoc Documentation available at: `/redoc`.

---

## 1. System & Metadata Endpoints

### `GET /health`
Returns system health, database connection status, and loaded dataset version.
- **Response 200 OK:**
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-17T00:00:00Z",
    "version": "1.0.0",
    "data_loaded": {
      "districts_count": 36,
      "crops_count": 10,
      "rules_count": 38,
      "observation_records": 18450
    }
  }
  ```

### `GET /metadata`
Returns platform metadata, reference baselines, versioned rule sets, and scientific sources.

---

## 2. Geography & Crop Catalog Endpoints

### `GET /locations`
Lists all 36 Maharashtra administrative districts grouped by agro-climatic zone.
- **Query Parameters:**
  - `zone` (optional): Filter by agro-climatic zone (e.g. `Vidarbha`, `Marathwada`).
- **Response 200 OK:** Array of district objects with canonical `district_id`, `district_name`, `name_mr`, `name_hi`, `latitude`, `longitude`, `normal_annual_rainfall_mm`, and `agro_climatic_zone`.

### `GET /crops`
Lists all 10 supported agricultural crops with botanical names, seasons, and localized display titles.

### `GET /crops/{crop_id}`
Retrieves detailed phenological growth stages, duration intervals, and water requirement profiles for a specific crop.

---

## 3. Climate Observations & Analytics Endpoints

### `GET /climate/summary`
Calculates cumulative rainfall, anomaly departure %, average temperatures, and missing data ratio for a specific district and seasonal window.
- **Query Parameters:**
  - `district_id` (required): e.g. `nashik`
  - `season` (required): `kharif`, `rabi`, `zaid`, or `annual`
  - `year` (required): integer (e.g. `2024`)
  - `baseline_period` (optional, default `1981-2010`)
- **Response 200 OK:**
  ```json
  {
    "district_id": "nashik",
    "district_name": "Nashik",
    "season": "kharif",
    "year": 2024,
    "start_date": "2024-06-01",
    "end_date": "2024-10-31",
    "rainfall_observed_mm": 685.4,
    "rainfall_normal_mm": 745.0,
    "rainfall_anomaly_pct": -8.0,
    "rainfall_classification": "Normal",
    "max_consecutive_dry_days": 11,
    "heavy_rainfall_days_count": 2,
    "mean_tmax_c": 30.4,
    "mean_tmin_c": 21.2,
    "data_completeness_pct": 100.0,
    "is_synthetic": false
  }
  ```

### `GET /climate/trends`
Provides time-series historical observations (2015–2024) for longitudinal trend analysis.

---

## 4. Assessment & Scenario Endpoints

### `POST /assessments`
Evaluates crop-specific, stage-specific climate risks using the deterministic rule engine.
- **Request Body:**
  ```json
  {
    "district_id": "nashik",
    "crop_id": "soybean",
    "season": "kharif",
    "year": 2024,
    "sowing_date": "2024-06-25",
    "language": "mr"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "assessment_id": "asm-2024-nsk-soy-01",
    "status": "completed",
    "district_id": "nashik",
    "crop_id": "soybean",
    "crop_name": "Soybean (सोयाबीन)",
    "season": "kharif",
    "year": 2024,
    "sowing_date": "2024-06-25",
    "active_growth_stage": "flowering_podding",
    "days_after_sowing": 65,
    "overall_risk_category": "moderate",
    "risk_score_numeric": 58,
    "indicators_summary": {
      "rainfall_anomaly_pct": -8.0,
      "consecutive_dry_days": 11,
      "heavy_rain_events": 2
    },
    "triggered_rules": [
      {
        "rule_id": "SOY-CDD-MOD-01",
        "indicator": "consecutive_dry_days",
        "operator": ">=",
        "threshold": 10,
        "observed_value": 11,
        "severity": "moderate",
        "citation": "ICAR-IISR Bulletin / MPKV Guidelines",
        "explanation": "सलग १० दिवसांपेक्षा जास्त पावसाचा खंड पडल्यामुळे फुलोरा अवस्थेत ओलाव्याची कमतरता जाणवू शकते."
      }
    ],
    "untriggered_rules_count": 4,
    "missing_indicators": [],
    "data_provenance": {
      "source": "IMD Pune Gridded Observations",
      "baseline": "1981-2010 Normal",
      "completeness_pct": 100.0
    },
    "actionable_advisory": "फुलोरा अवस्थेत जमिनीतील ओलावा टिकवण्यासाठी सेंद्रिय आच्छादन (mulching) वापरावे. शक्य असल्यास हलके संरक्षित पाणी द्यावे.",
    "limitations": [
      "Assessment is based on district-level meteorological indicators and does not account for micro-field soil percolation variations."
    ]
  }
  ```

### `POST /scenarios`
Runs what-if climate lever simulations without mutating baseline records.
- **Request Body:**
  ```json
  {
    "district_id": "akola",
    "crop_id": "cotton",
    "season": "kharif",
    "year": 2024,
    "sowing_date": "2024-06-20",
    "perturbations": {
      "rainfall_delta_pct": -25.0,
      "temperature_delta_c": +1.5,
      "dry_spell_delta_days": +6
    }
  }
  ```

### `GET /crops/compare`
Compares vulnerability of multiple crops under the identical climate profile of a given district and season.

---

## 5. Voice & Intent Routing Endpoint

### `POST /voice/intent`
Accepts natural language text or transcribed speech in English, Hindi, or Marathi, matches deterministic keywords and entities, and returns the structured action.
- **Request Body:**
  ```json
  {
    "transcript": "नाशिकमध्ये सोयाबीनचा जोखीम अहवाल दाखवा",
    "language": "mr"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "matched_intent": "crop_risk_assessment",
    "confidence": 0.95,
    "entities": {
      "district_id": "nashik",
      "crop_id": "soybean",
      "season": "kharif"
    },
    "suggested_action": "FETCH_ASSESSMENT",
    "formatted_query": "नाशिक - सोयाबीन (खरीप)"
  }
  ```
