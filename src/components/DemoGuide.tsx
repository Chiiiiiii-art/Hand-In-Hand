import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import {
  ListChecks,
  CaretRight,
  CaretLeft,
  CheckCircle,
  X,
  Sparkle
} from '@phosphor-icons/react';

interface ScriptStep {
  stepNumber: number;
  title: string;
  role: 'participant' | 'admin';
  targetPath: string;
  description: string;
  passCondition: string;
  isCompleted: (state: ReturnType<typeof useAppStore>['state']) => boolean;
}

export const DemoGuide: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 7 步展示劇本（對應 PRD 10.1 節）
  const steps: ScriptStep[] = [
    {
      stepNumber: 1,
      title: '1. 隊友線上預約',
      role: 'participant',
      targetPath: '/register',
      description: '檢視客廳約定，填寫可用時段與操作習慣後送出。',
      passCondition: '送出後看到確認畫面，後台管理出現該筆預約。',
      isCompleted: (st) => st.applications.length > 7 || st.applications.some(a => a.nickname === '小禾'),
    },
    {
      stepNumber: 2,
      title: '2. 設備與手感確認',
      role: 'admin',
      targetPath: '/admin/applications',
      description: '審查申請之操作與溝通需求，更新為「可安排」。',
      passCondition: '申請狀態由「待確認」更新為「可安排」。',
      isCompleted: (st) => st.applications.some(a => a.status === '可安排' || a.status === '已入組'),
    },
    {
      stepNumber: 3,
      title: '3. 組成固定小隊',
      role: 'admin',
      targetPath: '/admin/groups',
      description: '將隊友指派至固定小隊，生成聚會排程。',
      passCondition: '成員標示為已入組，可見所屬小隊與聚會。',
      isCompleted: (st) => st.groups.some(g => g.members.length > 0),
    },
    {
      stepNumber: 4,
      title: '4. 聚會任務與連線指引',
      role: 'participant',
      targetPath: '/my-status',
      description: '隊友查看小隊聚會時間、任務目標與連線加入指引。',
      passCondition: '可看到時間、加入步驟、備援聯絡與求助管道。',
      isCompleted: (st) => st.sessions.some(s => s.status === '已發布'),
    },
    {
      stepNumber: 5,
      title: '5. 安心求助與排除',
      role: 'participant',
      targetPath: '/report-issue',
      description: '隊友私訊技術或人際不適問題，完全保密不公開個資。',
      passCondition: '隊友看到已送出，後台顯示新求助並可記錄後續處置。',
      isCompleted: (st) => st.issues.length >= 3,
    },
    {
      stepNumber: 6,
      title: '6. 聚會悄悄話與出席',
      role: 'participant',
      targetPath: '/feedback',
      description: '聚會後提交陪伴感受與協作心情；後台登錄出席。',
      passCondition: '出席與悄悄話紀錄同步反映於後台儀表板。',
      isCompleted: (st) => st.feedbacks.length >= 3,
    },
    {
      stepNumber: 7,
      title: '7. 8 週畢業成果與摘要',
      role: 'admin',
      targetPath: '/admin/dashboard',
      description: '檢視 8 週成果儀表板，確認聯繫意願與未回覆分開口徑。',
      passCondition: '儀表板各項指標與模擬紀錄口徑一致且標示模擬。',
      isCompleted: (st) => st.followUps.some(f => f.status === '追蹤已完成'),
    }
  ];

  if (!state.isDemoGuideOpen) {
    return (
      <button
        type="button"
        onClick={() => dispatch({ type: 'TOGGLE_DEMO_GUIDE' })}
        aria-label="打開展示劇本導覽"
        style={{
          position: 'fixed',
          right: 20,
          bottom: 24,
          zIndex: 1000,
          backgroundColor: 'var(--primary)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-lg)',
          padding: '12px 20px',
        }}
      >
        <ListChecks size={22} weight="bold" aria-hidden="true" />
        <span>展示劇本導覽 (PRD 7 步)</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="PRD 10.1 展示劇本導覽"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 360,
        maxHeight: 'calc(100vh - 100px)',
        backgroundColor: 'var(--surface)',
        border: '2px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--bg-sand-darker)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ListChecks size={20} color="var(--primary)" weight="bold" />
          <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>PRD 7 步展示劇本</span>
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_DEMO_GUIDE' })}
          aria-label="關閉展示導覽"
          style={{ minHeight: 32, padding: 4 }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', background: 'var(--primary-light)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
          <Sparkle size={14} style={{ verticalAlign: -2, marginRight: 4 }} />
          點擊任一步驟即可<strong>自動切換角色並跳轉至該畫面</strong>。
        </div>

        {steps.map((step) => {
          const completed = step.isCompleted(state);
          const isCurrent = location.pathname === step.targetPath && state.currentRole === step.role;

          return (
            <div
              key={step.stepNumber}
              onClick={() => {
                dispatch({ type: 'SET_ROLE', role: step.role });
                navigate(step.targetPath);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  dispatch({ type: 'SET_ROLE', role: step.role });
                  navigate(step.targetPath);
                }
              }}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: isCurrent ? 'var(--primary-light)' : 'var(--surface)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: isCurrent ? 'var(--primary)' : 'var(--ink-primary)' }}>
                  {step.title}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 'var(--text-xs)' }}>
                  <span className={`chip ${step.role === 'admin' ? 'chip-info' : 'chip-warning'}`} style={{ padding: '1px 6px', fontSize: 11 }}>
                    {step.role === 'admin' ? '後台' : '前台'}
                  </span>
                  {completed ? (
                    <span title="通過條件已滿足" style={{ display: 'inline-flex' }}>
                      <CheckCircle size={16} weight="fill" color="var(--primary)" />
                    </span>
                  ) : (
                    <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--ink-muted)', display: 'inline-block' }} />
                  )}
                </span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', margin: '2px 0' }}>
                {step.description}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', borderTop: '1px dashed var(--border)', paddingTop: 4, marginTop: 4 }}>
                <strong>驗收依據：</strong>{step.passCondition}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
