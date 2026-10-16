import React from 'react';
import { CropStage } from '../services/types';
import { useLanguage } from '../i18n/LanguageContext';
import { Clock, AlertCircle } from 'lucide-react';

interface GrowthStageTimelineProps {
  stages: CropStage[];
  activeStageId: string;
  daysAfterSowing: number;
  sowingDate?: string;
}

export const GrowthStageTimeline: React.FC<GrowthStageTimelineProps> = ({
  stages,
  activeStageId,
  daysAfterSowing,
  sowingDate
}) => {
  const { language, t } = useLanguage();

  const getStageTitle = (s: CropStage) => {
    if (language === 'mr') return s.stage_name_mr || s.stage_name_en;
    if (language === 'hi') return s.stage_name_hi || s.stage_name_en;
    return s.stage_name_en;
  };

  const activeStageObj = stages.find(s => s.stage_id === activeStageId) || stages[0];

  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--color-brand-primary)" />
          <h3 style={{ margin: 0, fontSize: '15px' }}>{t('section_phenology')}</h3>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)', padding: '3px 8px', borderRadius: '4px' }}>
          {t('metric_das')}: <strong>{daysAfterSowing} days</strong> {sowingDate ? `(Sown: ${sowingDate})` : ''}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="table-responsive" style={{ margin: '0 0 16px 0', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: '380px' }}>
          {stages.map((stage) => {
            const isActive = stage.stage_id === activeStageId;
            const isPast = daysAfterSowing > stage.end_das;

            let stepBg = 'var(--color-bg-muted)';
            if (isActive) {
              stepBg = 'var(--color-brand-primary)';
            } else if (isPast) {
              stepBg = '#A0AEC0';
            }

            return (
              <div key={stage.stage_id} style={{ flex: 1, minWidth: '85px', textAlign: 'center' }}>
                <div
                  style={{
                    height: '6px',
                    borderRadius: '3px',
                    background: stepBg,
                    marginBottom: '6px',
                    transition: 'background 0.3s'
                  }}
                />
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                    lineHeight: 1.25,
                    wordBreak: 'break-word'
                  }}
                >
                  {getStageTitle(stage)}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  DAS {stage.start_das}–{stage.end_das}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Vulnerability Callout */}
      {activeStageObj && (
        <div style={{ background: '#FFFBEB', borderLeft: '3px solid #B7791F', padding: '10px 14px', borderRadius: '0 6px 6px 0', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#92400E', marginBottom: '3px' }}>
            <AlertCircle size={15} />
            <span>Active Stage Vulnerability ({getStageTitle(activeStageObj)}):</span>
          </div>
          <p style={{ margin: 0, color: '#78350F' }}>
            {activeStageObj.vulnerability}
          </p>
        </div>
      )}
    </div>
  );
};
