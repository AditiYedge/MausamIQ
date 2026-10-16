"""
Unit tests for What-If scenario simulations.
"""
from backend.app.domain.risk.rules_engine import load_rules_registry
from backend.app.domain.scenarios.simulator import simulate_climate_scenario


def test_scenario_perturbation_impact():
    rules = load_rules_registry()
    baseline = {
        "rainfall_observed_mm": 700.0,
        "consecutive_dry_days": 8,
        "heavy_rainfall_days": 1,
        "mean_tmax_c": 30.0
    }
    perturbations = {
        "rainfall_delta_pct": -30.0,
        "dry_spell_delta_days": 7,
        "temperature_delta_c": 1.5
    }
    
    sim = simulate_climate_scenario(
        baseline_indicators=baseline,
        rainfall_normal_mm=725.0,
        perturbations=perturbations,
        crop_id="soybean",
        active_stage_id="flowering_podding",
        rules=rules,
        language="en"
    )
    
    assert sim["is_simulation"] is True
    assert "disclaimer" in sim
    # Simulated CDD should be 8 + 7 = 15
    assert sim["simulated_indicators"]["consecutive_dry_days"] == 15
    # Should trigger high risk on soybean
    assert sim["simulated_assessment"]["overall_category"] == "high"
    assert sim["comparison_summary"]["score_delta"] > 0
