import React from 'react';
import { WarningCircle, Sparkle } from '@phosphor-icons/react';

interface SimBadgeProps {
  label?: string;
  hint?: string;
}

export const SimBadge: React.FC<SimBadgeProps> = ({
  label = '示範環境',
  hint = '本系統展示真實服務互動流程，所有資料均為本機安全示範資料。'
}) => {
  return (
    <span
      className="sim-badge"
      title={hint}
      aria-label={`${label}：${hint}`}
    >
      <Sparkle size={14} weight="fill" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};
