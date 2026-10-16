export interface GlossaryTerm {
  term_en: string;
  term_hi: string;
  term_mr: string;
  definition_en: string;
  definition_hi: string;
  definition_mr: string;
}

export const AGRICULTURAL_GLOSSARY: GlossaryTerm[] = [
  {
    term_en: "Rainfall Anomaly",
    term_hi: "वर्षा विसंगति",
    term_mr: "पावसाची विसंगती",
    definition_en: "The percentage departure of observed seasonal rainfall from the 30-year Long-Period Average (LPA) normal.",
    definition_hi: "30 वर्षों के दीर्घकालिक औसत (LPA) सामान्य से वास्तविक मौसमी वर्षा का प्रतिशत विचलन।",
    definition_mr: "३० वर्षांच्या सरासरी पर्जन्यमानाच्या (LPA Normal) तुलनेत पडलेल्या पावसाची टक्केवारीतील तूट किंवा वाढ."
  },
  {
    term_en: "Consecutive Dry Days (CDD)",
    term_hi: "शुष्क दिन श्रृंखला (सूखा अंतराल)",
    term_mr: "पावसाचा खंड (सलग कोरडे दिवस)",
    definition_en: "Maximum number of contiguous calendar days where daily precipitation was less than 2.5 mm.",
    definition_hi: "लगातार दिनों की अधिकतम संख्या जिनमें दैनिक वर्षा 2.5 मिमी से कम दर्ज की गई हो।",
    definition_mr: "ज्या दिवसांत २.५ मिमीपेक्षा कमी पाऊस पडला अशा सलग कोरड्या दिवसांची कमाल संख्या."
  },
  {
    term_en: "Heavy Rainfall Event",
    term_hi: "भारी वर्षा की घटना",
    term_mr: "मुसळधार पावसाचा दिवस",
    definition_en: "A single calendar day with rainfall greater than or equal to 64.5 mm (IMD classification).",
    definition_hi: "एक ही दिन में 64.5 मिमी या उससे अधिक वर्षा का दर्ज होना (मौसम विभाग मानक)।",
    definition_mr: "एकाच दिवसात ६४.५ मिमी किंवा त्याहून अधिक पाऊस पडणे (हवामान विभाग निकष)."
  },
  {
    term_en: "Phenological Stage",
    term_hi: "फसल विकास अवस्था",
    term_mr: "पिकाची वाढीची अवस्था",
    definition_en: "Specific biological phase of crop growth (e.g. Sowing, Vegetative, Flowering, Maturity).",
    definition_hi: "फसल के जीवन चक्र का विशिष्ट जैविक चरण (उदा. बुवाई, वानस्पतिक, पुष्पन, परिपक्वता)।",
    definition_mr: "पिकाच्या जीवनचक्रातील विशिष्ट जैविक टप्पा (उदा. पेरणी, शाकीय वाढ, फुलोरा, पक्वता)."
  },
  {
    term_en: "What-If Simulation",
    term_hi: "परिदृश्य सिमुलेशन ('अगर-मगर')",
    term_mr: "'जर-तर' हवामान परिस्थिती मॉडेल",
    definition_en: "Hypothetical sensitivity analysis perturbing rainfall or temperature to evaluate potential vulnerability shifts.",
    definition_hi: "संभावित जोखिम बदलाव को परखने के लिए वर्षा या तापमान में काल्पनिक बदलाव का विश्लेषण।",
    definition_mr: "हवामानात बदल झाल्यास पिकाच्या जोखमीवर काय परिणाम होईल हे तपासण्यासाठी केलेले काल्पनिक विश्लेषण."
  }
];
