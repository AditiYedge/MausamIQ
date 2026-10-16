"""
MausamIQ Crop Phenology Domain Module.
Calculates Days After Sowing (DAS) and maps calendar dates to active physiological growth stages.
"""
from datetime import datetime, date
from typing import Dict, Any, Optional, List


def calculate_days_after_sowing(sowing_date_str: str, target_date_str: Optional[str] = None) -> int:
    """
    Computes elapsed days between sowing date and target date.
    Dates in format YYYY-MM-DD.
    """
    try:
        sowing = datetime.strptime(sowing_date_str, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError(f"Invalid sowing date format: {sowing_date_str}. Expected YYYY-MM-DD.")
        
    if target_date_str:
        try:
            target = datetime.strptime(target_date_str, "%Y-%m-%d").date()
        except ValueError:
            target = date.today()
    else:
        target = date.today()
        
    delta = (target - sowing).days
    return max(0, delta)


def determine_active_growth_stage(stages: List[Dict[str, Any]], das: int) -> Dict[str, Any]:
    """
    Finds the active phenological stage for a crop given its elapsed Days After Sowing (DAS).
    """
    if not stages:
        return {
            "stage_id": "all",
            "stage_name_en": "Cumulative Season",
            "stage_name_mr": "संपूर्ण हंगाम",
            "stage_name_hi": "सम्पूर्ण मौसम",
            "start_das": 0,
            "end_das": 365,
            "vulnerability": "General seasonal climate exposure."
        }
        
    for stage in stages:
        start = stage.get("start_das", 0)
        end = stage.get("end_das", 365)
        if start <= das <= end:
            return stage
            
    # If DAS exceeds the last stage, return maturity/harvest
    return stages[-1]
