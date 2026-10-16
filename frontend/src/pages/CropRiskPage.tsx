import React, { useState, useEffect } from 'react';
import { Sprout, BookOpen, Clock, Droplets, CheckCircle, ShieldAlert } from 'lucide-react';
import { Crop } from '../services/types';
import { fetchCrops } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';

export const CropRiskPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCropId, setSelectedCropId] = useState('soybean');
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const cList = await fetchCrops();
        setCrops(cList);
        const rRes = await fetch('/api/v1/rules');
        if (rRes.ok) {
          const rData = await rRes.json();
          setRules(rData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  const selectedCrop = crops.find(c => c.crop_id === selectedCropId);
  const cropRules = rules.filter(r => r.crop_id === selectedCropId);

  const getCropTitle = (c: Crop) => {
    if (language === 'mr') return c.common_name_mr || c.common_name_en;
    if (language === 'hi') return c.common_name_hi || c.common_name_en;
    return c.common_name_en;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Crop Selector Card */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sprout size={20} color="var(--color-brand-primary)" />
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--color-brand-dark)' }}>
              Crop Phenological Catalogue & Vulnerability Engine
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            10 Maharashtra Field Crops Supported
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {crops.map((c) => {
            const isSelected = c.crop_id === selectedCropId;
            return (
              <button
                key={c.crop_id}
                type="button"
                onClick={() => setSelectedCropId(c.crop_id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: isSelected ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-brand-light)' : '#FFFFFF',
                  color: isSelected ? 'var(--color-brand-primary)' : 'var(--color-text-main)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {getCropTitle(c)}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCrop && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Selected Crop Overview Banner */}
          <div className="card" style={{ padding: '20px', background: 'var(--color-bg-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '20px', margin: '0 0 4px 0', color: 'var(--color-brand-dark)' }}>
                  {getCropTitle(selectedCrop)} (<em>{selectedCrop.botanical_name}</em>)
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  Group: <strong>{selectedCrop.crop_group}</strong> | Primary Season: <strong>{selectedCrop.primary_season.toUpperCase()}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} color="#2B6CB0" />
                  <span>Water Requirement: <strong>{selectedCrop.water_requirement_mm} mm</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="var(--color-brand-primary)" />
                  <span>Duration: <strong>{selectedCrop.total_duration_days} days</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Phenological Growth Stages Grid */}
          <div>
            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'var(--color-brand-dark)' }}>
              Phenological Growth Stages & Vulnerability Profiles
            </h3>
            <div className="grid-2">
              {selectedCrop.stages.map((stage) => (
                <div key={stage.stage_id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--color-brand-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '15px', margin: 0, color: 'var(--color-brand-dark)' }}>
                      {language === 'mr' ? stage.stage_name_mr : language === 'hi' ? stage.stage_name_hi : stage.stage_name_en}
                    </h4>
                    <span style={{ fontSize: '11px', fontWeight: 600, background: 'var(--color-bg-subtle)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
                      DAS {stage.start_das}–{stage.end_das}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {stage.vulnerability}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Versioned Agronomic Rules Registry Table */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--color-brand-primary)" />
                <h3 style={{ margin: 0, fontSize: '16px' }}>
                  Peer-Reviewed Risk Rules for {getCropTitle(selectedCrop)}
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {cropRules.length} Documented Rules
              </span>
            </div>

            {cropRules.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No active rule triggers configured for this crop.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cropRules.map((r) => (
                  <div
                    key={r.rule_id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      background: '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-brand-dark)' }}>{r.rule_id}</span>
                        <RiskBadge category={r.risk_category} showIcon={false} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                        Condition: {r.indicator} {r.operator} {r.threshold} {r.unit}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--color-text-main)' }}>
                      {language === 'mr' ? r.explanation_mr : language === 'hi' ? r.explanation_hi : r.explanation_en}
                    </p>

                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      Literature Citation: <strong style={{ color: 'var(--color-text-secondary)' }}>{r.source_citation}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
