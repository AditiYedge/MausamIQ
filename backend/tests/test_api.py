"""
Integration tests for FastAPI endpoints.
"""
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "platform" in data
    assert "version" in data


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["datasets"]["districts_count"] == 36
    assert data["datasets"]["crops_count"] == 10


def test_locations_endpoint():
    response = client.get("/api/v1/locations")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 36
    nashik = next((d for d in data if d["district_id"] == "nashik"), None)
    assert nashik is not None
    assert "name_mr" in nashik


def test_crops_endpoint():
    response = client.get("/api/v1/crops")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    soybean = next((c for c in data if c["crop_id"] == "soybean"), None)
    assert soybean is not None
    assert len(soybean["stages"]) >= 3


def test_assessment_flow():
    payload = {
        "district_id": "nashik",
        "crop_id": "soybean",
        "season": "kharif",
        "year": 2024,
        "sowing_date": "2024-06-25",
        "language": "mr"
    }
    response = client.post("/api/v1/assessments", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "assessment_id" in data
    assert data["district"]["id"] == "nashik"
    assert data["crop"]["id"] == "soybean"
    assert "risk_assessment" in data
    assert data["risk_assessment"]["overall_category"] in ["low", "moderate", "high", "very_high"]


def test_scenario_flow():
    payload = {
        "district_id": "akola",
        "crop_id": "cotton",
        "season": "kharif",
        "year": 2024,
        "sowing_date": "2024-06-20",
        "perturbations": {
            "rainfall_delta_pct": -25.0,
            "temperature_delta_c": 1.5,
            "dry_spell_delta_days": 6
        },
        "language": "en"
    }
    response = client.post("/api/v1/scenarios", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["is_simulation"] is True
    assert "comparison_summary" in data


def test_voice_intent_api():
    payload = {
        "transcript": "अकोल्यात कापसाचा जोखीम अहवाल दाखवा",
        "language": "mr"
    }
    response = client.post("/api/v1/voice/intent", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["entities"]["district_id"] == "akola"
    assert data["entities"]["crop_id"] == "cotton"
