import React from 'react';
import { useAppStore } from '../store';
import { User, ShieldCheck, ArrowClockwise } from '@phosphor-icons/react';

export const RoleSwitch: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const currentApplicant = state.applications.find(a => a.id === state.currentParticipantId);

  return (
    <div
      role="region"
      aria-label="展示角色切換器"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'var(--bg-sand-darker)',
        padding: '4px 8px',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--border)',
        fontSize: 'var(--text-sm)',
      }}
    >
      <span style={{ color: 'var(--ink-secondary)', fontWeight: 600, paddingLeft: 4 }}>
        視角：
      </span>

      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_ROLE', role: 'participant' })}
        style={{
          minHeight: 36,
          padding: '0 12px',
          borderRadius: 'var(--radius-full)',
          background: state.currentRole === 'participant' ? 'var(--primary)' : 'transparent',
          color: state.currentRole === 'participant' ? '#FFFFFF' : 'var(--ink-primary)',
          fontSize: 'var(--text-sm)',
        }}
        aria-pressed={state.currentRole === 'participant'}
      >
        <User size={16} weight="bold" aria-hidden="true" />
        <span>參與者端</span>
        {state.currentRole === 'participant' && currentApplicant && (
          <span style={{ opacity: 0.9, fontSize: '0.85em' }}>（{currentApplicant.nickname}）</span>
        )}
      </button>

      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_ROLE', role: 'admin' })}
        style={{
          minHeight: 36,
          padding: '0 12px',
          borderRadius: 'var(--radius-full)',
          background: state.currentRole === 'admin' ? 'var(--primary)' : 'transparent',
          color: state.currentRole === 'admin' ? '#FFFFFF' : 'var(--ink-primary)',
          fontSize: 'var(--text-sm)',
        }}
        aria-pressed={state.currentRole === 'admin'}
      >
        <ShieldCheck size={16} weight="bold" aria-hidden="true" />
        <span>管理者後台</span>
      </button>

      {/* 切換測試參與者視角下拉 */}
      {state.currentRole === 'participant' && (
        <select
          value={state.currentParticipantId}
          onChange={(e) => dispatch({ type: 'SET_PARTICIPANT_ID', id: e.target.value })}
          aria-label="切換參與者身分"
          style={{
            minHeight: 36,
            width: 'auto',
            padding: '2px 8px',
            fontSize: 'var(--text-xs)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {state.applications.map(app => (
            <option key={app.id} value={app.id}>
              {app.nickname} ({app.status})
            </option>
          ))}
        </select>
      )}

      {/* 一鍵重置示範資料按鈕 */}
      <button
        type="button"
        onClick={() => {
          if (window.confirm('確定要將所有申請、場次與回報資料重置為初始示範狀態嗎？')) {
            dispatch({ type: 'RESET_DATA' });
          }
        }}
        title="重置所有資料為初始示範狀態"
        style={{
          minHeight: 36,
          padding: '0 8px',
          color: 'var(--ink-secondary)',
          fontSize: 'var(--text-xs)',
        }}
      >
        <ArrowClockwise size={16} aria-hidden="true" />
        <span>重置示範</span>
      </button>
    </div>
  );
};
