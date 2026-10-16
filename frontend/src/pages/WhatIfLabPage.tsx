import React, { useState, useEffect } from 'react';
import { Sliders, RefreshCw, AlertTriangle, ArrowRight, Play, Info } from 'lucide-react';
import { District, Crop, ScenarioResponse } from '../services/types';
import { fetchLocations, fetchCrops, runScenario } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';

export const WhatIfLabPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [districts, setDistricts] = useState<District[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState('akola');
  const [selectedCropId, setSelectedCropId] = useState('cotton');
  const [sowingDate, setSowingDate] = useState('2024-06-20');

  // Perturbation Levers
  const [rainfallDelta, setRainfallDelta] = useState<number>(-20);
  const [tempDelta, setTempDelta] = useState<number>(1.5);
  const [drySpellDelta, setDrySpellDelta] = useState<number>(6);

  const [scenarioResult, setScenarioResult] = useState<ScenarioResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [dList, cList] = await Promise.all([fetchLocations(), fetchCrops()]);
        setDistricts(dList);
        setCrops(cList);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runScenario({
        district_id: selectedDistrictId,
        crop_id: selectedCropId,
        season: 'kharif',
        year: 2024,
        sowing_date: sowingDate,
        perturbations: {
          rainfall_delta_pct: rainfallDelta,
          temperature_delta_c: tempDelta,
          dry_spell_delta_days: drySpellDelta
        },
        language
      });
      setScenarioResult(res);
    } catch (err: any) {
      setError(err.message || 'Error running simulation');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (districts.length > 0 && crops.length > 0) {
      handleSimulate();
    }
  }, [selectedDistrictId, selectedCropId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Disclaimer Banner */}
      <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <AlertTriangle size={22} color="#B7791F" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 700, color: '#92400E', fontSize: '14px' }}>
            Hypothetical Sensitivity Scenario Laboratory
          </div>
          <div style={{ fontSize: '13px', color: '#78350F' }}>
            This laboratory tests mathematical sensitivity of agronomic rules against perturbed climate levers. It is strictly a research simulation tool, <strong>NOT</strong> an operational weather forecast or yield prediction.
          </div>
        </div>
      </div>

      {/* Control Levers Card */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '17px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <Sliders size={18} color="var(--color-brand-primary)" />
          <span>Interactive Climate Perturbation Levers</span>
        </h3>

        <div className="grid-3" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">{t('label_district')}</label>
            <select
              className="form-select"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
            >
              {districts.map(d => (
                <option key={d.district_id} value={d.district_id}>
                  {language === 'mr' ? d.name_mr : language === 'hi' ? d.name_hi : d.district_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('label_crop')}</label>
            <select
              className="form-select"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
            >
              {crops.map(c => (
                <option key={c.crop_id} value={c.crop_id}>
                  {language === 'mr' ? c.common_name_mr : language === 'hi' ? c.common_name_hi : c.common_name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{t('label_sowing_date')}</label>
            <input
              type="date"
              className="form-input"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
            />
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid-3" style={{ background: 'var(--color-bg-subtle)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
          {/* Rainfall Adjustment */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>{t('label_rainfall_delta')}</span>
              <span style={{ color: rainfallDelta < 0 ? '#C53030' : '#2B6CB0' }}>{rainfallDelta > 0 ? `+${rainfallDelta}%` : `${rainfallDelta}%`}</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="5"
              value={rainfallDelta}
              onChange={(e) => setRainfallDelta(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              <span>-40% (Severe Deficit)</span>
              <span>+40% (Excess)</span>
            </div>
          </div>

          {/* Temperature Shift */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>{t('label_temperature_delta')}</span>
              <span style={{ color: tempDelta > 0 ? '#C53030' : '#1E5E3A' }}>{tempDelta > 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="4"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              <span>-2.0°C</span>
              <span>+4.0°C (Heatwave)</span>
            </div>
          </div>

          {/* Dry Spell Extension */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
              <span>{t('label_dry_spell_delta')}</span>
              <span style={{ color: drySpellDelta > 5 ? '#C53030' : '#718096' }}>+{drySpellDelta} days</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={drySpellDelta}
              onChange={(e) => setDrySpellDelta(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              <span>0 (Baseline)</span>
              <span>+20 days (Severe Break)</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setRainfallDelta(0);
              setTempDelta(0);
              setDrySpellDelta(0);
            }}
          >
            {t('btn_reset')}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSimulate}
            disabled={loading}
          >
            <Play size={16} />
            <span>{loading ? 'Simulating...' : t('btn_simulate')}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Comparative Cards */}
      {scenarioResult && (
        <div className="grid-2">
          {/* Baseline Card */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                1. Empirical Historical Baseline
              </h4>
              <RiskBadge
                category={scenarioResult.baseline_assessment.overall_category}
                score={scenarioResult.baseline_assessment.risk_score_numeric}
              />
            </div>

            <div className="grid-3" style={{ gap: '10px', marginBottom: '14px' }}>
              <div className="metric-pill">
                <span className="metric-pill-label">Rainfall</span>
                <div className="metric-pill-value" style={{ fontSize: '16px' }}>
                  {scenarioResult.baseline_indicators.rainfall_observed_mm} mm
                </div>
              </div>
              <div className="metric-pill">
                <span className="metric-pill-label">Departure</span>
                <div className="metric-pill-value" style={{ fontSize: '16px' }}>
                  {scenarioResult.baseline_indicators.rainfall_anomaly_pct}%
                </div>
              </div>
              <div className="metric-pill">
                <span className="metric-pill-label">Dry Spell</span>
                <div className="metric-pill-value" style={{ fontSize: '16px' }}>
                  {scenarioResult.baseline_indicators.consecutive_dry_days} days
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
              Triggered Rules Count: <strong>{scenarioResult.baseline_assessment.triggered_rules_count}</strong>
            </p>
          </div>

          {/* Simulated Perturbed Card */}
          <div className="card" style={{ padding: '20px', border: '2px solid var(--color-brand-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--color-brand-primary)' }}>
                2. Perturbed Hypothetical Scenario
              </h4>
              <RiskBadge
                category={scenarioResult.simulated_assessment.overall_category}
                score={scenarioResult.simulated_assessment.risk_score_numeric}
              />
            </div>

            <div className="grid-3" style={{ gap: '10px', marginBottom: '14px' }}>
              <div className="metric-pill">
                <span className="metric-pill-label">Sim. Rainfall</span>
                <div className="metric-pill-value" style={{ fontSize: '16px', color: 'var(--color-brand-primary)' }}>
                  {scenarioResult.simulated_indicators.rainfall_observed_mm} mm
                </div>
              </div>
              <div className="metric-pill">
                <span className="metric-pill-label">Sim. Departure</span>
                <div className="metric-pill-value" style={{ fontSize: '16px' }}>
                  {scenarioResult.simulated_indicators.rainfall_anomaly_pct}%
                </div>
              </div>
              <div className="metric-pill">
                <span className="metric-pill-label">Sim. Dry Spell</span>
                <div className="metric-pill-value" style={{ fontSize: '16px', color: scenarioResult.simulated_indicators.consecutive_dry_days >= 12 ? '#C53030' : 'inherit' }}>
                  {scenarioResult.simulated_indicators.consecutive_dry_days} days
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-subtle)', padding: '10px', borderRadius: '6px', fontSize: '13px', color: 'var(--color-text-main)' }}>
              <strong>Shift Rationale:</strong> {scenarioResult.simulated_assessment.advisory}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
