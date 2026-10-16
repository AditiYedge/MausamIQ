import React from 'react';
import { CloudRain, Sun, Droplets, Calendar } from 'lucide-react';
import { MeteorologicalIndicators } from '../services/types';
import { useLanguage } from '../i18n/LanguageContext';

interface ClimateChartsProps {
  indicators: MeteorologicalIndicators;
  districtName: string;
  season?: string;
  year?: number;
  historicalTrends?: any[];
}

export const ClimateCharts: React.FC<ClimateChartsProps> = ({
  indicators,
  districtName,
  season = 'kharif',
  year = 2024,
  historicalTrends = []
}) => {
  const { t } = useLanguage();

  const obsRf = indicators.rainfall_observed_mm;
  const normRf = indicators.rainfall_normal_mm;
  const maxRf = Math.max(obsRf, normRf, 500) * 1.15;
  const obsPct = Math.min(100, Math.round((obsRf / maxRf) * 100));
  const normPct = Math.min(100, Math.round((normRf / maxRf) * 100));

  const anom = indicators.rainfall_anomaly_pct;
  const anomColor = anom >= 20 ? '#2B6CB0' : anom >= -19 ? '#1E5E3A' : anom >= -59 ? '#D69E2E' : '#E53E3E';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Rainfall vs Normal Comparison Card */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudRain size={18} color="var(--color-brand-primary)" />
            <h3 style={{ margin: 0, fontSize: '15px' }}>{t('metric_rainfall_obs')} vs. {t('metric_rainfall_normal')}</h3>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: anomColor, background: 'var(--color-bg-subtle)', padding: '3px 8px', borderRadius: '4px' }}>
            {anom > 0 ? `+${anom}%` : `${anom}%`} {anom >= -19 && anom <= 19 ? '(Normal)' : ''}
          </span>
        </div>

        {/* Comparative Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              <span>{t('metric_rainfall_obs')} ({year})</span>
              <span style={{ color: 'var(--color-brand-primary)' }}>{obsRf} mm</span>
            </div>
            <div style={{ height: '14px', background: 'var(--color-bg-muted)', borderRadius: '7px', overflow: 'hidden' }}>
              <div style={{ width: `${obsPct}%`, height: '100%', background: 'linear-gradient(90deg, #1C5233, #2F855A)', borderRadius: '7px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
              <span>{t('metric_rainfall_normal')} (IMD 1981–2010 Normal)</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>{normRf} mm</span>
            </div>
            <div style={{ height: '14px', background: 'var(--color-bg-muted)', borderRadius: '7px', overflow: 'hidden' }}>
              <div style={{ width: `${normPct}%`, height: '100%', background: '#718096', borderRadius: '7px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Climate Indicators Strip */}
      <div className="grid-3" style={{ gap: '12px' }}>
        <div className="metric-pill">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sun size={15} color="#D69E2E" />
            <span className="metric-pill-label">{t('metric_cdd')}</span>
          </div>
          <div className="metric-pill-value" style={{ color: indicators.consecutive_dry_days >= 12 ? '#C53030' : 'inherit' }}>
            {indicators.consecutive_dry_days} <span style={{ fontSize: '13px', fontWeight: 400 }}>days</span>
          </div>
          <small style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Daily rain &lt; 2.5mm</small>
        </div>

        <div className="metric-pill">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Droplets size={15} color="#2B6CB0" />
            <span className="metric-pill-label">{t('metric_heavy_rain')}</span>
          </div>
          <div className="metric-pill-value" style={{ color: indicators.heavy_rainfall_days >= 3 ? '#C53030' : 'inherit' }}>
            {indicators.heavy_rainfall_days} <span style={{ fontSize: '13px', fontWeight: 400 }}>events</span>
          </div>
          <small style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Daily rain &ge; 64.5mm</small>
        </div>

        <div className="metric-pill">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="#4A5568" />
            <span className="metric-pill-label">{t('metric_tmax')}</span>
          </div>
          <div className="metric-pill-value">
            {indicators.mean_tmax_c}° <span style={{ fontSize: '13px', fontWeight: 400 }}>C</span>
          </div>
          <small style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Seasonal 2m average</small>
        </div>
      </div>

      {/* Longitudinal Multi-Year Trends if available */}
      {historicalTrends.length > 0 && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>Historical Kharif Rainfall Trend — {districtName}</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '110px', paddingTop: '10px' }}>
            {historicalTrends.map((tRec, idx) => {
              const hRf = tRec.rainfall_observed_mm;
              const hHeight = Math.min(100, Math.round((hRf / 1200) * 100));
              const isCurrent = tRec.year === year;
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                    {hRf}mm
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '36px',
                      height: `${hHeight}%`,
                      background: isCurrent ? 'var(--color-brand-primary)' : '#CBD5E0',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: isCurrent ? 700 : 400 }}>
                    {tRec.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
