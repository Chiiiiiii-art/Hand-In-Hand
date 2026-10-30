import React, { useState, useEffect } from 'react';
import { TextAa, Eye, SunDim, Sparkle } from '@phosphor-icons/react';

export const AccessibilityBar: React.FC = () => {
  const [isLargeText, setIsLargeText] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isCalmMode, setIsCalmMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isLargeText) root.classList.add('large-text');
    else root.classList.remove('large-text');
  }, [isLargeText]);

  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');
  }, [isHighContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (isCalmMode) root.classList.add('calm-mode');
    else root.classList.remove('calm-mode');
  }, [isCalmMode]);

  return (
    <div
      role="region"
      aria-label="無障礙與易讀性快速調整列"
      style={{
        backgroundColor: 'var(--bg-sand-darker)',
        borderBottom: '1px solid var(--border)',
        fontSize: 'var(--text-xs)',
        padding: '6px 0',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-secondary)' }}>
          <Sparkle size={16} color="var(--primary)" weight="fill" aria-hidden="true" />
          <span style={{ fontWeight: 700, fontSize: '13px' }}>友善無障礙輔助：</span>
          <span style={{ opacity: 0.9, fontSize: '13px' }}>支援大字體、高對比與低刺激模式</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* 大字級切換 */}
          <button
            type="button"
            onClick={() => setIsLargeText(!isLargeText)}
            aria-pressed={isLargeText}
            style={{
              minHeight: 36,
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: isLargeText ? '2px solid var(--primary)' : '1.5px solid var(--border)',
              backgroundColor: isLargeText ? 'var(--primary)' : 'var(--surface)',
              color: isLargeText ? '#FFFFFF' : 'var(--ink-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <TextAa size={16} weight="bold" />
            <span>{isLargeText ? '字級：已放大 (120%)' : '放大字級'}</span>
          </button>

          {/* 高對比切換 */}
          <button
            type="button"
            onClick={() => setIsHighContrast(!isHighContrast)}
            aria-pressed={isHighContrast}
            style={{
              minHeight: 36,
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: isHighContrast ? '2px solid var(--primary)' : '1.5px solid var(--border)',
              backgroundColor: isHighContrast ? 'var(--primary)' : 'var(--surface)',
              color: isHighContrast ? '#FFFFFF' : 'var(--ink-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Eye size={16} weight="bold" />
            <span>{isHighContrast ? '高對比：已開啟' : '高對比模式'}</span>
          </button>

          {/* 專注/低刺激切換 */}
          <button
            type="button"
            onClick={() => setIsCalmMode(!isCalmMode)}
            aria-pressed={isCalmMode}
            style={{
              minHeight: 36,
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: isCalmMode ? '2px solid var(--primary)' : '1.5px solid var(--border)',
              backgroundColor: isCalmMode ? 'var(--primary)' : 'var(--surface)',
              color: isCalmMode ? '#FFFFFF' : 'var(--ink-primary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <SunDim size={16} weight="bold" />
            <span>{isCalmMode ? '靜心模式：已開啟' : '靜心模式'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
