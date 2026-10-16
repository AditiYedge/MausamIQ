import React, { useState, useEffect } from 'react';
import { Play, FileDown, Sliders, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { District, Crop, AssessmentResponse } from '../services/types';
import { fetchLocations, fetchCrops, runAssessment, exportReportHtml } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import { DistrictMap } from '../components/DistrictMap';
import { ClimateCharts } from '../components/ClimateCharts';
import { GrowthStageTimeline } from '../components/GrowthStageTimeline';
import { ExplanationCard } from '../components/ExplanationCard';

interface DashboardPageProps {
  onNavigateToWhatIf?: (districtId: string, cropId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateToWhatIf }) => {
  const { language, t } = useLanguage();

  const [districts, setDistricts] = useState<District[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('nashik');
  const [selectedCropId, setSelectedCropId] = useState('soybean');
  const [season, setSeason] = useState('kharif');
  const [year, setYear] = useState(2024);
  const [sowingDate, setSowingDate] = useState('2024-06-25');

  const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Initial Metadata
  useEffect(() => {
    async function loadData() {
      try {
        const [dList, cList] = await Promise.all([fetchLocations(), fetchCrops()]);
        setDistricts(dList);
        setCrops(cList);
      } catch (err: any) {
        setError('Failed to connect to backend API server. Ensure backend is running.');
      }
    }
    loadData();
  }, []);

  // Trigger Assessment
  const handleExecuteAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await runAssessment({
        district_id: selectedDistrictId,
        crop_id: selectedCropId,
        season,
        year,
        sowing_date: sowingDate,
        language
      });
      setAssessment(res);
    } catch (err: any) {
      setError(err.message || 'Error executing assessment');
    } finally {
      setLoading(false);
    }
  };

  // Run on initial mount when districts & crops are available
  useEffect(() => {
    if (districts.length > 0 && crops.length > 0 && !assessment) {
      handleExecuteAssessment();
    }
  }, [districts, crops]);

  // Handle Export HTML Report
  const handleExport = async () => {
    if (!assessment) return;
    try {
      const htmlContent = await exportReportHtml(assessment);
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MausamIQ_${assessment.assessment_id}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to generate export report.');
    }
  };

  const getDistrictName = (d: District) => {
    if (language === 'mr') return d.name_mr || d.district_name;
    if (language === 'hi') return d.name_hi || d.district_name;
    return d.district_name;
  };

  const getCropName = (c: Crop) => {
    if (language === 'mr') return c.common_name_mr || c.common_name_en;
    if (language === 'hi') return c.common_name_hi || c.common_name_en;
    return c.common_name_en;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Parameters Selection Card */}
      <div className="card" style={{ padding: '20px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--color-brand-dark)' }}>
            Agricultural Climate-Risk Assessment Control Panel
          </h2>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Deterministic Rule Engine v1.0
          </span>
        </div>

        <div className="grid-4" style={{ marginBottom: '16px' }}>
          {/* District Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_district')}</label>
            <select
              className="form-select"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
            >
              {districts.map((d) => (
                <option key={d.district_id} value={d.district_id}>
                  {getDistrictName(d)} ({d.agro_climatic_zone.split('/')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Crop Selector */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_crop')}</label>
            <select
              className="form-select"
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
            >
              {crops.map((c) => (
                <option key={c.crop_id} value={c.crop_id}>
                  {getCropName(c)} ({c.botanical_name})
                </option>
              ))}
            </select>
          </div>

          {/* Sowing Date */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_sowing_date')}</label>
            <input
              type="date"
              className="form-input"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
            />
          </div>

          {/* Year & Season */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('label_season')} / {t('label_year')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="form-select"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="kharif">Kharif (खरीप)</option>
                <option value="rabi">Rabi (रब्बी)</option>
              </select>
              <select
                className="form-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                style={{ width: '90px' }}
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExecuteAssessment}
            disabled={loading}
            style={{ padding: '9px 20px' }}
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
            <span>{loading ? 'Evaluating Rules...' : t('btn_assess')}</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Main Dual View Grid */}
      <div className="grid-2">
        {/* Left Column: Interactive Map */}
        <div>
          <DistrictMap
            districts={districts}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(did) => {
              setSelectedDistrictId(did);
            }}
          />
        </div>

        {/* Right Column: Assessment Result Overview */}
        {assessment && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-brand-dark)' }}>
                    {assessment.crop.name} — {assessment.district.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {assessment.district.zone} | {assessment.phenology.stage_name} (DAS: {assessment.phenology.days_after_sowing})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <RiskBadge
                    category={assessment.risk_assessment.overall_category}
                    score={assessment.risk_assessment.risk_score_numeric}
                  />
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleExport}
                  style={{ flex: 1, padding: '7px 12px', fontSize: '13px' }}
                >
                  <FileDown size={15} />
                  <span>{t('btn_export_report')}</span>
                </button>

                {onNavigateToWhatIf && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onNavigateToWhatIf(selectedDistrictId, selectedCropId)}
                    style={{ flex: 1, padding: '7px 12px', fontSize: '13px' }}
                  >
                    <Sliders size={15} />
                    <span>What-If Lab</span>
                  </button>
                )}
              </div>
            </div>

            {/* Growth Stage Phenology Stepper */}
            {crops.find(c => c.crop_id === selectedCropId) && (
              <GrowthStageTimeline
                stages={crops.find(c => c.crop_id === selectedCropId)?.stages || []}
                activeStageId={assessment.phenology.active_stage_id}
                daysAfterSowing={assessment.phenology.days_after_sowing}
                sowingDate={sowingDate}
              />
            )}
          </div>
        )}
      </div>

      {/* Climate Indicators & Audit Cards */}
      {assessment && (
        <div className="grid-2">
          {/* Meteorological Indicators Chart */}
          <ClimateCharts
            indicators={assessment.meteorological_indicators}
            districtName={assessment.district.name}
            season={season}
            year={year}
          />

          {/* Explainable Rules Evaluation Audit Drawer */}
          <ExplanationCard
            triggeredRules={assessment.risk_assessment.triggered_rules}
            untriggeredCount={assessment.risk_assessment.untriggered_rules_count}
            advisory={assessment.risk_assessment.advisory}
            overallCategory={assessment.risk_assessment.overall_category}
          />
        </div>
      )}
    </div>
  );
};
