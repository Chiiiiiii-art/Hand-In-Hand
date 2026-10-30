import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { User, UsersThree, ShieldCheck, ArrowClockwise } from '@phosphor-icons/react';

export const RoleSwitch: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const currentApplicant = state.applications.find(a => a.id === state.currentParticipantId);

  return (
    <div
      role="region"
      aria-label="角色視角切換器"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-sand-darker)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        border: '1.5px solid var(--border)',
        fontSize: 'var(--text-sm)',
        flexWrap: 'wrap',
      }}
    >
      <span style={{ color: 'var(--ink-secondary)', fontWeight: 700, paddingLeft: 4, whiteSpace: 'nowrap' }}>
        角色視角：
      </span>

      {/* 參與者角色 */}
      <button
        type="button"
        onClick={() => {
          dispatch({ type: 'SET_ROLE', role: 'participant' });
          navigate('/');
        }}
        style={{
          minHeight: 38,
          padding: '0 14px',
          borderRadius: 'var(--radius-full)',
          background: state.currentRole === 'participant' ? 'var(--primary)' : 'var(--surface)',
          color: state.currentRole === 'participant' ? '#FFFFFF' : 'var(--ink-primary)',
          fontSize: '13px',
          fontWeight: 700,
          border: state.currentRole === 'participant' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: state.currentRole === 'participant' ? 'var(--shadow-sm)' : 'none',
        }}
        aria-pressed={state.currentRole === 'participant'}
      >
        <User size={16} weight="bold" aria-hidden="true" />
        <span>參與者</span>
        {state.currentRole === 'participant' && currentApplicant && (
          <span style={{ opacity: 0.9, fontSize: '0.9em' }}>（{currentApplicant.nickname}）</span>
        )}
      </button>

      {/* 主持人角色 */}
      <button
        type="button"
        onClick={() => {
          dispatch({ type: 'SET_ROLE', role: 'host' });
          navigate('/host/console');
        }}
        style={{
          minHeight: 38,
          padding: '0 14px',
          borderRadius: 'var(--radius-full)',
          background: state.currentRole === 'host' ? 'var(--primary)' : 'var(--surface)',
          color: state.currentRole === 'host' ? '#FFFFFF' : 'var(--ink-primary)',
          fontSize: '13px',
          fontWeight: 700,
          border: state.currentRole === 'host' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: state.currentRole === 'host' ? 'var(--shadow-sm)' : 'none',
        }}
        aria-pressed={state.currentRole === 'host'}
      >
        <UsersThree size={16} weight="bold" aria-hidden="true" />
        <span>引導主持</span>
        {state.currentRole === 'host' && (
          <span style={{ opacity: 0.9, fontSize: '0.9em' }}>（陳主持）</span>
        )}
      </button>

      {/* 服務管理者角色 */}
      <button
        type="button"
        onClick={() => {
          dispatch({ type: 'SET_ROLE', role: 'admin' });
          navigate('/admin/dashboard');
        }}
        style={{
          minHeight: 38,
          padding: '0 14px',
          borderRadius: 'var(--radius-full)',
          background: state.currentRole === 'admin' ? 'var(--primary)' : 'var(--surface)',
          color: state.currentRole === 'admin' ? '#FFFFFF' : 'var(--ink-primary)',
          fontSize: '13px',
          fontWeight: 700,
          border: state.currentRole === 'admin' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: state.currentRole === 'admin' ? 'var(--shadow-sm)' : 'none',
        }}
        aria-pressed={state.currentRole === 'admin'}
      >
        <ShieldCheck size={16} weight="bold" aria-hidden="true" />
        <span>服務管理</span>
      </button>

      {/* 切換測試隊友視角下拉 */}
      {state.currentRole === 'participant' && (
        <select
          value={state.currentParticipantId}
          onChange={(e) => dispatch({ type: 'SET_PARTICIPANT_ID', id: e.target.value })}
          aria-label="切換隊友身分"
          style={{
            minHeight: 38,
            width: 'auto',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 600,
            background: 'var(--surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
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
          if (window.confirm('確定要將所有小組世界、任務與記錄重置為初始示範狀態嗎？')) {
            dispatch({ type: 'RESET_DATA' });
          }
        }}
        title="重置所有資料為初始示範狀態"
        style={{
          minHeight: 38,
          padding: '0 12px',
          color: 'var(--ink-secondary)',
          fontSize: '12px',
          fontWeight: 600,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <ArrowClockwise size={14} aria-hidden="true" />
        <span>重置示範</span>
      </button>
    </div>
  );
};
