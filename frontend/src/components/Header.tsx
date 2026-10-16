import React from 'react';
import { Mic, Info, Sprout } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../services/types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVoice: () => void;
  onOpenProvenance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenVoice,
  onOpenProvenance
}) => {
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { id: 'overview', label: t('nav_home') },
    { id: 'dashboard', label: t('nav_dashboard') },
    { id: 'climate', label: t('nav_climate') },
    { id: 'croprisk', label: t('nav_crop_risk') },
    { id: 'whatif', label: t('nav_what_if') },
    { id: 'compare', label: t('nav_compare') },
    { id: 'methodology', label: t('nav_methodology') },
    { id: 'settings', label: t('nav_settings') }
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Identity */}
        <div className="brand-logo" onClick={() => setActiveTab('overview')}>
          <div className="brand-icon-box">
            <Sprout size={22} />
          </div>
          <div className="brand-title">
            <span>MausamIQ</span>
            <span className="brand-subtitle">Maharashtra Agro-Climatic Intelligence</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              style={{ background: 'transparent', border: 'none' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Vernacular Voice Assistant Button */}
          <button
            type="button"
            className="btn btn-voice"
            onClick={onOpenVoice}
            title={t('btn_voice_assistant')}
          >
            <Mic size={16} />
            <span style={{ fontSize: '13px' }}>{t('btn_voice_assistant')}</span>
          </button>

          {/* Data Provenance Modal Trigger */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenProvenance}
            title="Inspect Data Sources & Integrity"
            style={{ padding: '8px 10px' }}
          >
            <Info size={16} />
          </button>

          {/* Language Switcher Dropdown */}
          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Interface Language"
          >
            <option value="mr">मराठी (Marathi)</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </header>
  );
};
