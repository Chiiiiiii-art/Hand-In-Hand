import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { RoleSwitch } from './RoleSwitch';
import { SimBadge } from './SimBadge';
import { ScenarioStepper } from './ScenarioStepper';
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
  CheckSquare,
  GameController,
  SlidersHorizontal,
  Compass
} from '@phosphor-icons/react';

export const Shell: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state } = useAppStore();
  const location = useLocation();

  const participantNav = [
    { label: '我的小組基地', path: '/', icon: <House size={18} /> },
    { label: '偏好設定與狀態', path: '/my-status', icon: <UserCheck size={18} /> },
    { label: '問題求助', path: '/report-issue', icon: <WarningCircle size={18} /> },
    { label: '活動回饋', path: '/feedback', icon: <ChatTeardropDots size={18} /> },
    { label: '參與守則', path: '/rules', icon: <BookOpenText size={18} /> },
    { label: '服務報名', path: '/register', icon: <ClipboardText size={18} /> },
  ];

  const hostNav = [
    { label: '活動即時控制台', path: '/host/console', icon: <SlidersHorizontal size={18} /> },
    { label: '任務範本編排器', path: '/host/tasks', icon: <GameController size={18} /> },
    { label: '小組基地前台', path: '/', icon: <House size={18} /> },
    { label: '需求驗收清單', path: '/acceptance', icon: <CheckSquare size={18} /> },
  ];

  const adminNav = [
    { label: '服務儀表板', path: '/admin/dashboard', icon: <ChartBar size={18} /> },
    { label: '固定小組管理', path: '/admin/groups', icon: <UsersThree size={18} /> },
    { label: '場次排程', path: '/admin/sessions', icon: <CalendarCheck size={18} /> },
    { label: '申請審查', path: '/admin/applications', icon: <ClipboardText size={18} /> },
    { label: '安全事件處理', path: '/admin/issues', icon: <WarningCircle size={18} /> },
    { label: '需求驗收清單', path: '/acceptance', icon: <CheckSquare size={18} /> },
  ];

  let currentNav = participantNav;
  let roleAriaLabel = '參與者功能導覽';
  if (state.currentRole === 'host') {
    currentNav = hostNav;
    roleAriaLabel = '主持人功能導覽';
  } else if (state.currentRole === 'admin') {
    currentNav = adminNav;
    roleAriaLabel = '服務管理者功能導覽';
  }

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
            minHeight: 'var(--header-height)',
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            padding: '8px var(--space-4)',
          }}
        >
          {/* Logo 與產品名稱 */}
          <Link
            to={state.currentRole === 'admin' ? '/admin/dashboard' : state.currentRole === 'host' ? '/host/console' : '/'}
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
                友誼支持系統 (PRD v2.0 PoC)
              </div>
            </div>
          </Link>

          {/* 角色切換器與展示標籤 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <SimBadge label="v2.0 友誼支持原型" />
            <RoleSwitch />
          </div>
        </div>

        {/* PRD 第 9 節情境導覽浮條 */}
        <ScenarioStepper />

        {/* 次導航列（分頁項目） */}
        <nav
          role="navigation"
          aria-label={roleAriaLabel}
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
              <strong>攜手基地 — 線上遊戲友誼支持系統 (PRD v2.0 UI PoC)</strong>
              <p style={{ marginTop: 4 }}>
                以既有多人線上沙盒遊戲為媒介，支持成年行動障礙者從反覆相遇逐步發展同儕友誼。
              </p>
            </div>
            <div>
              <Link to="/acceptance" style={{ marginRight: 16, fontWeight: 600 }}>
                PRD v2.0 需求與驗收對照清單 (FR-01 ~ FR-18)
              </Link>
              <Link to="/rules">
                社群安全守則與服務條款
              </Link>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <SimBadge label="PRD 誠實呈現聲明" />
            <span>
              本原型為服務互動 PoC。所有第三方遊戲連線、伺服器同步、通知發送及統計數值均為本機示範資料，未串接真實醫療診斷或遊戲伺服器。絕不對個人進行友誼分數排名。
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
