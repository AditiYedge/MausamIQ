"""
MausamIQ Declarative Rules Registry Inspection API.
"""
from fastapi import APIRouter, Query
from typing import Optional, List
from backend.app.domain.risk.rules_engine import load_rules_registry

router = APIRouter()


@router.get("/rules", tags=["Rules Registry"])
def list_rules(
    crop_id: Optional[str] = Query(None, description="Filter rules by crop ID"),
    severity: Optional[str] = Query(None, description="Filter rules by severity (low, moderate, high, very_high)")
):
    """
    Exposes all peer-reviewed agronomic risk rules, thresholds, citations, and localized explanations.
    """
    rules = load_rules_registry()
    if crop_id:
        rules = [r for r in rules if r.get("crop_id") == crop_id.lower().strip()]
    if severity:
        rules = [r for r in rules if r.get("risk_category") == severity.lower().strip()]
    return rules
