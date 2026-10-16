import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClimateAnalysisPage } from './pages/ClimateAnalysisPage';
import { CropRiskPage } from './pages/CropRiskPage';
import { WhatIfLabPage } from './pages/WhatIfLabPage';
import { CropComparisonPage } from './pages/CropComparisonPage';
import { DataMethodologyPage } from './pages/DataMethodologyPage';
import { SettingsPage } from './pages/SettingsPage';
import { VoiceAssistantModal } from './voice/VoiceAssistantModal';
import { DataProvenanceModal } from './components/DataProvenanceModal';
import { VoiceIntentResponse } from './services/types';

const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);

  const handleVoiceAction = (intentResult: VoiceIntentResponse) => {
    if (intentResult.intent === 'what_if_simulation') {
      setActiveTab('whatif');
    } else if (intentResult.intent === 'rainfall_trend') {
      setActiveTab('climate');
    } else if (intentResult.intent === 'crop_comparison') {
      setActiveTab('compare');
    } else {
      setActiveTab('dashboard');
    }
  };

  return (
    <div className="app-container">
      {/* Editorial Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <LandingPage onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage onNavigateToWhatIf={() => setActiveTab('whatif')} />
        )}
        {activeTab === 'climate' && <ClimateAnalysisPage />}
        {activeTab === 'croprisk' && <CropRiskPage />}
        {activeTab === 'whatif' && <WhatIfLabPage />}
        {activeTab === 'compare' && <CropComparisonPage />}
        {activeTab === 'methodology' && <DataMethodologyPage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* Global Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSelectAction={handleVoiceAction}
      />

      <DataProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
      />

      {/* Editorial Agricultural Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          background: '#FFFFFF',
          padding: '24px 20px',
          marginTop: 'auto'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)'
          }}
        >
          <div>
            <strong>MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture</strong>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Academic Research Platform for Maharashtra Agro-Climatic Intelligence (36 Districts)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ cursor: 'pointer', color: 'var(--color-brand-primary)' }} onClick={() => setIsProvenanceOpen(true)}>
              Data Sources & Provenance
            </span>
            <span style={{ cursor: 'pointer', color: 'var(--color-brand-primary)' }} onClick={() => setActiveTab('methodology')}>
              Scientific Methodology
            </span>
            <span style={{ cursor: 'pointer', color: 'var(--color-brand-primary)' }} onClick={() => setActiveTab('settings')}>
              Accessibility & Language
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ErrorBoundary>
  );
};

export default App;
