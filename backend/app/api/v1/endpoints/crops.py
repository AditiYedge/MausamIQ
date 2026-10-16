"""
MausamIQ Crops Catalogue & Phenology Endpoints.
"""
from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()


def _get_crops():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    filepath = os.path.join(base_dir, "data", "crops_data.json")
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/crops", tags=["Crops"])
def list_crops():
    """Lists all 10 supported Maharashtra crops with localized names and botanical names."""
    return _get_crops()


@router.get("/crops/{crop_id}", tags=["Crops"])
def get_crop_details(crop_id: str):
    """Retrieves full crop profile including phenological stages, duration intervals, and water demands."""
    crops = _get_crops()
    for c in crops:
        if c.get("crop_id") == crop_id.lower().strip():
            return c
    raise HTTPException(status_code=404, detail=f"Crop '{crop_id}' not found in catalogue.")
