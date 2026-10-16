"""
MausamIQ Climate Indicators Domain Module.
Implements deterministic, mathematically rigorous meteorological indicator formulas
aligned with IMD (India Meteorological Department) and WMO standards.
"""
from typing import List, Tuple, Optional


def calculate_rainfall_anomaly(observed_rf: float, normal_rf: float) -> Tuple[float, str]:
    """
    Computes percentage rainfall anomaly departure from climatological baseline normal:
    Anomaly % = ((Observed - Normal) / Normal) * 100

    Classifications (IMD Standards):
      - Excess (E): >= +20%
      - Normal (N): -19% to +19%
      - Deficient (D): -59% to -20%
      - Scanty (S): <= -60%
    """
    if normal_rf <= 0:
        raise ValueError("Climatological baseline normal must be greater than zero.")
    
    anomaly_pct = round(((observed_rf - normal_rf) / normal_rf) * 100.0, 1)
    classification = classify_rainfall_departure(anomaly_pct)
    return anomaly_pct, classification


def classify_rainfall_departure(anomaly_pct: float) -> str:
    """Classifies percentage departure into IMD category."""
    if anomaly_pct >= 20.0:
        return "Excess"
    elif anomaly_pct >= -19.0:
        return "Normal"
    elif anomaly_pct >= -59.0:
        return "Deficient"
    else:
        return "Scanty"


def calculate_consecutive_dry_days(daily_rainfall_mm: List[Optional[float]], threshold_mm: float = 2.5) -> int:
    """
    Calculates the maximum sequence of Consecutive Dry Days (CDD).
    IMD Standard: A dry day is a calendar day with daily rainfall < 2.5 mm.
    
    Missing values (None) are NOT imputed as zero; if encountered, they interrupt the streak
    to prevent artificially inflating dry spell duration.
    """
    max_streak = 0
    current_streak = 0
    
    for val in daily_rainfall_mm:
        if val is None:
            # Missing observation breaks streak to avoid false drought inflation
            current_streak = 0
            continue
        
        if val < threshold_mm:
            current_streak += 1
            if current_streak > max_streak:
                max_streak = current_streak
        else:
            current_streak = 0
            
    return max_streak


def count_heavy_rainfall_days(daily_rainfall_mm: List[Optional[float]], threshold_mm: float = 64.5) -> int:
    """
    Counts events where daily precipitation >= 64.5 mm (IMD Heavy Rainfall threshold).
    """
    count = 0
    for val in daily_rainfall_mm:
        if val is not None and val >= threshold_mm:
            count += 1
    return count


def evaluate_data_completeness(valid_observations: int, expected_observations: int) -> Tuple[float, str]:
    """
    Evaluates observational completeness.
    - >= 90%: Full evaluation
    - 75% to 89%: Completed with limitations
    - < 75%: Insufficient data for overall risk score
    """
    if expected_observations <= 0:
        return 0.0, "insufficient_data"
        
    completeness_pct = round((valid_observations / expected_observations) * 100.0, 1)
    
    if completeness_pct >= 90.0:
        status = "complete"
    elif completeness_pct >= 75.0:
        status = "completed_with_limitations"
    else:
        status = "insufficient_data"
        
    return completeness_pct, status
