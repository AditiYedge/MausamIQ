"""
MausamIQ Locations API Endpoints (Maharashtra Districts).
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import json
import os

router = APIRouter()


def _get_districts():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
    filepath = os.path.join(base_dir, "data", "maharashtra_districts.json")
    if not os.path.exists(filepath):
        return []
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/locations", tags=["Locations"])
def list_locations(zone: Optional[str] = Query(None, description="Filter by agro-climatic zone keyword")):
    """Retrieves all 36 Maharashtra districts with coordinates, Marathi/Hindi names, and normals."""
    districts = _get_districts()
    if zone:
        districts = [d for d in districts if zone.lower() in d.get("agro_climatic_zone", "").lower()]
    return districts


@router.get("/locations/{district_id}", tags=["Locations"])
def get_location(district_id: str):
    """Retrieves a single Maharashtra district by canonical ID."""
    districts = _get_districts()
    for d in districts:
        if d.get("district_id") == district_id.lower().strip():
            return d
    raise HTTPException(status_code=404, detail=f"District '{district_id}' not found in Maharashtra catalog.")
