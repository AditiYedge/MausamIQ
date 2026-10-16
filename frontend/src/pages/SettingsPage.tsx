import React, { useState } from 'react';
import { Settings as SettingsIcon, Volume2, Globe, CheckCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useSpeechSynthesis } from '../voice/useSpeechSynthesis';
import { Language } from '../services/types';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { speak, isPlaying } = useSpeechSynthesis();
  const [savedToast, setSavedToast] = useState(false);

  const handleTestSpeech = () => {
    const testPhrases: Record<Language, string> = {
      mr: 'मौसमIQ मध्ये आपले स्वागत आहे. हे कृषी हवामान जोखीम मूल्यांकन मॉडेल आहे.',
      hi: 'मौसमIQ में आपका स्वागत है। यह कृषि जलवायु जोखिम आकलन प्रणाली है।',
      en: 'Welcome to MausamIQ. This is the agricultural climate-risk assessment engine.'
    };
    speak(testPhrases[language], language);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '780px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <SettingsIcon size={22} color="var(--color-brand-primary)" />
          <h2 style={{ fontSize: '20px', margin: 0, color: 'var(--color-brand-dark)' }}>
            User Preferences & Accessibility Settings
          </h2>
        </div>

        {/* Language Selection Section */}
        <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} />
            <span>Primary Interface Language</span>
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Select your preferred display language. This changes all menus, tooltips, risk explanations, and speech synthesis voices.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { code: 'mr', label: 'मराठी (Marathi)', note: 'स्थानिक बोली व कृषी संज्ञा' },
              { code: 'hi', label: 'हिंदी (Hindi)', note: 'मानक हिंदी शब्दावली' },
              { code: 'en', label: 'English', note: 'Standard Research English' }
            ].map(item => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code as Language);
                  setSavedToast(true);
                  setTimeout(() => setSavedToast(false), 2000);
                }}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '8px',
                  border: language === item.code ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  background: language === item.code ? 'var(--color-brand-light)' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '14px', color: language === item.code ? 'var(--color-brand-primary)' : 'var(--color-text-main)' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {item.note}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Speech Synthesis Test */}
        <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Volume2 size={16} />
            <span>Voice Audio Readout Test</span>
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Test your browser's Web Speech synthesis engine for spoken agronomic advisories.
          </p>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleTestSpeech}
            style={{ fontSize: '13px' }}
          >
            <Volume2 size={15} />
            <span>{isPlaying ? 'Playing Audio...' : 'Test Spoken Readout'}</span>
          </button>
        </div>

        {/* Units Standard */}
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Measurement & Scientific Standards</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            All precipitation is expressed in millimeters (<strong>mm</strong>), temperatures in degrees Celsius (<strong>°C</strong>), and reference baselines fixed to the official 30-year <strong>IMD 1981–2010 normal</strong>.
          </p>
        </div>

        {savedToast && (
          <div style={{ marginTop: '16px', padding: '10px 14px', background: '#F0FDF4', color: '#166534', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={16} />
            <span>Preferences saved successfully to local storage.</span>
          </div>
        )}
      </div>
    </div>
  );
};
