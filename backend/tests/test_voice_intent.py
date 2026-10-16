"""
Unit tests for multilingual voice intent routing.
"""
from backend.app.domain.voice_intent.router import route_voice_intent


def test_marathi_intent_routing():
    transcript = "नाशिकमध्ये सोयाबीनचा जोखीम अहवाल दाखवा"
    res = route_voice_intent(transcript, language="mr")
    assert res["intent"] == "crop_risk_assessment"
    assert res["entities"]["district_id"] == "nashik"
    assert res["entities"]["crop_id"] == "soybean"
    assert res["suggested_action"] == "EXECUTE_ASSESSMENT"


def test_hindi_intent_routing():
    transcript = "अकोला में कपास की बारिश और जोखिम क्या है?"
    res = route_voice_intent(transcript, language="hi")
    assert res["entities"]["district_id"] == "akola"
    assert res["entities"]["crop_id"] == "cotton"


def test_english_what_if_routing():
    transcript = "Run a what if scenario for cotton in Nagpur"
    res = route_voice_intent(transcript, language="en")
    assert res["intent"] == "what_if_simulation"
    assert res["entities"]["district_id"] == "nagpur"
    assert res["entities"]["crop_id"] == "cotton"
