import React from 'react';
import { X, ShieldCheck, Database, Award, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface DataProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataProvenanceModal: React.FC<DataProvenanceModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} color="var(--color-brand-primary)" />
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-brand-dark)' }}>
              Data Provenance & Scientific Integrity
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px', lineHeight: 1.6 }}>
          {/* Primary Meteorological Sources */}
          <div>
            <h4 style={{ fontSize: '15px', color: 'var(--color-brand-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              <span>1. Meteorological Data Sources</span>
            </h4>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              Observations and climatological baselines are sourced directly from the <strong>India Meteorological Department (IMD)</strong>, Ministry of Earth Sciences, Pune Climate Centre. District normals reflect the official 30-year <strong>1981–2010 Long-Period Average (LPA)</strong> baseline standard.
            </p>
          </div>

          {/* Agronomic Rule Sources */}
          <div>
            <h4 style={{ fontSize: '15px', color: 'var(--color-brand-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} />
              <span>2. Peer-Reviewed Agronomic Thresholds</span>
            </h4>
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '13px' }}>
              Every crop vulnerability rule is derived from peer-reviewed bulletins and advisory packages published by:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '6px 0 0 0', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <li><strong>ICAR-IISR Indore:</strong> Indian Institute of Soybean Research.</li>
              <li><strong>ICAR-CICR Nagpur:</strong> Central Institute for Cotton Research.</li>
              <li><strong>MPKV Rahuri:</strong> Mahatma Phule Krishi Vidyapeeth agro-meteorology advisories.</li>
              <li><strong>Dr. PDKV Akola & VNMKV Parbhani:</strong> Vidarbha & Marathwada dryland crop bulletins.</li>
            </ul>
          </div>

          {/* Non-Negotiable Missing Data Policy */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', padding: '12px' }}>
            <h4 style={{ fontSize: '14px', color: '#92400E', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} />
              <span>3. Zero Silent Imputation Policy</span>
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#78350F' }}>
              MausamIQ strictly rejects converting missing rainfall records into zero. If seasonal observations are less than 75% complete, risk classifications are transparently withheld and flagged as <code>insufficient_data</code>.
            </p>
          </div>

          {/* Scientific Boundary Statement */}
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
            <strong>Declaration of Academic Integrity:</strong> MausamIQ does NOT employ unverified black-box neural networks. All evaluations are deterministic, traceable, and reproducible.
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button type="button" className="btn btn-primary" onClick={onClose} style={{ fontSize: '13px' }}>
            {t('btn_close')}
          </button>
        </div>
      </div>
    </div>
  );
};
