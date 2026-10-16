"""
Unit tests for rule engine and deterministic risk assessment.
"""
from backend.app.domain.risk.rules_engine import load_rules_registry, evaluate_crop_risk


def test_rules_loading():
    rules = load_rules_registry()
    assert len(rules) >= 10
    for r in rules:
        assert "rule_id" in r
        assert "crop_id" in r
        assert "indicator" in r
        assert "threshold" in r
        assert "risk_category" in r
        assert "source_citation" in r


def test_soybean_cdd_high_trigger():
    # Rule SOY-CDD-HIGH-01 triggers when CDD >= 12 during flowering_podding
    rules = load_rules_registry()
    indicators = {
        "consecutive_dry_days": 14,
        "rainfall_anomaly_pct": -5.0,
        "heavy_rainfall_days": 1
    }
    result = evaluate_crop_risk(
        crop_id="soybean",
        active_stage_id="flowering_podding",
        indicators=indicators,
        rules=rules,
        data_completeness_pct=100.0,
        language="en"
    )
    assert result["overall_category"] == "high"
    assert any(r["rule_id"] == "SOY-CDD-HIGH-01" for r in result["triggered_rules"])


def test_insufficient_data_withheld():
    rules = load_rules_registry()
    indicators = {"consecutive_dry_days": 20}
    result = evaluate_crop_risk(
        crop_id="soybean",
        active_stage_id="flowering_podding",
        indicators=indicators,
        rules=rules,
        data_completeness_pct=65.0,  # Below 75%
        language="en"
    )
    assert result["overall_category"] == "insufficient_data"
    assert result["risk_score_numeric"] == 0
