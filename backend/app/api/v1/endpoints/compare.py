"""
MausamIQ Cross-Crop Resilience Comparison Endpoint.
"""
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
import json
import os

from backend.app.domain.risk.rules_engine import load_rules_registry, evaluate_crop_risk

router = APIRouter()


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


def _get_districts():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    filepath = os.path.join(base_dir, "data", "maharashtra_districts.json")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/crops/compare", tags=["Crops"])
def compare_crops(
    district_id: str = Query(..., description="Target district ID"),
    crop_ids: str = Query("soybean,cotton,jowar", description="Comma-separated crop IDs to compare"),
    season: str = Query("kharif", description="Season"),
    year: int = Query(2024, description="Year"),
    language: str = Query("en", description="Locale")
):
    """
    Compares vulnerability of multiple candidate crops under identical climatic conditions.
    """
    crops_catalog = _get_crops()
    districts = _get_districts()
    climate_records = _get_climate_records()
    rules = load_rules_registry()
    
    district = next((d for d in districts if d.get("district_id") == district_id.lower().strip()), None)
    if not district:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found.")
        
    obs = next(
        (r for r in climate_records if r.get("district_id") == district_id.lower().strip() 
         and r.get("year") == year and r.get("season") == season.lower().strip()),
        None
    )
    
    if obs:
        indicators = {
            "rainfall_observed_mm": obs.get("rainfall_observed_mm"),
            "rainfall_normal_mm": obs.get("rainfall_normal_mm"),
            "rainfall_anomaly_pct": obs.get("rainfall_anomaly_pct"),
            "consecutive_dry_days": obs.get("max_consecutive_dry_days"),
            "heavy_rainfall_days": obs.get("heavy_rainfall_days_count"),
            "mean_tmax_c": obs.get("mean_tmax_c"),
            "extreme_temp_days": obs.get("extreme_temp_days", 0)
        }
        completeness = obs.get("data_completeness_pct", 100.0)
    else:
        norm_rf = district.get("normal_kharif_rf_mm", 700.0) if season == "kharif" else district.get("normal_rabi_rf_mm", 60.0)
        indicators = {
            "rainfall_observed_mm": norm_rf,
            "rainfall_normal_mm": norm_rf,
            "rainfall_anomaly_pct": 0.0,
            "consecutive_dry_days": 10,
            "heavy_rainfall_days": 2,
            "mean_tmax_c": 31.0,
            "extreme_temp_days": 0
        }
        completeness = 100.0
        
    target_crop_ids = [cid.strip().lower() for cid in crop_ids.split(",") if cid.strip()]
    
    comparisons = []
    for cid in target_crop_ids:
        crop_obj = next((c for c in crops_catalog if c.get("crop_id") == cid), None)
        if not crop_obj:
            continue
            
        eval_result = evaluate_crop_risk(
            crop_id=cid,
            active_stage_id="all",
            indicators=indicators,
            rules=rules,
            data_completeness_pct=completeness,
            language=language
        )
        
        if language == "mr":
            crop_name = crop_obj.get("common_name_mr")
        elif language == "hi":
            crop_name = crop_obj.get("common_name_hi")
        else:
            crop_name = crop_obj.get("common_name_en")
            
        comparisons.append({
            "crop_id": cid,
            "crop_name": crop_name,
            "botanical_name": crop_obj.get("botanical_name"),
            "water_requirement_mm": crop_obj.get("water_requirement_mm"),
            "duration_days": crop_obj.get("total_duration_days"),
            "overall_risk_category": eval_result["overall_category"],
            "risk_score_numeric": eval_result["risk_score_numeric"],
            "triggered_rules_count": len(eval_result["triggered_rules"]),
            "key_advisory": eval_result["advisory"]
        })
        
    return {
        "district_id": district_id,
        "district_name": district["district_name"],
        "season": season,
        "year": year,
        "indicators": indicators,
        "comparisons": comparisons
    }
