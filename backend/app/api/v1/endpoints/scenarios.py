"""
MausamIQ What-If Climate Scenario Simulation API Endpoint.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import json
import os

from backend.app.domain.crops.phenology import calculate_days_after_sowing, determine_active_growth_stage
from backend.app.domain.risk.rules_engine import load_rules_registry
from backend.app.domain.scenarios.simulator import simulate_climate_scenario

router = APIRouter()


class ScenarioRequest(BaseModel):
    district_id: str = Field(..., json_schema_extra={"example": "akola"})
    crop_id: str = Field(..., json_schema_extra={"example": "cotton"})
    season: str = Field("kharif", json_schema_extra={"example": "kharif"})
    year: int = Field(2024, json_schema_extra={"example": 2024})
    sowing_date: Optional[str] = Field("2024-06-20", json_schema_extra={"example": "2024-06-20"})
    perturbations: Dict[str, Any] = Field(
        default={
            "rainfall_delta_pct": -20.0,
            "temperature_delta_c": 1.5,
            "dry_spell_delta_days": 6
        }
    )
    language: str = Field("en", json_schema_extra={"example": "mr"})


def _get_districts():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    filepath = os.path.join(base_dir, "data", "maharashtra_districts.json")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def _get_crops():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    filepath = os.path.join(base_dir, "data", "crops_data.json")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def _get_climate_records():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    filepath = os.path.join(base_dir, "data", "historical_climate.json")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@router.post("/scenarios", tags=["Scenarios"])
def run_simulation(req: ScenarioRequest):
    """
    Executes a What-If sensitivity scenario without modifying underlying empirical data.
    """
    districts = _get_districts()
    district = next((d for d in districts if d.get("district_id") == req.district_id.lower().strip()), None)
    if not district:
        raise HTTPException(status_code=404, detail=f"District '{req.district_id}' not found.")
        
    crops = _get_crops()
    crop = next((c for c in crops if c.get("crop_id") == req.crop_id.lower().strip()), None)
    if not crop:
        raise HTTPException(status_code=404, detail=f"Crop '{req.crop_id}' not found in catalog.")
        
    if req.sowing_date:
        das = calculate_days_after_sowing(req.sowing_date)
        active_stage = determine_active_growth_stage(crop.get("stages", []), das)
    else:
        active_stage = determine_active_growth_stage(crop.get("stages", []), 60)
        
    climate_records = _get_climate_records()
    obs = next(
        (r for r in climate_records if r.get("district_id") == req.district_id.lower().strip() 
         and r.get("year") == req.year and r.get("season") == req.season.lower().strip()),
        None
    )
    
    if obs:
        baseline_indicators = {
            "rainfall_observed_mm": obs.get("rainfall_observed_mm"),
            "rainfall_normal_mm": obs.get("rainfall_normal_mm"),
            "rainfall_anomaly_pct": obs.get("rainfall_anomaly_pct"),
            "consecutive_dry_days": obs.get("max_consecutive_dry_days"),
            "heavy_rainfall_days": obs.get("heavy_rainfall_days_count"),
            "mean_tmax_c": obs.get("mean_tmax_c"),
            "extreme_temp_days": obs.get("extreme_temp_days", 0)
        }
        norm_rf = obs.get("rainfall_normal_mm", 700.0)
    else:
        norm_rf = district.get("normal_kharif_rf_mm", 700.0) if req.season == "kharif" else district.get("normal_rabi_rf_mm", 60.0)
        baseline_indicators = {
            "rainfall_observed_mm": norm_rf,
            "rainfall_normal_mm": norm_rf,
            "rainfall_anomaly_pct": 0.0,
            "consecutive_dry_days": 10,
            "heavy_rainfall_days": 2,
            "mean_tmax_c": 31.0,
            "extreme_temp_days": 0
        }
        
    rules = load_rules_registry()
    
    simulation_result = simulate_climate_scenario(
        baseline_indicators=baseline_indicators,
        rainfall_normal_mm=norm_rf,
        perturbations=req.perturbations,
        crop_id=req.crop_id.lower().strip(),
        active_stage_id=active_stage.get("stage_id", "all"),
        rules=rules,
        language=req.language
    )
    
    return simulation_result
