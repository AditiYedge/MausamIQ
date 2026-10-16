import React, { useState } from 'react';
import { Mic, Info, Sprout, Menu, X, Globe } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages: { code: Language; label: string; short: string }[] = [
    { code: 'mr', label: 'मराठी', short: 'MR' },
    { code: 'hi', label: 'हिंदी', short: 'HI' },
    { code: 'en', label: 'English', short: 'EN' }
  ];

  const getSettingsLabel = () => {
    if (language === 'mr') return 'भाषा व सेटिंग्ज';
    if (language === 'hi') return 'भाषा व सेटिंग्स';
    return 'Language & Settings';
  };

  const navItems = [
    { id: 'overview', label: t('nav_home') },
    { id: 'dashboard', label: t('nav_dashboard') },
    { id: 'climate', label: t('nav_climate') },
    { id: 'croprisk', label: t('nav_crop_risk') },
    { id: 'whatif', label: t('nav_what_if') },
    { id: 'compare', label: t('nav_compare') },
    { id: 'methodology', label: t('nav_methodology') },
    { id: 'settings', label: getSettingsLabel() }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Identity */}
          <div className="brand-logo" onClick={() => handleNavClick('overview')}>
            <div className="brand-icon-box">
              <Sprout size={20} />
            </div>
            <div className="brand-title">
              <span>MausamIQ</span>
              <span className="brand-subtitle">Maharashtra Agro-Climate</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              style={{ background: 'transparent', border: 'none' }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Prominent Navbar Language Segmented Toggle */}
          <div className="navbar-lang-group" title="Select Platform Language / भाषा निवडा">
            <div className="navbar-lang-label">
              <Globe size={14} />
              <span className="lang-text-desktop">भाषा:</span>
            </div>
            {languages.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`navbar-lang-pill ${language === l.code ? 'active' : ''}`}
                onClick={() => setLanguage(l.code)}
                aria-label={`Change language to ${l.label}`}
              >
                <span className="lang-full-name">{l.label}</span>
                <span className="lang-short-name">{l.short}</span>
              </button>
            ))}
          </div>

          {/* Vernacular Voice Assistant Button */}
          <button
            type="button"
            className="btn btn-voice header-voice-btn"
            onClick={onOpenVoice}
            title={t('btn_voice_assistant')}
          >
            <Mic size={16} />
            <span className="voice-btn-text">{t('btn_voice_assistant')}</span>
          </button>

          {/* Data Provenance Modal Trigger */}
          <button
            type="button"
            className="btn btn-secondary header-info-btn"
            onClick={onOpenProvenance}
            title="Inspect Data Sources & Integrity"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {/* Mobile Drawer Dedicated Language Switcher */}
          <div className="mobile-drawer-lang-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '8px' }}>
              <Globe size={15} />
              <span>भाषा निवडा / भाषा चुनें / Select Language:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                  }}
                  className={`mobile-lang-btn ${language === l.code ? 'active' : ''}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mobile-nav-list">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
