"""
MausamIQ Deterministic Crop Climate-Risk Assessment Rule Engine.
Evaluates versioned declarative agro-climatic rules against observed meteorological indicators.
"""
from typing import Dict, Any, List, Optional
import json
import os

SEVERITY_SCORES = {
    "low": 20,
    "moderate": 50,
    "high": 80,
    "very_high": 95,
    "insufficient_data": 0
}

SEVERITY_RANKS = {
    "low": 1,
    "moderate": 2,
    "high": 3,
    "very_high": 4
}


def load_rules_registry(data_dir: Optional[str] = None) -> List[Dict[str, Any]]:
    """Loads declarative rules from risk_rules.json."""
    if not data_dir:
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        data_dir = os.path.join(base_dir, "data")
        
    rules_path = os.path.join(data_dir, "risk_rules.json")
    if not os.path.exists(rules_path):
        return []
        
    with open(rules_path, "r", encoding="utf-8") as f:
        return json.load(f)


def evaluate_condition(operator: str, observed: float, threshold: Any) -> bool:
    """Evaluates mathematical operator condition."""
    if operator == ">=":
        return observed >= float(threshold)
    elif operator == "<=":
        return observed <= float(threshold)
    elif operator == ">":
        return observed > float(threshold)
    elif operator == "<":
        return observed < float(threshold)
    elif operator == "between" and isinstance(threshold, list) and len(threshold) == 2:
        return float(threshold[0]) <= observed <= float(threshold[1])
    return False


def evaluate_crop_risk(
    crop_id: str,
    active_stage_id: str,
    indicators: Dict[str, Any],
    rules: List[Dict[str, Any]],
    data_completeness_pct: float = 100.0,
    language: str = "en"
) -> Dict[str, Any]:
    """
    Evaluates applicable crop rules against meteorological indicators.
    """
    if data_completeness_pct < 75.0:
        return {
            "overall_category": "insufficient_data",
            "risk_score_numeric": 0,
            "triggered_rules": [],
            "untriggered_rules_count": 0,
            "missing_indicators": ["observational_data_incomplete"],
            "advisory": "Observations are less than 75% complete for this period. Formal risk classification withheld to ensure scientific integrity.",
            "limitations": ["Data completeness fell below the required 75% threshold."]
        }
        
    triggered_rules = []
    untriggered_count = 0
    missing_indicators = []
    
    # Filter rules matching crop
    matching_rules = [r for r in rules if r.get("crop_id") == crop_id]
    
    for rule in matching_rules:
        applicable_stages = rule.get("applicable_stages", ["all"])
        
        # Check stage applicability: 'all' applies to any stage, or specific stage match
        if "all" not in applicable_stages and active_stage_id not in applicable_stages:
            continue
            
        indicator_name = rule.get("indicator")
        operator = rule.get("operator")
        threshold = rule.get("threshold")
        
        if indicator_name not in indicators or indicators[indicator_name] is None:
            if indicator_name not in missing_indicators:
                missing_indicators.append(indicator_name)
            continue
            
        observed_val = indicators[indicator_name]
        is_triggered = evaluate_condition(operator, observed_val, threshold)
        
        if is_triggered:
            # Pick localized explanation and advisory
            explanation = rule.get(f"explanation_{language}") or rule.get("explanation_en") or ""
            advisory = rule.get(f"advisory_{language}") or rule.get("advisory_en") or ""
            
            triggered_rules.append({
                "rule_id": rule.get("rule_id"),
                "indicator": indicator_name,
                "operator": operator,
                "threshold": threshold,
                "observed_value": observed_val,
                "unit": rule.get("unit"),
                "severity": rule.get("risk_category", "moderate"),
                "citation": rule.get("source_citation"),
                "evidence_classification": rule.get("evidence_classification"),
                "explanation": explanation,
                "advisory": advisory
            })
        else:
            untriggered_count += 1
            
    # Determine overall risk category and numeric score
    if not triggered_rules:
        overall_category = "low"
        risk_score = 15
        advisory_text = (
            "No severe agro-climatic stress thresholds were violated for this crop stage. "
            "Maintain standard good agricultural practices and regular field monitoring."
        )
    else:
        # Highest severity rule
        highest_rank = 1
        moderate_count = 0
        
        for tr in triggered_rules:
            sev = tr["severity"]
            rank = SEVERITY_RANKS.get(sev, 1)
            if rank > highest_rank:
                highest_rank = rank
            if sev == "moderate":
                moderate_count += 1
                
        # Compound risk escalation: multiple moderate stresses escalate to high
        if highest_rank == 2 and moderate_count >= 2:
            highest_rank = 3
            
        rank_to_category = {1: "low", 2: "moderate", 3: "high", 4: "very_high"}
        overall_category = rank_to_category.get(highest_rank, "moderate")
        
        # Calculate numeric risk score with modest compounding
        base_score = SEVERITY_SCORES.get(overall_category, 50)
        risk_score = min(100, base_score + (len(triggered_rules) - 1) * 5)
        
        # Primary advisory from highest triggered rule
        advisories = [tr["advisory"] for tr in triggered_rules if tr["advisory"]]
        advisory_text = " ".join(advisories[:2]) if advisories else "Consult local KVK extension officers."
        
    return {
        "overall_category": overall_category,
        "risk_score_numeric": risk_score,
        "triggered_rules": triggered_rules,
        "untriggered_rules_count": untriggered_count,
        "missing_indicators": missing_indicators,
        "advisory": advisory_text,
        "limitations": [
            "Assessment is based on district-level meteorological indicators.",
            "Micro-plot soil drainage and moisture retention properties may moderate or exacerbate real-world field stress."
        ]
    }
