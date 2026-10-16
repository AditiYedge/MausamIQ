export type Language = 'en' | 'hi' | 'mr';

export type RiskCategory = 'low' | 'moderate' | 'high' | 'very_high' | 'insufficient_data';

export interface District {
  district_id: string;
  district_name: string;
  name_mr: string;
  name_hi: string;
  agro_climatic_zone: string;
  zone_code: string;
  latitude: number;
  longitude: number;
  normal_annual_rf_mm: number;
  normal_kharif_rf_mm: number;
  normal_rabi_rf_mm: number;
  rainfall_observed_mm?: number;
  rainfall_normal_mm?: number;
  rainfall_anomaly_pct?: number;
  max_consecutive_dry_days?: number;
  heavy_rainfall_days_count?: number;
}

export interface CropStage {
  stage_id: string;
  stage_name_en: string;
  stage_name_mr: string;
  stage_name_hi: string;
  start_das: number;
  end_das: number;
  vulnerability: string;
}

export interface Crop {
  crop_id: string;
  common_name_en: string;
  common_name_mr: string;
  common_name_hi: string;
  botanical_name: string;
  crop_group: string;
  primary_season: string;
  water_requirement_mm: string;
  optimal_temp_c: string;
  total_duration_days: number;
  stages: CropStage[];
}

export interface MeteorologicalIndicators {
  rainfall_observed_mm: number;
  rainfall_normal_mm: number;
  rainfall_anomaly_pct: number;
  consecutive_dry_days: number;
  heavy_rainfall_days: number;
  mean_tmax_c: number;
  extreme_temp_days: number;
}

export interface TriggeredRule {
  rule_id: string;
  indicator: string;
  operator: string;
  threshold: number | [number, number];
  observed_value: number;
  unit: string;
  severity: RiskCategory;
  citation: string;
  evidence_classification: string;
  explanation: string;
  advisory: string;
}

export interface RiskAssessment {
  overall_category: RiskCategory;
  risk_score_numeric: number;
  triggered_rules: TriggeredRule[];
  untriggered_rules_count: number;
  missing_indicators: string[];
  advisory: string;
}

export interface AssessmentResponse {
  assessment_id: string;
  timestamp: string;
  district: {
    id: string;
    name: string;
    name_en: string;
    zone: string;
    zone_code: string;
    latitude: number;
    longitude: number;
  };
  crop: {
    id: string;
    name: string;
    name_en: string;
    botanical_name: string;
    crop_group: string;
    water_requirement_mm: string;
  };
  phenology: {
    sowing_date: string;
    days_after_sowing: number;
    active_stage_id: string;
    stage_name: string;
    stage_vulnerability: string;
  };
  meteorological_indicators: MeteorologicalIndicators;
  risk_assessment: RiskAssessment;
  provenance: {
    data_source: string;
    baseline_period: string;
    completeness_pct: number;
    rule_set_version: string;
  };
  scientific_limitations: string[];
}

export interface ScenarioResponse {
  is_simulation: boolean;
  disclaimer: string;
  baseline_indicators: MeteorologicalIndicators;
  simulated_indicators: MeteorologicalIndicators;
  applied_perturbations: {
    rainfall_delta_pct: number;
    temperature_delta_c: number;
    dry_spell_delta_days: number;
  };
  baseline_assessment: {
    overall_category: RiskCategory;
    risk_score_numeric: number;
    triggered_rules_count: number;
  };
  simulated_assessment: {
    overall_category: RiskCategory;
    risk_score_numeric: number;
    triggered_rules: TriggeredRule[];
    advisory: string;
  };
  comparison_summary: {
    score_delta: number;
    category_shifted: boolean;
    from_category: RiskCategory;
    to_category: RiskCategory;
  };
}

export interface VoiceIntentResponse {
  intent: string;
  confidence: number;
  transcript: string;
  language: string;
  entities: {
    district_id?: string;
    crop_id?: string;
    season?: string;
  };
  suggested_action: string;
  clarification?: string;
}
