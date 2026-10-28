import React from 'react';
import {
  CheckCircle,
  Clock,
  WarningCircle,
  XCircle,
  Info
} from '@phosphor-icons/react';
import { STATUS_DESCRIPTIONS } from '../types';

interface StatusChipProps {
  status: string;
  showDescTooltip?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, showDescTooltip = true }) => {
  const meta = STATUS_DESCRIPTIONS[status] || {
    label: status,
    desc: '無詳細說明',
    variant: 'neutral'
  };

  const getIcon = () => {
    switch (meta.variant) {
      case 'success':
        return <CheckCircle size={16} weight="fill" aria-hidden="true" />;
      case 'warning':
        return <WarningCircle size={16} weight="fill" aria-hidden="true" />;
      case 'info':
        return <Info size={16} weight="fill" aria-hidden="true" />;
      case 'danger':
        return <XCircle size={16} weight="fill" aria-hidden="true" />;
      default:
        return <Clock size={16} weight="fill" aria-hidden="true" />;
    }
  };

  return (
    <span
      className={`chip chip-${meta.variant}`}
      title={showDescTooltip ? `${meta.label}：${meta.desc}` : undefined}
      aria-label={`${meta.label}，狀態說明：${meta.desc}`}
    >
      {getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
