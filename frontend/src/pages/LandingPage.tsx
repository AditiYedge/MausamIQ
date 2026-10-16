import React from 'react';
import { ArrowRight, ShieldCheck, Sprout, CloudRain, Cpu, Sliders, MapPin, Award } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          background: 'linear-gradient(135deg, #123321 0%, #1C5233 60%, #2A6E46 100%)',
          borderRadius: '16px',
          padding: 'clamp(28px, 5vw, 48px) clamp(18px, 4vw, 36px)',
          color: '#FFFFFF',
          boxShadow: '0 10px 25px -5px rgba(18, 51, 33, 0.3)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '20px', backdropFilter: 'blur(4px)' }}>
          <ShieldCheck size={16} />
          <span>{t('hero_badge')}</span>
        </div>

        <h1 style={{ fontSize: '38px', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', maxWidth: '850px', lineHeight: 1.2 }}>
          {t('hero_title')}
        </h1>

        <p style={{ fontSize: '16px', color: '#E2E8F0', maxWidth: '750px', lineHeight: 1.6, marginBottom: '28px' }}>
          {t('hero_desc')}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onNavigate('dashboard')}
            style={{ backgroundColor: '#FFFFFF', color: 'var(--color-brand-dark)', padding: '12px 24px', fontSize: '15px' }}
          >
            <span>{t('hero_cta_dashboard')}</span>
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate('whatif')}
            style={{ background: 'rgba(255, 255, 255, 0.12)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)', padding: '12px 20px', fontSize: '15px' }}
          >
            <Sliders size={18} />
            <span>{t('hero_cta_what_if')}</span>
          </button>
        </div>
      </section>

      {/* Why Crop-Specific Climate Risk Matters */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '8px' }}>The Maharashtra Agro-Climatic Challenge</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '680px', margin: '0 auto', fontSize: '15px' }}>
            A standard weather app gives temperatures and rain percentages. But agricultural decisions require knowing how these conditions impact specific crops at critical growth stages.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <CloudRain size={22} />
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Intra-Seasonal Dry Spells</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              A 14-day dry spell during soybean vegetative growth causes manageable stress, but the same dry spell during flowering causes irreversible flower drop and pod abortion.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Sprout size={22} />
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Crop Phenology Dynamics</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              Different field crops have distinct physiological water requirements. Jowar and Bajra withstand moisture stress that would decimate rainfed soybean or sugarcane.
            </p>
          </div>

          <div className="card">
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#F0FDF4', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '17px', marginBottom: '8px' }}>Transparent Rule Engine</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
              Zero black-box AI hallucinations. Every risk classification decomposes into auditable agronomic thresholds citing peer-reviewed ICAR, MPKV, and PDKV publications.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Analytical Workflow */}
      <section className="card" style={{ padding: '32px 24px', background: 'var(--color-bg-subtle)' }}>
        <h2 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '24px' }}>How MausamIQ Evaluates Climate Risk</h2>
        <div className="grid-4">
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 700 }}>
              1
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Meteorological Input</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Ingests IMD gridded daily rainfall and compares against 1981–2010 district normal baselines.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 700 }}>
              2
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Phenology Mapping</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Calculates Days After Sowing (DAS) to identify whether the crop is in Sowing, Vegetative, Flowering, or Maturity.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 700 }}>
              3
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Rule Evaluation</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Tests active growth stage rules against observed indicators (dry days, rainfall deficit %, heavy rain count).
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-brand-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontWeight: 700 }}>
              4
            </div>
            <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Explainable Advisory</h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Constructs localized plain-language explanations in Marathi, Hindi, or English with audio readout.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audiences */}
      <section className="grid-2">
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} />
            <span>For Farmers & Extension Workers</span>
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Access immediate vernacular voice query tools in Marathi and Hindi. Understand whether the current monsoon break warrants protective irrigation, mulching, or foliar nutrient sprays.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-brand-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} />
            <span>For Researchers & Evaluators</span>
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            Inspect reproducible data provenance, baseline definitions, and rule registries. Run sensitivity What-If simulations to test crop resilience under prospective climate change stresses.
          </p>
        </div>
      </section>
    </div>
  );
};
