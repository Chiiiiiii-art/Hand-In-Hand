import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { RoleSwitch } from './RoleSwitch';
import { DemoGuide } from './DemoGuide';
import { SimBadge } from './SimBadge';
import {
  House,
  ClipboardText,
  UserCheck,
  CalendarCheck,
  WarningCircle,
  ChatTeardropDots,
  ChartBar,
  UsersThree,
  BookOpenText,
  CheckSquare
} from '@phosphor-icons/react';

export const Shell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state } = useAppStore();
  const location = useLocation();

  const isParticipant = state.currentRole === 'participant';

  const participantNav = [
    { label: '首頁', path: '/', icon: <House size={20} /> },
    { label: '報名參與', path: '/register', icon: <ClipboardText size={20} /> },
    { label: '我的狀態與活動', path: '/my-status', icon: <UserCheck size={20} /> },
    { label: '問題求助', path: '/report-issue', icon: <WarningCircle size={20} /> },
    { label: '活動回饋', path: '/feedback', icon: <ChatTeardropDots size={20} /> },
    { label: '守則與常見問答', path: '/rules', icon: <BookOpenText size={20} /> },
  ];

  const adminNav = [
    { label: '服務儀表板', path: '/admin/dashboard', icon: <ChartBar size={20} /> },
    { label: '申請審查與確認', path: '/admin/applications', icon: <ClipboardText size={20} /> },
    { label: '固定小組管理', path: '/admin/groups', icon: <UsersThree size={20} /> },
    { label: '場次排程與出席', path: '/admin/sessions', icon: <CalendarCheck size={20} /> },
    { label: '事件處理紀錄', path: '/admin/issues', icon: <WarningCircle size={20} /> },
    { label: '後續追蹤管理', path: '/admin/follow-up', icon: <UserCheck size={20} /> },
    { label: '需求驗收清單', path: '/acceptance', icon: <CheckSquare size={20} /> },
  ];

  const currentNav = isParticipant ? participantNav : adminNav;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 頂部跳過導航 (無障礙) */}
      <a href="#main-content" className="skip-link">跳至主要內容區塊</a>

      {/* 頂部全域導航列 */}
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: 'var(--surface)',
          borderBottom: '2px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'var(--header-height)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
          }}
        >
          {/* Logo 與產品名稱 */}
          <Link
            to={isParticipant ? '/' : '/admin/dashboard'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              textDecoration: 'none',
              color: 'var(--ink-primary)',
            }}
          >
            <img src="/logo.svg" alt="" width="36" height="36" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', lineHeight: 1.2 }}>
                攜手基地
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
                線上同儕活動服務 (PoC)
              </div>
            </div>
          </Link>

          {/* 角色切換器與展示標籤 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <SimBadge label="展示原型模式" />
            <RoleSwitch />
          </div>
        </div>

        {/* 次導航列（分頁項目） */}
        <nav
          role="navigation"
          aria-label={isParticipant ? '參與者功能導覽' : '管理者功能導覽'}
          style={{
            backgroundColor: 'var(--bg-sand-darker)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              gap: 'var(--space-1)',
              overflowX: 'auto',
              padding: '6px var(--space-4)',
            }}
          >
            {currentNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: isActive ? '#FFFFFF' : 'var(--ink-primary)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Toast 訊息浮條 */}
      {state.toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--ink-primary)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 2000,
            fontSize: 'var(--text-base)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>{state.toastMessage}</span>
        </div>
      )}

      {/* 主要內容區 */}
      <main id="main-content" tabIndex={-1} style={{ flex: 1, padding: 'var(--space-6) 0 var(--space-16) 0' }}>
        <div className="container">
          {children}
        </div>
      </main>

      {/* PRD 7 步導覽抽屜 */}
      <DemoGuide />

      {/* 頁尾誠實呈現對照與無障礙聲明 */}
      <footer
        role="contentinfo"
        style={{
          backgroundColor: 'var(--surface)',
          borderTop: '2px solid var(--border)',
          padding: 'var(--space-8) 0',
          marginTop: 'auto',
        }}
      >
        <div className="container" style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <strong>攜手基地 — 線上同儕活動服務系統 (UI PoC)</strong>
              <p style={{ marginTop: 4 }}>
                專為年滿 18 歲、移動限制影響實體社交參與機會之成人設計。
              </p>
            </div>
            <div>
              <Link to="/acceptance" style={{ marginRight: 16 }}>
                PRD 需求對照驗收清單 (FR-01 ~ FR-16)
              </Link>
              <Link to="/rules">
                社群安全守則與服務條款
              </Link>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <SimBadge label="誠實呈現聲明 (PRD NFR)" />
            <span>
              本原型僅用於服務流程驗證與提案展示。所有第三方遊戲連線、通知發送及統計數值均為本機模擬狀態，未串接真實醫療診斷或遊戲伺服器。
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
