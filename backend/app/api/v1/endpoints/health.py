"""
MausamIQ Health & System Diagnostics Endpoint.
"""
from fastapi import APIRouter
from datetime import datetime
import json
import os

router = APIRouter()


@router.get("/health", tags=["System"])
def get_health_status():
    """Returns application health, version, and loaded dataset metrics."""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    data_dir = os.path.join(base_dir, "data")
    
    districts_count = 0
    crops_count = 0
    rules_count = 0
    obs_count = 0
    
    districts_file = os.path.join(data_dir, "maharashtra_districts.json")
    if os.path.exists(districts_file):
        with open(districts_file, "r", encoding="utf-8") as f:
            districts_count = len(json.load(f))
            
    crops_file = os.path.join(data_dir, "crops_data.json")
    if os.path.exists(crops_file):
        with open(crops_file, "r", encoding="utf-8") as f:
            crops_count = len(json.load(f))
            
    rules_file = os.path.join(data_dir, "risk_rules.json")
    if os.path.exists(rules_file):
        with open(rules_file, "r", encoding="utf-8") as f:
            rules_count = len(json.load(f))
            
    obs_file = os.path.join(data_dir, "historical_climate.json")
    if os.path.exists(obs_file):
        with open(obs_file, "r", encoding="utf-8") as f:
            obs_count = len(json.load(f))
            
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "app_name": "MausamIQ",
        "version": "1.0.0",
        "environment": "active",
        "database_status": "operational",
        "datasets": {
            "districts_count": districts_count,
            "crops_count": crops_count,
            "rules_count": rules_count,
            "climate_observations_count": obs_count
        }
    }
