"""
MausamIQ Voice & Natural Language Intent Routing API Endpoint.
"""
from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
from backend.app.domain.voice_intent.router import route_voice_intent

router = APIRouter()


class VoiceIntentRequest(BaseModel):
    transcript: str = Field(..., json_schema_extra={"example": "नाशिकमध्ये सोयाबीनचा जोखीम अहवाल दाखवा"})
    language: str = Field("mr", json_schema_extra={"example": "mr"})


@router.post("/voice/intent", tags=["Voice Assistant"])
def parse_voice_query(req: VoiceIntentRequest):
    """
    Parses vernacular speech transcripts or text queries into structured analytical actions.
    """
    result = route_voice_intent(transcript=req.transcript, language=req.language)
    return result
