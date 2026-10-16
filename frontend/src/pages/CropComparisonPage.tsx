import React, { useState, useEffect } from 'react';
import { Columns, Check, RefreshCw } from 'lucide-react';
import { District, Crop } from '../services/types';
import { fetchLocations, fetchCrops, compareCrops } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';

export const CropComparisonPage: React.FC = () => {
  const { language } = useLanguage();
  const [districts, setDistricts] = useState<District[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState('solapur');
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>(['jowar', 'bajra', 'soybean', 'cotton']);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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

  const handleRunComparison = async () => {
    if (selectedCropIds.length === 0) return;
    setLoading(true);
    try {
      const res = await compareCrops(selectedDistrictId, selectedCropIds, 'kharif', 2024, language);
      setComparisonData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (districts.length > 0 && selectedCropIds.length > 0) {
      handleRunComparison();
    }
  }, [selectedDistrictId, selectedCropIds, language]);

  const toggleCrop = (cid: string) => {
    if (selectedCropIds.includes(cid)) {
      if (selectedCropIds.length > 1) {
        setSelectedCropIds(selectedCropIds.filter(id => id !== cid));
      }
    } else {
      if (selectedCropIds.length < 5) {
        setSelectedCropIds([...selectedCropIds, cid]);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Columns size={20} color="var(--color-brand-primary)" />
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--color-brand-dark)' }}>
              Cross-Crop Agro-Climatic Resilience Comparison
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            Evaluates candidate crops under matching meteorological exposure
          </span>
        </div>

        {/* District & Crop Selector Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: '1 1 220px', minWidth: '180px' }}>
            <label className="form-label">Comparison District</label>
            <select
              className="form-select"
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
            >
              {districts.map(d => (
                <option key={d.district_id} value={d.district_id}>
                  {language === 'mr' ? d.name_mr : language === 'hi' ? d.name_hi : d.district_name} ({d.agro_climatic_zone.split('/')[0].trim()})
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: '2 1 280px' }}>
            <label className="form-label">Select Crops to Compare (Click to toggle)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {crops.map(c => {
                const isSelected = selectedCropIds.includes(c.crop_id);
                return (
                  <button
                    key={c.crop_id}
                    type="button"
                    onClick={() => toggleCrop(c.crop_id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                      background: isSelected ? 'var(--color-brand-light)' : '#FFFFFF',
                      color: isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{language === 'mr' ? c.common_name_mr : language === 'hi' ? c.common_name_hi : c.common_name_en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      {comparisonData && comparisonData.comparisons && (
        <div className="grid-2">
          {comparisonData.comparisons.map((c: any) => (
            <div key={c.crop_id} className="card" style={{ padding: '20px', borderTop: '4px solid var(--color-brand-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-brand-dark)' }}>
                    {c.crop_name}
                  </h3>
                  <small style={{ color: 'var(--color-text-muted)' }}><em>{c.botanical_name}</em></small>
                </div>
                <RiskBadge category={c.overall_risk_category} score={c.risk_score_numeric} />
              </div>

              <div className="grid-2" style={{ gap: '10px', marginBottom: '14px' }}>
                <div className="metric-pill">
                  <span className="metric-pill-label">Water Demand</span>
                  <div className="metric-pill-value" style={{ fontSize: '15px' }}>
                    {c.water_requirement_mm} mm
                  </div>
                </div>
                <div className="metric-pill">
                  <span className="metric-pill-label">Crop Lifecycle</span>
                  <div className="metric-pill-value" style={{ fontSize: '15px' }}>
                    {c.duration_days} days
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-subtle)', padding: '12px', borderRadius: '6px', fontSize: '13px', color: 'var(--color-text-main)' }}>
                <strong>Vulnerability Summary:</strong> {c.key_advisory}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
