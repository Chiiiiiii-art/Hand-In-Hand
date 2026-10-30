import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { SCENARIO_STEPS_META } from '../seed';
import { ScenarioStepNumber } from '../types';
import {
  CaretLeft,
  CaretRight,
  ArrowsClockwise,
  CheckCircle,
  X,
  Sparkle,
  SlidersHorizontal,
  User,
  UsersThree,
  ShieldCheck,
  ListChecks,
  Compass,
  CheckSquare,
  ArrowSquareOut
} from '@phosphor-icons/react';

export const DemoConsole: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'scenario' | 'script'>('scenario');

  const currentStep = state.currentScenarioStep;
  const currentMeta = SCENARIO_STEPS_META.find(s => s.step === currentStep) || SCENARIO_STEPS_META[0];

  // 9 步驟切換處理
  const handleScenarioStepChange = (targetStep: ScenarioStepNumber) => {
    dispatch({ type: 'SET_SCENARIO_STEP', step: targetStep });
    const meta = SCENARIO_STEPS_META.find(s => s.step === targetStep);
    if (meta) {
      dispatch({ type: 'SET_ROLE', role: meta.targetRole });
      if (meta.targetRole === 'host') {
        navigate('/host/console');
      } else {
        navigate('/');
      }
    }
  };

  // 7 步展示劇本
  const scriptSteps = [
    { step: 1, title: '隊友線上預約', role: 'participant' as const, path: '/register', desc: '檢視客廳約定，填寫操作習慣與偏好' },
    { step: 2, title: '設備手感確認', role: 'admin' as const, path: '/admin/applications', desc: '審查申請，更新為可安排' },
    { step: 3, title: '組成固定小隊', role: 'admin' as const, path: '/admin/groups', desc: '將隊友指派至固定小隊' },
    { step: 4, title: '聚會指引與狀態', role: 'participant' as const, path: '/my-status', desc: '隊友查看聚會時程與連線步驟' },
    { step: 5, title: '安心求助處置', role: 'participant' as const, path: '/report-issue', desc: '隱私保護回報技術或人際困擾' },
    { step: 6, title: '悄悄話心得回饋', role: 'participant' as const, path: '/feedback', desc: '聚會後提交陪伴感受與自評' },
    { step: 7, title: '服務成效儀表板', role: 'admin' as const, path: '/admin/dashboard', desc: '檢視小組協作成效與統計指標' },
  ];

  return (
    <>
      {/* 浮動開啟按鈕（寬裕舒適、呼吸感足、不破壞正式產品外觀） */}
      <aside aria-label="展示與走查控制台" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1200 }}>
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            title="開啟展示走查輔助工具"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-lg)',
              padding: '12px 22px',
              fontSize: '14px',
              fontWeight: 700,
              minHeight: 48,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              border: '2px solid rgba(255,255,255,0.4)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <SlidersHorizontal size={20} weight="bold" />
            <span>展示導覽控制台</span>
            <span
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: 800,
              }}
            >
              第 {currentStep}/9 步
            </span>
          </button>
        ) : (
          <div
            style={{
              width: 440,
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 'calc(100vh - 60px)',
              backgroundColor: 'var(--surface)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 16px 36px rgba(25, 39, 45, 0.22)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* 控制台頂部 */}
            <div
              style={{
                padding: '14px 20px',
                backgroundColor: 'var(--bg-sand-darker)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <SlidersHorizontal size={22} color="var(--primary)" weight="bold" />
                <strong style={{ fontSize: '16px', color: 'var(--ink-primary)' }}>
                  展示導覽與走查輔助
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="收合展示導覽控制台"
                style={{
                  minHeight: 36,
                  padding: '6px 10px',
                  color: 'var(--ink-secondary)',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '13px',
                }}
              >
                <span>收合</span>
                <X size={18} />
              </button>
            </div>

            {/* 身分角色切換列（排版整齊、無擁擠壓迫） */}
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: '#FAF9F6',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-secondary)' }}>
                  展示操作視角切換：
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('確定要將示範資料還原為初始狀態嗎？')) {
                      dispatch({ type: 'RESET_DATA' });
                    }
                  }}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--ink-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    padding: '4px 10px',
                    minHeight: 32,
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--surface)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ArrowsClockwise size={14} />
                  <span>重置示範資料</span>
                </button>
              </div>

              {/* 三大角色切換按鈕（足夠寬度與高度擴張） */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_ROLE', role: 'participant' });
                    navigate('/');
                  }}
                  style={{
                    minHeight: 40,
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: state.currentRole === 'participant' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: state.currentRole === 'participant' ? 'var(--primary)' : 'var(--surface)',
                    color: state.currentRole === 'participant' ? '#FFFFFF' : 'var(--ink-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <User size={16} />
                  <span>參與者</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_ROLE', role: 'host' });
                    navigate('/host/console');
                  }}
                  style={{
                    minHeight: 40,
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: state.currentRole === 'host' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: state.currentRole === 'host' ? 'var(--primary)' : 'var(--surface)',
                    color: state.currentRole === 'host' ? '#FFFFFF' : 'var(--ink-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <UsersThree size={16} />
                  <span>引導主持</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: 'SET_ROLE', role: 'admin' });
                    navigate('/admin/dashboard');
                  }}
                  style={{
                    minHeight: 40,
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)',
                    border: state.currentRole === 'admin' ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: state.currentRole === 'admin' ? 'var(--primary)' : 'var(--surface)',
                    color: state.currentRole === 'admin' ? '#FFFFFF' : 'var(--ink-primary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>服務管理</span>
                </button>
              </div>

              {state.currentRole === 'participant' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px' }}>
                  <span style={{ color: 'var(--ink-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>切換隊友：</span>
                  <select
                    value={state.currentParticipantId}
                    onChange={(e) => dispatch({ type: 'SET_PARTICIPANT_ID', id: e.target.value })}
                    style={{
                      flex: 1,
                      minHeight: 36,
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--surface)',
                    }}
                  >
                    {state.applications.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.nickname} ({app.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* 劇本模式分頁切換按鈕 */}
            <div
              style={{
                display: 'flex',
                borderBottom: '2px solid var(--border)',
                backgroundColor: 'var(--surface)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('scenario')}
                style={{
                  flex: 1,
                  minHeight: 44,
                  fontSize: '14px',
                  fontWeight: 700,
                  borderBottom: activeTab === 'scenario' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'scenario' ? 'var(--primary)' : 'var(--ink-secondary)',
                  borderRadius: 0,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                9 步端到端情境走查
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('script')}
                style={{
                  flex: 1,
                  minHeight: 44,
                  fontSize: '14px',
                  fontWeight: 700,
                  borderBottom: activeTab === 'script' ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === 'script' ? 'var(--primary)' : 'var(--ink-secondary)',
                  borderRadius: 0,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                7 步功能驗收劇本
              </button>
            </div>

            {/* 內容區塊 */}
            <div style={{ padding: '16px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {activeTab === 'scenario' ? (
                <>
                  {/* 1-9 步圓形數字導航列：完全解決文字換行擁擠、破壞版面之問題 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink-secondary)' }}>
                        點選步驟快速跳轉：
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
                        {currentStep} / 9
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center' }}>
                      {SCENARIO_STEPS_META.map(meta => {
                        const isActive = meta.step === currentStep;
                        const isPast = meta.step < currentStep;
                        return (
                          <button
                            key={meta.step}
                            type="button"
                            onClick={() => handleScenarioStepChange(meta.step)}
                            title={`第 ${meta.step} 步：${meta.title}`}
                            aria-label={`第 ${meta.step} 步：${meta.title}`}
                            style={{
                              width: 36,
                              height: 36,
                              minHeight: 36,
                              borderRadius: '50%',
                              padding: 0,
                              border: isActive ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                              backgroundColor: isActive ? 'var(--primary)' : isPast ? '#E8F5E9' : 'var(--surface)',
                              color: isActive ? '#FFFFFF' : isPast ? 'var(--primary)' : 'var(--ink-secondary)',
                              fontWeight: 800,
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                            }}
                          >
                            {meta.step}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 當前步驟核心資訊卡 */}
                  <div
                    style={{
                      backgroundColor: 'var(--primary-light)',
                      border: '1.5px solid var(--primary-border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <strong style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>
                        第 {currentStep} 步：{currentMeta.title}
                      </strong>
                      <span className="chip chip-info" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        {currentMeta.targetRole === 'host' ? '主持人視角' : '參與者視角'}
                      </span>
                    </div>

                    <p style={{ margin: 0, color: 'var(--ink-primary)', fontSize: '13px', lineHeight: 1.6 }}>
                      {currentMeta.shortDesc}
                    </p>

                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        border: '1px solid var(--primary-border)',
                      }}
                    >
                      🎯 演示亮點：{currentMeta.actionHint}
                    </div>

                    {currentMeta.targetRole !== state.currentRole && (
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: 'SET_ROLE', role: currentMeta.targetRole });
                          if (currentMeta.targetRole === 'host') navigate('/host/console');
                          else navigate('/');
                        }}
                        className="btn-primary"
                        style={{
                          minHeight: 38,
                          padding: '6px 14px',
                          fontSize: '12px',
                          alignSelf: 'flex-start',
                          marginTop: 4,
                        }}
                      >
                        切換至建議之{currentMeta.targetRole === 'host' ? '主持人' : '參與者'}視角
                      </button>
                    )}
                  </div>

                  {/* 上一步 / 下一步 控制按鈕（大尺寸、舒適伸展） */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      disabled={currentStep === 1}
                      onClick={() => handleScenarioStepChange((currentStep - 1) as ScenarioStepNumber)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        minHeight: 44,
                        fontSize: '14px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <CaretLeft size={16} />
                      <span>上一步</span>
                    </button>
                    <button
                      type="button"
                      disabled={currentStep === 9}
                      onClick={() => handleScenarioStepChange((currentStep + 1) as ScenarioStepNumber)}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        minHeight: 44,
                        fontSize: '14px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>下一步</span>
                      <CaretRight size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', fontWeight: 600 }}>
                    點選任一劇本項目，自動切換至對應角色與目標頁面：
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {scriptSteps.map(st => {
                      const isCurrent = location.pathname === st.path && state.currentRole === st.role;
                      return (
                        <div
                          key={st.step}
                          onClick={() => {
                            dispatch({ type: 'SET_ROLE', role: st.role });
                            navigate(st.path);
                          }}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 'var(--radius-md)',
                            border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                            backgroundColor: isCurrent ? 'var(--primary-light)' : 'var(--surface)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '13px', color: isCurrent ? 'var(--primary)' : 'var(--ink-primary)' }}>
                              {st.step}. {st.title}
                            </strong>
                            <span className={`chip ${st.role === 'admin' ? 'chip-info' : 'chip-warning'}`} style={{ fontSize: '10px', padding: '1px 8px' }}>
                              {st.role === 'admin' ? '後台' : '前台'}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* 底部驗收清單捷徑 */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link
                  to="/acceptance"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: '12px',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 700,
                  }}
                >
                  <CheckSquare size={16} />
                  <span>檢視完整需求與驗收對照清單</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontSize: '12px',
                    color: 'var(--ink-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    minHeight: 'auto',
                  }}
                >
                  收合
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
