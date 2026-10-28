import React from 'react';
import { WarningCircle, Sparkle } from '@phosphor-icons/react';

interface SimBadgeProps {
  label?: string;
  hint?: string;
}

export const SimBadge: React.FC<SimBadgeProps> = ({
  label = 'PoC 模擬資料 / 流程示意',
  hint = '依 PRD 誠實呈現原則：此項非真實第三方連線或上線數據，僅作為服務流程驗證展示。'
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
