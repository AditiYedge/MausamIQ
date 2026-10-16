import React from 'react';
import { BookOpen, ShieldCheck, Database, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { AGRICULTURAL_GLOSSARY } from '../i18n/glossary';
import { useLanguage } from '../i18n/LanguageContext';

export const DataMethodologyPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title Header */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '22px', margin: '0 0 8px 0', color: 'var(--color-brand-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={22} color="var(--color-brand-primary)" />
          <span>Research Methodology, Data Provenance & Scientific Integrity</span>
        </h2>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
          MausamIQ is engineered as an open, auditable agricultural decision-support platform. This document outlines the authoritative datasets, baseline reference periods, missing data policies, and peer-reviewed agronomic threshold literature governing all calculations.
        </p>
      </div>

      {/* Non-Negotiable Scientific Principles */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '17px', marginBottom: '14px', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} />
          <span>Non-Negotiable Scientific Principles</span>
        </h3>
        <div className="grid-2" style={{ gap: '14px', fontSize: '13px' }}>
          <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '6px' }}>
            <strong>1. No Untrained Machine Learning:</strong> The system does NOT employ unverified deep learning black boxes. Every calculation is deterministic and traceable to published agro-climatic rules.
          </div>
          <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '6px' }}>
            <strong>2. Zero Silent Zero-Imputation:</strong> Missing daily rainfall observations are NEVER converted to 0.0 mm, preventing false drought inflation.
          </div>
          <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '6px' }}>
            <strong>3. Exposure vs. Damage:</strong> Calculated categories represent <em>climatic vulnerability exposure</em>, not guaranteed actuarial crop loss percentages.
          </div>
          <div style={{ padding: '12px', background: 'var(--color-bg-subtle)', borderRadius: '6px' }}>
            <strong>4. Observational Distinction:</strong> Climatological baselines and historical observations are strictly distinguished from operational forecasts.
          </div>
        </div>
      </div>

      {/* Data Sources Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={18} color="var(--color-brand-primary)" />
          <span>Authoritative Data Sources Directory</span>
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '10px' }}>Dataset / Indicator</th>
                <th style={{ padding: '10px' }}>Publishing Authority</th>
                <th style={{ padding: '10px' }}>Baseline Period</th>
                <th style={{ padding: '10px' }}>Scientific Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Gridded Daily Rainfall</td>
                <td style={{ padding: '10px' }}>India Meteorological Department (IMD) Pune</td>
                <td style={{ padding: '10px' }}>1981–2010 Normal</td>
                <td style={{ padding: '10px' }}>Computes seasonal totals, % departure, and dry spells (CDD)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Gridded Max/Min Temperature</td>
                <td style={{ padding: '10px' }}>IMD National Climate Centre</td>
                <td style={{ padding: '10px' }}>30-Year Normal</td>
                <td style={{ padding: '10px' }}>Detects terminal heat stress during reproductive stages</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Soybean Advisory Guidelines</td>
                <td style={{ padding: '10px' }}>ICAR-IISR Indore / MPKV Rahuri</td>
                <td style={{ padding: '10px' }}>Technical Bulletin No. 42</td>
                <td style={{ padding: '10px' }}>Thresholds for CDD &gt; 12 days at flowering/podding</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Cotton Advisory Bulletins</td>
                <td style={{ padding: '10px' }}>ICAR-CICR Nagpur / PDKV Akola</td>
                <td style={{ padding: '10px' }}>CICR Advisory Package</td>
                <td style={{ padding: '10px' }}>Square shedding thresholds during dry spell &gt; 15 days</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 600 }}>Rice Advisory Package</td>
                <td style={{ padding: '10px' }}>Dr. BSKKV Dapoli (Konkan)</td>
                <td style={{ padding: '10px' }}>Konkan Rice Guidelines</td>
                <td style={{ padding: '10px' }}>Spikelet sterility thresholds under standing water deficits</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Multilingual Agricultural Glossary */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--color-brand-primary)" />
          <span>Multilingual Agro-Climatic Terminology Glossary</span>
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {AGRICULTURAL_GLOSSARY.map((g, idx) => (
            <div key={idx} style={{ padding: '12px 16px', background: 'var(--color-bg-subtle)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--color-brand-dark)', fontSize: '14px' }}>{g.term_en}</strong>
                <span style={{ color: 'var(--color-brand-primary)', fontWeight: 600, fontSize: '13px' }}>मराठी: {g.term_mr}</span>
                <span style={{ color: 'var(--color-earth-tan)', fontWeight: 600, fontSize: '13px' }}>हिंदी: {g.term_hi}</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {language === 'mr' ? g.definition_mr : language === 'hi' ? g.definition_hi : g.definition_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
