import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { RiskCategory } from '../services/types';
import { useLanguage } from '../i18n/LanguageContext';

interface RiskBadgeProps {
  category: RiskCategory;
  showIcon?: boolean;
  score?: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ category, showIcon = true, score }) => {
  const { t } = useLanguage();

  const getLabel = (cat: RiskCategory) => {
    switch (cat) {
      case 'low': return t('risk_low');
      case 'moderate': return t('risk_moderate');
      case 'high': return t('risk_high');
      case 'very_high': return t('risk_very_high');
      case 'insufficient_data': return t('risk_insufficient_data');
      default: return cat;
    }
  };

  const getIcon = (cat: RiskCategory) => {
    switch (cat) {
      case 'low': return <ShieldCheck size={14} />;
      case 'moderate': return <AlertTriangle size={14} />;
      case 'high':
      case 'very_high': return <AlertOctagon size={14} />;
      default: return <HelpCircle size={14} />;
    }
  };

  return (
    <span className={`risk-badge ${category}`}>
      {showIcon && getIcon(category)}
      <span>{getLabel(category)}</span>
      {score !== undefined && score > 0 && (
        <span style={{ opacity: 0.85, marginLeft: '4px' }}>({score}/100)</span>
      )}
    </span>
  );
};
