import React from 'react';
import { useTranslation } from 'react-i18next';

const riskColors = {
  critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
  high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-500' },
  moderate: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-500' },
  low: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-500' },
  stable: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
  uplifting: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' }
};

const RiskBadge = ({ level, size = 'md', showLabel = true }) => {
  const { t } = useTranslation();
  
  const colors = riskColors[level] || riskColors.stable;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-semibold border-2 ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses[size]}`}>
      {showLabel ? t(`risk.${level}`) : level.toUpperCase()}
    </span>
  );
};

export default RiskBadge;
