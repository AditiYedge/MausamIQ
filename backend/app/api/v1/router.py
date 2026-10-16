"""
MausamIQ API v1 Main Router.
Consolidates all domain endpoints.
"""
from fastapi import APIRouter

from backend.app.api.v1.endpoints import (
    health,
    locations,
    crops,
    climate,
    assessments,
    scenarios,
    rules,
    compare,
    voice,
    export
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(locations.router)
api_router.include_router(crops.router)
api_router.include_router(climate.router)
api_router.include_router(assessments.router)
api_router.include_router(scenarios.router)
api_router.include_router(rules.router)
api_router.include_router(compare.router)
api_router.include_router(voice.router)
api_router.include_router(export.router)
