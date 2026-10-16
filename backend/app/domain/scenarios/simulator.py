"""
MausamIQ What-If Scenario Simulation Domain Module.
Applies mathematical perturbations to baseline climate observations and evaluates
impacts through the deterministic rule engine.
"""
from typing import Dict, Any, List
from backend.app.domain.risk.rules_engine import evaluate_crop_risk


def simulate_climate_scenario(
    baseline_indicators: Dict[str, Any],
    rainfall_normal_mm: float,
    perturbations: Dict[str, Any],
    crop_id: str,
    active_stage_id: str,
    rules: List[Dict[str, Any]],
    language: str = "en"
) -> Dict[str, Any]:
    """
    Simulates hypothetical agro-climatic shifts:
      - rainfall_delta_pct (-40% to +40%)
      - temperature_delta_c (-2°C to +4°C)
      - dry_spell_delta_days (-10 to +20 days)
    """
    # 1. Baseline risk evaluation
    baseline_eval = evaluate_crop_risk(
        crop_id=crop_id,
        active_stage_id=active_stage_id,
        indicators=baseline_indicators,
        rules=rules,
        language=language
    )
    
    # 2. Apply perturbations to create simulated indicators
    rf_delta_pct = perturbations.get("rainfall_delta_pct", 0.0)
    temp_delta_c = perturbations.get("temperature_delta_c", 0.0)
    cdd_delta_days = perturbations.get("dry_spell_delta_days", 0)
    
    orig_rf = baseline_indicators.get("rainfall_observed_mm", rainfall_normal_mm)
    simulated_rf = round(max(0.0, orig_rf * (1.0 + (rf_delta_pct / 100.0))), 1)
    
    if rainfall_normal_mm > 0:
        simulated_anomaly_pct = round(((simulated_rf - rainfall_normal_mm) / rainfall_normal_mm) * 100.0, 1)
    else:
        simulated_anomaly_pct = 0.0
        
    orig_cdd = baseline_indicators.get("consecutive_dry_days", 0)
    simulated_cdd = max(0, orig_cdd + cdd_delta_days)
    
    orig_tmax = baseline_indicators.get("mean_tmax_c", 30.0)
    simulated_tmax = round(orig_tmax + temp_delta_c, 1)
    
    simulated_indicators = {
        **baseline_indicators,
        "rainfall_observed_mm": simulated_rf,
        "rainfall_anomaly_pct": simulated_anomaly_pct,
        "consecutive_dry_days": simulated_cdd,
        "mean_tmax_c": simulated_tmax
    }
    
    # 3. Simulated risk evaluation
    simulated_eval = evaluate_crop_risk(
        crop_id=crop_id,
        active_stage_id=active_stage_id,
        indicators=simulated_indicators,
        rules=rules,
        language=language
    )
    
    # 4. Compute differences
    score_delta = simulated_eval["risk_score_numeric"] - baseline_eval["risk_score_numeric"]
    category_shifted = simulated_eval["overall_category"] != baseline_eval["overall_category"]
    
    return {
        "is_simulation": True,
        "disclaimer": "This is a hypothetical sensitivity scenario, NOT a meteorological forecast or crop yield prediction.",
        "baseline_indicators": baseline_indicators,
        "simulated_indicators": simulated_indicators,
        "applied_perturbations": {
            "rainfall_delta_pct": rf_delta_pct,
            "temperature_delta_c": temp_delta_c,
            "dry_spell_delta_days": cdd_delta_days
        },
        "baseline_assessment": {
            "overall_category": baseline_eval["overall_category"],
            "risk_score_numeric": baseline_eval["risk_score_numeric"],
            "triggered_rules_count": len(baseline_eval["triggered_rules"])
        },
        "simulated_assessment": {
            "overall_category": simulated_eval["overall_category"],
            "risk_score_numeric": simulated_eval["risk_score_numeric"],
            "triggered_rules": simulated_eval["triggered_rules"],
            "advisory": simulated_eval["advisory"]
        },
        "comparison_summary": {
            "score_delta": score_delta,
            "category_shifted": category_shifted,
            "from_category": baseline_eval["overall_category"],
            "to_category": simulated_eval["overall_category"]
        }
    }
