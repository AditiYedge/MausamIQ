import React, { useState } from 'react';
import { Mic, Info, Sprout, Menu, X } from 'lucide-react';
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

          {/* Language Switcher Dropdown */}
          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            aria-label="Interface Language"
          >
            <option value="mr">मराठी</option>
            <option value="hi">हिंदी</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
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
