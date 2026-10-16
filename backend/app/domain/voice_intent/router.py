"""
MausamIQ Multilingual Voice & Natural Language Intent Routing Subsystem.
Parses vernacular transcripts (English, Hindi, Marathi) using deterministic keyword matching
and extracts structured entities (district, crop, season, indicator).
"""
import re
from typing import Dict, Any, Optional

# Multilingual District Aliases Dictionary
DISTRICT_ALIASES = {
    "nashik": ["nashik", "nasik", "नाशिक", "नासिक"],
    "pune": ["pune", "poona", "पुणे", "पुण्या"],
    "ahmednagar": ["ahmednagar", "ahilyanagar", "अहमदनगर", "अहिल्यानगर"],
    "solapur": ["solapur", "sholapur", "सोलापूर", "सोलापुर", "सोलापूर"],
    "satara": ["satara", "सातारा", "सतारा", "साताऱ्या"],
    "sangli": ["sangli", "सांगली", "सांगलीत"],
    "kolhapur": ["kolhapur", "कोल्हापूर", "कोल्हापुर"],
    "chhatrapati_sambhajinagar": ["aurangabad", "sambhajinagar", "chhatrapati sambhajinagar", "संभाजीनगर", "औरंगाबाद", "छत्रपती संभाजीनगर"],
    "jalna": ["jalna", "जालना", "जालन्या"],
    "beed": ["beed", "bid", "बीड", "बीड"],
    "latur": ["latur", "लातूर", "लातूर"],
    "dharashiv": ["dharashiv", "osmanabad", "धाराशिव", "उस्मानाबाद"],
    "nanded": ["nanded", "नांदेड", "नांदेड़"],
    "parbhani": ["parbhani", "परभणी", "परभनी"],
    "hingoli": ["hingoli", "हिंगोली"],
    "akola": ["akola", "अकोला", "अकोल्या"],
    "amravati": ["amravati", "अमरावती", "अमरावतीत"],
    "yavatmal": ["yavatmal", "यवतमाळ", "यवतमाल"],
    "buldhana": ["buldhana", "बुलढाणा", "बुलढाण्या"],
    "washim": ["washim", "वाशीम", "वाशिम"],
    "wardha": ["wardha", "वर्धा", "वर्ध्यात"],
    "nagpur": ["nagpur", "नागपूर", "नागपुर"],
    "bhandara": ["bhandara", "भंडारा", "भंडाऱ्या"],
    "gondia": ["gondia", "गोंदिया", "गोंदियात"],
    "chandrapur": ["chandrapur", "चंद्रपूर", "चंद्रपुर"],
    "gadchiroli": ["gadchiroli", "गडचिरोली", "गढ़चिरौली"],
    "jalgaon": ["jalgaon", "जळगाव", "जलगांव"],
    "dhule": ["dhule", "धुळे", "धुले", "धुळ्यात"],
    "nandurbar": ["nandurbar", "नंदुरबार"],
    "ratnagiri": ["ratnagiri", "रत्नागिरी", "रत्नागिरि"],
    "sindhudurg": ["sindhudurg", "सिंधुदुर्ग"],
    "raigad": ["raigad", "रायगड", "रायगढ़"],
    "thane": ["thane", "ठाणे", "ठाण्यात"],
    "palghar": ["palghar", "पालघर"]
}

# Multilingual Crop Aliases Dictionary
CROP_ALIASES = {
    "soybean": ["soybean", "soya", "सोयाबीन", "सोया"],
    "cotton": ["cotton", "kapas", "कापूस", "कपास", "कापसा"],
    "rice": ["rice", "paddy", "dhan", "भात", "धान", "चावल"],
    "jowar": ["jowar", "sorghum", "ज्वारी", "ज्वार"],
    "bajra": ["bajra", "pearl millet", "बाजरी", "बाजरा"],
    "wheat": ["wheat", "gehu", "गहू", "गेहूं", "गेहु"],
    "chickpea": ["chickpea", "gram", "chana", "हरभरा", "चना", "हरभऱ्या"],
    "pigeonpea": ["pigeonpea", "tur", "arhar", "तूर", "अरहर", "तुरी"],
    "maize": ["maize", "corn", "मका", "मक्का"],
    "sugarcane": ["sugarcane", "cane", "ऊस", "गन्ना", "उसा"]
}

# Intent Keyword Triggers
INTENT_TRIGGERS = {
    "crop_risk_assessment": [
        "risk", "assess", "exposure", "vulnerability", "जोखीम", "मूल्यांकन", "धोका", "अहवाल", "जोखिम", "आकलन"
    ],
    "rainfall_trend": [
        "rainfall", "rain", "precipitation", "पाऊस", "वर्षा", "बारिश", "वृष्टी"
    ],
    "dry_spell_analysis": [
        "dry spell", "drought", "dry days", "खंड", "पावसाचा खंड", "दुष्काळ", "सूखा", "शुष्क"
    ],
    "what_if_simulation": [
        "what if", "simulate", "scenario", "lever", "सिमुलेशन", "जर-तर", "परिदृश्य", "मॉडेल"
    ],
    "crop_comparison": [
        "compare", "comparison", "versus", "vs", "तुलना", "तुलनात्मक", "फरक"
    ]
}


def extract_entities_from_transcript(transcript: str) -> Dict[str, Optional[str]]:
    """Extracts district, crop, and season from transcript text."""
    lower_text = transcript.lower().strip()
    
    extracted_district = None
    for district_id, aliases in DISTRICT_ALIASES.items():
        for alias in aliases:
            # Check for substring in text (works for Devanagari inflections & English)
            if alias in lower_text:
                extracted_district = district_id
                break
        if extracted_district:
            break
            
    extracted_crop = None
    for crop_id, aliases in CROP_ALIASES.items():
        for alias in aliases:
            if alias in lower_text:
                extracted_crop = crop_id
                break
        if extracted_crop:
            break
            
    extracted_season = "kharif"  # default
    if any(w in lower_text for w in ["rabi", "रब्बी", "रबी"]):
        extracted_season = "rabi"
    elif any(w in lower_text for w in ["zaid", "summer", "उन्हाळी", "जायद"]):
        extracted_season = "zaid"
        
    return {
        "district_id": extracted_district,
        "crop_id": extracted_crop,
        "season": extracted_season
    }
            
    extracted_season = "kharif"  # default
    if any(w in lower_text for w in ["rabi", "रब्बी", "रबी"]):
        extracted_season = "rabi"
    elif any(w in lower_text for w in ["zaid", "summer", "उन्हाळी", "जायद"]):
        extracted_season = "zaid"
        
    return {
        "district_id": extracted_district,
        "crop_id": extracted_crop,
        "season": extracted_season
    }


def route_voice_intent(transcript: str, language: str = "en") -> Dict[str, Any]:
    """
    Deterministically routes natural language / speech transcripts into structured intents.
    """
    if not transcript or not transcript.strip():
        return {
            "intent": "unknown",
            "confidence": 0.0,
            "entities": {},
            "suggested_action": "PROMPT_INPUT",
            "clarification": "No speech or text provided. Please ask a query."
        }
        
    lower_text = transcript.lower().strip()
    entities = extract_entities_from_transcript(lower_text)
    
    matched_intent = "crop_risk_assessment"  # primary default intent
    confidence = 0.70
    
    for intent_name, triggers in INTENT_TRIGGERS.items():
        if any(tr in lower_text for tr in triggers):
            matched_intent = intent_name
            confidence = 0.90
            break
            
    # Tailor suggested action based on extracted entities
    if entities["district_id"] and entities["crop_id"]:
        suggested_action = "EXECUTE_ASSESSMENT"
        clarification_msg = None
    elif entities["district_id"] and not entities["crop_id"]:
        if matched_intent == "rainfall_trend":
            suggested_action = "FETCH_CLIMATE_TRENDS"
            clarification_msg = None
        else:
            suggested_action = "PROMPT_CROP"
            clarification_msg = "District identified. Please select or mention the crop."
    else:
        suggested_action = "NAVIGATE_DASHBOARD"
        clarification_msg = "Please specify a Maharashtra district (e.g. Nashik, Akola) and crop (e.g. Soybean, Cotton)."
        
    return {
        "intent": matched_intent,
        "confidence": confidence,
        "transcript": transcript,
        "language": language,
        "entities": entities,
        "suggested_action": suggested_action,
        "clarification": clarification_msg
    }
