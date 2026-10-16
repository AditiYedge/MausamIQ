"""
Unit tests for climate indicators formulas.
Validates anomaly %, consecutive dry days, and heavy rainfall counters against scientific benchmarks.
"""
import pytest
from backend.app.domain.climate.indicators import (
    calculate_rainfall_anomaly,
    classify_rainfall_departure,
    calculate_consecutive_dry_days,
    count_heavy_rainfall_days,
    evaluate_data_completeness
)


def test_rainfall_anomaly_normal():
    # TEST-SCI-001 Benchmark: 600mm observed vs 750mm normal -> -20.0% (Deficient)
    anomaly_pct, classification = calculate_rainfall_anomaly(600.0, 750.0)
    assert anomaly_pct == -20.0
    assert classification == "Deficient"


def test_rainfall_anomaly_excess():
    anomaly_pct, classification = calculate_rainfall_anomaly(900.0, 750.0)
    assert anomaly_pct == 20.0
    assert classification == "Excess"


def test_rainfall_anomaly_normal_band():
    anomaly_pct, classification = calculate_rainfall_anomaly(735.0, 750.0)
    assert anomaly_pct == -2.0
    assert classification == "Normal"


def test_rainfall_anomaly_invalid_normal():
    with pytest.raises(ValueError):
        calculate_rainfall_anomaly(500.0, 0.0)


def test_consecutive_dry_days_streak():
    # Daily rain series: [0, 1.2, 0, 15.0, 0, 0, 0, 0, 2.1, 40.0]
    # Days 0,1,2 (<2.5) -> streak 3
    # Day 3 (15.0 >= 2.5) -> streak 0
    # Days 4,5,6,7,8 (0,0,0,0, 2.1 < 2.5) -> streak 5
    # Day 9 (40.0 >= 2.5) -> streak 0
    # Expected max streak: 5
    series = [0.0, 1.2, 0.0, 15.0, 0.0, 0.0, 0.0, 0.0, 2.1, 40.0]
    max_cdd = calculate_consecutive_dry_days(series, threshold_mm=2.5)
    assert max_cdd == 5


def test_consecutive_dry_days_missing_breaks_streak():
    # Missing values should NOT be imputed as zero. They break streak to avoid false drought.
    series = [0.0, 0.0, None, 0.0, 0.0]
    max_cdd = calculate_consecutive_dry_days(series, threshold_mm=2.5)
    assert max_cdd == 2


def test_heavy_rainfall_count():
    # Days with >= 64.5 mm
    series = [12.0, 65.0, 4.0, 118.0, 0.0, 64.5]
    heavy_count = count_heavy_rainfall_days(series, threshold_mm=64.5)
    assert heavy_count == 3


def test_data_completeness():
    pct, status = evaluate_data_completeness(95, 100)
    assert pct == 95.0
    assert status == "complete"
    
    pct, status = evaluate_data_completeness(80, 100)
    assert pct == 80.0
    assert status == "completed_with_limitations"
    
    pct, status = evaluate_data_completeness(60, 100)
    assert pct == 60.0
    assert status == "insufficient_data"
