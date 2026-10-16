# Localization & Voice Interaction Specification
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Supported Locales:**
  - English: `en` / `en-IN`
  - Hindi: `hi` / `hi-IN`
  - Marathi: `mr` / `mr-IN`

---

## 1. Trilingual Localization Architecture

### 1.1 First-Class Citizens
Localization in MausamIQ is deeply embedded across every layer of the system:
1. **Frontend Interface Dictionaries:** Stored in `frontend/src/i18n/locales/{en,hi,mr}.json`.
2. **Agricultural Domain Glossary:** Key scientific terms have verified translations reviewed against standard Marathi and Hindi agricultural university bulletins (MPKV, VNMKV, PDKV, ICAR).
3. **Dynamic Rule Explanations:** Every risk rule in the backend rule registry stores `explanation_en`, `explanation_hi`, and `explanation_mr`.
4. **State Persistence:** User language preference is stored in browser `localStorage` under `mausamiq_lang`, maintaining selections across page refreshes without resetting active assessment inputs.

### 1.2 Agricultural Terminology Glossary

| English Domain Term | Hindi (हिंदी) | Marathi (मराठी) | Contextual Agricultural Definition |
| :--- | :--- | :--- | :--- |
| **Climate Risk Assessment** | जलवायु जोखिम आकलन | हवामान जोखीम मूल्यांकन | Systematic evaluation of crop vulnerability to weather anomalies. |
| **Rainfall Anomaly** | वर्षा विसंगति | पावसाची विसंगती | Departure from 30-year long-period normal average ($A_{\%}$). |
| **Consecutive Dry Days (CDD)** | शुष्क दिन श्रृंखला / सूखा अंतराल | पावसाचा खंड / सलग कोरडे दिवस | Contiguous sequence of days with precipitation $< 2.5\text{ mm}$. |
| **Heavy Rainfall Day** | भारी वर्षा दिवस | मुसळधार पावसाचा दिवस | Daily precipitation $\ge 64.5\text{ mm}$ (IMD definition). |
| **Sowing / Emergence** | बुवाई एवं अंकुरण | पेरणी आणि उगवण | Initial crop stage (Days After Sowing: 0–15). |
| **Vegetative Growth** | वानस्पतिक वृद्धि | शाकीय वाढ | Leaf and branch development phase (DAS: 15–40). |
| **Flowering & Podding** | पुष्पन एवं फली विकास | फुलधारणा आणि शेंगा भरणे | Critical reproductive stage highly vulnerable to moisture stress. |
| **Maturity & Ripening** | परिपक्वता एवं कटाई | पक्वता आणि काढणी | Final ripening stage vulnerable to unseasonal late rainfall. |
| **What-If Simulation** | परिदृश्य सिमुलेशन | 'जर-तर' हवामान परिस्थिती मॉडेल | Sensitivity model altering baseline weather levers. |
| **Data Provenance** | डेटा स्रोत एवं प्रामाणिकता | माहितीचा मूळ स्रोत आणि अचूकता | Transparent audit trail linking observations to IMD/ICAR. |

---

## 2. Voice Interaction Architecture

### 2.1 Web Speech API Integration
MausamIQ utilizes standard W3C Web Speech API specifications:
- **SpeechRecognition / webkitSpeechRecognition:** Captures microphone input and transcribes audio into text.
- **SpeechSynthesis:** Converts textual assessment summaries and advisories into spoken audio.

```
+-----------------------------------------------------------------------------------+
|                            User Clicks Microphone Button                          |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           Capability & Permission Check                           |
| - Verify window.SpeechRecognition / webkitSpeechRecognition                       |
| - Request microphone access via navigator.mediaDevices.getUserMedia               |
| - Set language hint: 'mr-IN' (Marathi), 'hi-IN' (Hindi), or 'en-IN' (English)     |
+-----------------------------------------------------------------------------------+
                                          |
                  +-----------------------+-----------------------+
                  | Supported                             | Unsupported or Denied
                  v                                       v
+------------------------------------+ +------------------------------------+
|        Listening UI State          | |       Fallback to Text Box         |
| - Visual audio pulse animation     | | - Display explanatory toast:       |
| - Live interim speech transcript   | |   "Microphone permission denied or |
| - Stop / Cancel controls           | |   speech API unsupported."         |
+------------------------------------+ +------------------------------------+
                  |
                  v
+-----------------------------------------------------------------------------------+
|                        Transcribed Text in Editable Input                         |
| - User inspects transcription and can freely edit typos before submission         |
+-----------------------------------------------------------------------------------+
                                          | Submit
                                          v
+-----------------------------------------------------------------------------------+
|                            Intent Routing Subsystem                               |
| - Extract Entities: District, Crop, Season, Indicator                             |
| - Map to Deterministic API Endpoint                                               |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        Audio Readout (SpeechSynthesis)                            |
| - Filter available voices matching selected language code                         |
| - Play / Pause / Stop controls on Assessment Screen                               |
+-----------------------------------------------------------------------------------+
```

### 2.2 Privacy & Security Guarantees
- Speech audio streams are processed in-memory directly in the client browser.
- No raw audio waveforms are recorded, saved to server disks, or transmitted to unverified third parties.
- Transcripts are processed solely to extract structured domain parameters.
