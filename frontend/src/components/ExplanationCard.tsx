import React, { useState } from 'react';
import { BookOpen, Volume2, Square, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { TriggeredRule, RiskCategory } from '../services/types';
import { RiskBadge } from './RiskBadge';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpeechSynthesis } from '../voice/useSpeechSynthesis';

interface ExplanationCardProps {
  triggeredRules: TriggeredRule[];
  untriggeredCount: number;
  advisory: string;
  overallCategory: RiskCategory;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  triggeredRules,
  untriggeredCount,
  advisory,
  overallCategory
}) => {
  const { language, t } = useLanguage();
  const { speak, stop, isPlaying } = useSpeechSynthesis();
  const [expanded, setExpanded] = useState(true);

  const handleToggleVoice = () => {
    if (isPlaying) {
      stop();
    } else {
      const speechText = `${advisory} ${triggeredRules.map(r => r.explanation).join('. ')}`;
      speak(speechText, language);
    }
  };

  return (
    <div className="card" style={{ padding: '18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--color-brand-primary)" />
          <h3 style={{ margin: 0, fontSize: '16px' }}>{t('section_rules_audit')}</h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Spoken Audio Readout Button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleToggleVoice}
            style={{ padding: '4px 10px', fontSize: '12px' }}
          >
            {isPlaying ? <Square size={13} /> : <Volume2 size={13} />}
            <span>{isPlaying ? t('btn_stop_audio') : t('btn_play_audio')}</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Actionable Advisory Highlight */}
      <div style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-brand-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          {t('section_advisory')}
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
          {advisory}
        </p>
      </div>

      {expanded && (
        <div>
          {triggeredRules.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px', color: '#166534', fontSize: '13px' }}>
              <CheckCircle2 size={18} />
              <span>No severe climate vulnerability rules were triggered for this stage. Conditions remain within acceptable agronomic limits.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {triggeredRules.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderLeft: `4px solid ${r.severity === 'high' || r.severity === 'very_high' ? '#C53030' : '#D69E2E'}`,
                    borderRadius: '0 6px 6px 0',
                    padding: '12px 14px',
                    background: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-brand-dark)' }}>{r.rule_id}</span>
                      <RiskBadge category={r.severity} showIcon={false} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-subtle)', padding: '2px 6px', borderRadius: '4px' }}>
                      Observed: {r.observed_value} {r.unit} ({r.operator} {r.threshold} {r.unit})
                    </span>
                  </div>

                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--color-text-main)' }}>
                    {r.explanation}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Citation:</span>
                    <strong style={{ color: 'var(--color-text-secondary)' }}>{r.citation}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'right' }}>
            <span>{untriggeredCount} other stage rules evaluated and found compliant.</span>
          </div>
        </div>
      )}
    </div>
  );
};
