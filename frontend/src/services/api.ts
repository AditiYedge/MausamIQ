import {
  District,
  Crop,
  AssessmentResponse,
  ScenarioResponse,
  VoiceIntentResponse
} from './types';

const API_BASE = '/api/v1';

export async function fetchLocations(zone?: string): Promise<District[]> {
  const url = zone ? `${API_BASE}/locations?zone=${encodeURIComponent(zone)}` : `${API_BASE}/locations`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch districts');
  return res.json();
}

export async function fetchCrops(): Promise<Crop[]> {
  const res = await fetch(`${API_BASE}/crops`);
  if (!res.ok) throw new Error('Failed to fetch crops catalog');
  return res.json();
}

export async function fetchClimateSummary(districtId: string, season: string = 'kharif', year: number = 2024) {
  const res = await fetch(`${API_BASE}/climate/summary?district_id=${districtId}&season=${season}&year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch climate summary');
  return res.json();
}

export async function fetchMapSummary(season: string = 'kharif', year: number = 2024): Promise<District[]> {
  const res = await fetch(`${API_BASE}/climate/map-summary?season=${season}&year=${year}`);
  if (!res.ok) throw new Error('Failed to fetch map data');
  return res.json();
}

export async function fetchClimateTrends(districtId: string) {
  const res = await fetch(`${API_BASE}/climate/trends?district_id=${districtId}`);
  if (!res.ok) throw new Error('Failed to fetch climate trends');
  return res.json();
}

export async function runAssessment(params: {
  district_id: string;
  crop_id: string;
  season?: string;
  year?: number;
  sowing_date?: string;
  language?: string;
}): Promise<AssessmentResponse> {
  const res = await fetch(`${API_BASE}/assessments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to calculate climate risk assessment');
  return res.json();
}

export async function runScenario(params: {
  district_id: string;
  crop_id: string;
  season?: string;
  year?: number;
  sowing_date?: string;
  perturbations: {
    rainfall_delta_pct: number;
    temperature_delta_c: number;
    dry_spell_delta_days: number;
  };
  language?: string;
}): Promise<ScenarioResponse> {
  const res = await fetch(`${API_BASE}/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Failed to execute What-If simulation');
  return res.json();
}

export async function compareCrops(districtId: string, cropIds: string[], season: string = 'kharif', year: number = 2024, language: string = 'en') {
  const ids = cropIds.join(',');
  const res = await fetch(`${API_BASE}/crops/compare?district_id=${districtId}&crop_ids=${ids}&season=${season}&year=${year}&language=${language}`);
  if (!res.ok) throw new Error('Failed to compare crops');
  return res.json();
}

export async function parseVoiceIntent(transcript: string, language: string = 'en'): Promise<VoiceIntentResponse> {
  const res = await fetch(`${API_BASE}/voice/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript, language })
  });
  if (!res.ok) throw new Error('Failed to parse voice query intent');
  return res.json();
}

export async function exportReportHtml(assessmentData: AssessmentResponse): Promise<string> {
  const res = await fetch(`${API_BASE}/export/html`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assessment_data: assessmentData })
  });
  if (!res.ok) throw new Error('Failed to export HTML report');
  return res.text();
}
