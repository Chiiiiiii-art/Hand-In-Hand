import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { SimBadge } from '../../components/SimBadge';
import {
  ContributionModeId,
  TaskProposal
} from '../../types';
import {
  House,
  UsersThree,
  Compass,
  CheckCircle,
  GameController,
  PaintBrush,
  Package,
  ChatTeardropDots,
  WarningCircle,
  Sparkle,
  ArrowRight,
  HandWaving,
  Clock,
  ShieldCheck,
  CalendarCheck,
  Bookmarks,
  Heart,
  ChatCircleText,
  MapPin,
  Info
} from '@phosphor-icons/react';

export const BaseHome: React.FC = () => {
  const { state, dispatch } = useAppStore();

  // 當前登入參與者與所屬小組、基地世界
  const applicant = state.applications.find(a => a.id === state.currentParticipantId);
  const group = state.groups[0]; // 翠鳥一組
  const world = state.baseWorlds.find(w => w.groupId === group.id) || state.baseWorlds[0];
  const activeTask = state.coopTasks.find(t => t.groupId === group.id) || state.coopTasks[0];
  const helpRecord = state.helpRequests.find(h => h.applicantId === state.currentParticipantId);
  const nextPlan = state.nextPlanOptions;
  const offlineProp = state.offlineProposals[0];

  // 本地互動狀態
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [newPropTitle, setNewPropTitle] = useState('');
  const [newPropConcept, setNewPropConcept] = useState('');
  const [newPropAccess, setNewPropAccess] = useState('');

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpType, setHelpType] = useState<'換參與方式' | '操作卡關' | '需要小歇' | '其他支援'>('換參與方式');
  const [helpNote, setHelpNote] = useState('');

  const [reflectionText, setReflectionText] = useState('');

  if (!applicant) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <h2>未載入參與者身分</h2>
        <p style={{ color: 'var(--ink-secondary)' }}>請在頂部視角切換器選取參與者。</p>
      </div>
    );
  }

  // 提交新提案
  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle.trim()) return;
    dispatch({
      type: 'SUBMIT_PROPOSAL',
      taskId: activeTask.id,
      proposal: {
        taskId: activeTask.id,
        applicantId: applicant.id,
        authorNickname: applicant.nickname,
        title: newPropTitle,
        concept: newPropConcept || '小組討論補充',
        accessibilityFeature: newPropAccess || '無障礙通道與柔光標示',
      }
    });
    setNewPropTitle('');
    setNewPropConcept('');
    setNewPropAccess('');
    setShowProposalModal(false);
  };

  // 提交求助請求
  const handleHelpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SUBMIT_HELP_REQUEST',
      applicantId: applicant.id,
      sessionId: activeTask.sessionId,
      requestType: helpType,
      note: helpNote || '需要調整參與節奏或方式',
    });
    setHelpNote('');
    setShowHelpModal(false);
  };

  const getModeIcon = (id: ContributionModeId) => {
    switch (id) {
      case 'direct_build': return <GameController size={20} />;
      case 'design_choice': return <PaintBrush size={20} />;
      case 'resource_sort': return <Package size={20} />;
      case 'text_voice_coord': return <ChatTeardropDots size={20} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 1. 基地頂部看板 (FR-01: 小組基地首頁) */}
      <section
        className="card"
        aria-labelledby="base-world-title"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6EE 100%)',
          borderColor: 'var(--primary-border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 680 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="chip chip-info" style={{ fontWeight: 700 }}>
                {group.name}
              </span>
              <span className="chip chip-success">
                第 {activeTask.weekNumber} 週活動進行中
              </span>
              <SimBadge label="持續共同世界 (Minecraft Creative)" />
            </div>

            <h1
              id="base-world-title"
              style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: 800,
                color: 'var(--ink-primary)',
                lineHeight: 1.25,
                margin: '4px 0',
              }}
            >
              {world.worldName}
            </h1>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
              {world.worldTheme}。小組每次聚會均回到同一個共同家園，接續上週的建造與故事，不重置、不競爭、共同留下記憶。
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} color="var(--primary)" />
                <span>固定時段：{group.fixedTimeSlot}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="var(--primary)" />
                <span>引導主持：{group.hostName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Compass size={16} color="var(--primary)" />
                <span>伺服器：<code>{world.serverAddress}</code></span>
              </div>
            </div>
          </div>

          {/* 小組同伴卡片列表 */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: 'var(--space-4)',
              minWidth: 260,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <UsersThree size={18} color="var(--primary)" />
                <span>小組同伴 (4人固定組)</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>隱私保護無診斷</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {group.members.map((member) => {
                const memberApp = state.applications.find(a => a.id === member.applicantId);
                const isCurrent = member.applicantId === applicant.id;
                return (
                  <div
                    key={member.applicantId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCurrent ? 'var(--primary-subtle, #FFF8E7)' : 'var(--bg-sand-darker)',
                      border: isCurrent ? '1.5px solid var(--primary)' : '1px solid transparent',
                      fontSize: 'var(--text-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ color: 'var(--ink-primary)' }}>{member.nickname}</strong>
                      {isCurrent && <span className="chip chip-info" style={{ fontSize: '10px', padding: '1px 6px' }}>你</span>}
                    </div>
                    <span style={{ color: 'var(--ink-secondary)', fontSize: '11px' }}>
                      {memberApp?.currentContributionMode === 'direct_build' && '操作建造'}
                      {memberApp?.currentContributionMode === 'design_choice' && '設計投票'}
                      {memberApp?.currentContributionMode === 'resource_sort' && '建材整理'}
                      {memberApp?.currentContributionMode === 'text_voice_coord' && '討論協調'}
                      {!memberApp?.currentContributionMode && '線上就緒'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. 持續共同世界成果展 (FR-02) */}
      <section aria-labelledby="shared-world-history">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 id="shared-world-history" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              共同世界成果與未完成延續 (FR-02)
            </h2>
            <SimBadge label="成果屬於全組・無個人排名" />
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            跨週接續建設・記錄共同足跡
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {world.pastDeliverables.map((deliv) => (
            <div
              key={deliv.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 12,
                borderLeft: '4px solid var(--primary)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="chip chip-success" style={{ fontSize: '11px' }}>
                    第 {deliv.weekNumber} 週完工・{deliv.category}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                    {deliv.completedAt}
                  </span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: '4px 0 8px 0' }}>
                  {deliv.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                  {deliv.description}
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-sand-darker)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Sparkle size={16} color="var(--primary)" weight="fill" />
                <span><strong>協作亮點：</strong>{deliv.highlight}</span>
              </div>
            </div>
          ))}

          {/* 待延續清單卡片 */}
          <div
            className="card"
            style={{
              backgroundColor: '#FAF9F6',
              borderStyle: 'dashed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Bookmarks size={18} color="var(--primary)" weight="bold" />
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>待延續共同事項清單</h3>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
                {world.pendingTasksSummary.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', textAlign: 'right' }}>
              由全組共同決定推進次序
            </div>
          </div>
        </div>
      </section>

      {/* 3. 合作任務板 (FR-03 & FR-04 & FR-05 & FR-06) */}
      <section
        className="card"
        aria-labelledby="active-task-heading"
        style={{
          border: '2px solid var(--primary-border)',
          backgroundColor: '#FFFFFF',
          padding: 'var(--space-6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 'var(--space-4)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="chip chip-info" style={{ fontWeight: 700 }}>
                第 {activeTask.weekNumber} 週團隊任務
              </span>
              <span className="chip chip-success">{activeTask.status}</span>
              <SimBadge label="互惠任務・非單人清單" />
            </div>
            <h2 id="active-task-heading" style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>
              {activeTask.title}
            </h2>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-secondary)', marginTop: 4 }}>
              <strong>團隊目標：</strong>{activeTask.teamGoal}
            </p>
          </div>

          {/* 求助按鈕 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="btn-secondary"
              style={{
                fontSize: 'var(--text-sm)',
                minHeight: 40,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <WarningCircle size={18} color="#D9534F" weight="bold" />
              <span>遇到卡關／請求協助</span>
            </button>
          </div>
        </div>

        {/* 最近求助回饋狀態橫幅 (FR-06) */}
        {helpRecord && (
          <div
            style={{
              marginBottom: 'var(--space-6)',
              padding: '10px 16px',
              backgroundColor: helpRecord.status === '已由主持人支援' ? '#E8F5E9' : '#FFF3E0',
              borderLeft: helpRecord.status === '已由主持人支援' ? '4px solid #4CAF50' : '4px solid #FF9800',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <div>
              <strong>求助狀態【{helpRecord.requestType}】：</strong>
              <span>{helpRecord.note}</span>
              {helpRecord.hostReply && (
                <div style={{ marginTop: 4, color: '#2E7D32', fontWeight: 600 }}>
                  主持人回覆：{helpRecord.hostReply} ({helpRecord.handledAt})
                </div>
              )}
            </div>
            <span className="chip" style={{ fontSize: '10px' }}>
              {helpRecord.status}
            </span>
          </div>
        )}

        {/* FR-05: 多元貢獻方式自主切換器 */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>選擇你的參與貢獻方式 (FR-05)</span>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, color: 'var(--ink-secondary)' }}>
                （可自由切換，不固定角色，每種方式都具備實質影響）
              </span>
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 700 }}>
              目前選擇：{
                applicant.currentContributionMode === 'direct_build' ? '直接操作遊戲' :
                  applicant.currentContributionMode === 'design_choice' ? '提出或篩選設計方案' :
                    applicant.currentContributionMode === 'resource_sort' ? '建材與資源歸納' : '文字／語音討論協調'
              }
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-3)' }}>
            {activeTask.contributionOptions.map((opt) => {
              const isSelected = applicant.currentContributionMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => dispatch({ type: 'CHANGE_CONTRIBUTION_MODE', applicantId: applicant.id, mode: opt.id })}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-subtle, #FFF8E7)' : 'var(--surface)',
                    cursor: 'pointer',
                    gap: 6,
                    transition: 'all 0.15s ease',
                  }}
                  aria-pressed={isSelected}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: isSelected ? 'var(--primary)' : 'var(--ink-secondary)' }}>
                        {getModeIcon(opt.id)}
                      </span>
                      <strong style={{ fontSize: 'var(--text-sm)', color: isSelected ? 'var(--primary)' : 'var(--ink-primary)' }}>
                        {opt.title}
                      </strong>
                    </div>
                    {isSelected && <CheckCircle size={18} color="var(--primary)" weight="fill" />}
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', margin: '2px 0' }}>
                    {opt.shortDesc}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', opacity: 0.85, marginTop: 'auto' }}>
                    適應特點：{opt.inputDescription}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FR-04: 提案與小組投票（共同決策） */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
                入口設計提案與小組投票 (FR-04)
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
                小組成員各自提出構想，共同投票選定最終施作藍圖。最高票將更新為團隊決策。
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowProposalModal(true)}
              className="btn-primary"
              style={{ fontSize: 'var(--text-xs)', padding: '6px 12px', minHeight: 36 }}
            >
              <span>+ 提出我的設計想法</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {activeTask.proposals.map((prop) => {
              const isLeading = activeTask.activeProposalId === prop.id;
              const hasMyVote = prop.votes.includes(applicant.id);

              return (
                <div
                  key={prop.id}
                  style={{
                    backgroundColor: isLeading ? '#FFFDF8' : 'var(--bg-sand-darker)',
                    border: isLeading ? '2px solid var(--primary)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span className="chip" style={{ fontSize: '11px', backgroundColor: '#FFFFFF' }}>
                        提案者：{prop.authorNickname}
                      </span>
                      {isLeading && (
                        <span className="chip chip-success" style={{ fontSize: '11px' }}>
                          ★ 目前小組首選
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: '4px 0' }}>
                      {prop.title}
                    </h4>

                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                      {prop.concept}
                    </p>

                    <div
                      style={{
                        marginTop: 8,
                        padding: '6px 8px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        color: 'var(--ink-secondary)',
                      }}
                    >
                      <strong>友善亮點：</strong>{prop.accessibilityFeature}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
                      獲得 <strong>{prop.votes.length}</strong> 票支持
                      <span style={{ fontSize: '11px', marginLeft: 4 }}>
                        ({prop.votes.map(id => state.applications.find(a => a.id === id)?.nickname).filter(Boolean).join(', ') || '尚無票數'})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => dispatch({
                        type: 'VOTE_PROPOSAL',
                        taskId: activeTask.id,
                        proposalId: prop.id,
                        applicantId: applicant.id,
                      })}
                      style={{
                        padding: '4px 12px',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-full)',
                        border: hasMyVote ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: hasMyVote ? 'var(--primary)' : 'var(--surface)',
                        color: hasMyVote ? '#FFFFFF' : 'var(--ink-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {hasMyVote ? '已投票支持 ✓' : '投票支持'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 低壓力回顧與共同記憶 (FR-07, FR-08) */}
      <section className="card" aria-labelledby="reflection-title">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 id="reflection-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                活動成果摘要與低壓力回顧 (FR-07, FR-08)
              </h2>
              <SimBadge label="可自由略過・不強制分享" />
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginTop: 2 }}>
              關注「我們一起完成了什麼、哪位夥伴的想法被採用」，絕不進行個人友誼評分或排名。
            </p>
          </div>
        </div>

        {/* 共同成果摘要卡 */}
        <div
          style={{
            backgroundColor: 'var(--bg-sand-darker)',
            padding: 'var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 4 }}>
            本場共同決定成果：
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-primary)', lineHeight: 1.6 }}>
            {activeTask.completedSummary}
          </p>
        </div>

        {/* 可跳過的回顧題目 */}
        {state.reflections.map((q) => (
          <div
            key={q.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-4)',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-primary)' }}>
                {q.question}
              </strong>
              <span className="chip" style={{ fontSize: '10px' }}>
                類別：{q.category}（自由填寫）
              </span>
            </div>

            {/* 其他同伴回答 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              {q.answers.map((ans, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: ans.applicantId === applicant.id ? 'var(--primary-subtle, #FFF8E7)' : '#FAF9F6',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <strong>{ans.nickname}：</strong>
                  <span style={{ color: 'var(--ink-primary)' }}>{ans.text}</span>
                  <span style={{ fontSize: '10px', color: 'var(--ink-secondary)', marginLeft: 8 }}>
                    {ans.submittedAt}
                  </span>
                </div>
              ))}
            </div>

            {/* 我的回應欄 */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="寫下你的感想（可選填）..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                style={{ flex: 1, minHeight: 36, fontSize: 'var(--text-xs)', padding: '4px 10px' }}
              />
              <button
                type="button"
                onClick={() => {
                  if (reflectionText.trim()) {
                    dispatch({
                      type: 'SUBMIT_REFLECTION_ANSWER',
                      questionId: q.id,
                      applicantId: applicant.id,
                      text: reflectionText.trim(),
                    });
                    setReflectionText('');
                  }
                }}
                className="btn-primary"
                style={{ fontSize: 'var(--text-xs)', padding: '6px 12px', minHeight: 36 }}
              >
                分享感想
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 5. 接續下次計畫與自願線下探索 (FR-09 & FR-15) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* FR-09: 下次活動共同計畫 */}
        <section className="card" aria-labelledby="next-plan-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <CalendarCheck size={20} color="var(--primary)" />
            <h3 id="next-plan-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
              下次活動共同計畫 (FR-09)
            </h3>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginBottom: 12 }}>
            由成員投票選擇下一次聚會的共同建造目標，讓重聚有具體理由。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {nextPlan.map((opt) => {
              const hasVoted = opt.votes.includes(applicant.id);
              return (
                <div
                  key={opt.id}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: hasVoted ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: hasVoted ? 'var(--primary-subtle, #FFF8E7)' : 'var(--surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-primary)' }}>
                      {opt.targetTitle}
                    </strong>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'VOTE_NEXT_PLAN', optionId: opt.id, applicantId: applicant.id })}
                      style={{
                        padding: '2px 10px',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        background: hasVoted ? 'var(--primary)' : 'transparent',
                        color: hasVoted ? '#FFFFFF' : 'var(--ink-primary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {hasVoted ? '已支持 ✓' : '支持此項目'}
                    </button>
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', margin: 0 }}>
                    {opt.description}
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                    目前支持人數：<strong>{opt.votes.length}</strong> 位
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FR-15: 自願的線下／活動外探索提案 */}
        <section className="card" aria-labelledby="offline-explore-title" style={{ borderColor: 'var(--primary-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={20} color="var(--primary)" />
              <h3 id="offline-explore-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                其他共同活動探索 (FR-15)
              </h3>
            </div>
            <SimBadge label="自願意願・拒絕不受影響" />
          </div>

          <div
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FAF9F6',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <strong style={{ fontSize: 'var(--text-sm)' }}>
              {offlineProp.title}
            </strong>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', lineHeight: 1.5, margin: 0 }}>
              {offlineProp.description}
            </p>

            {/* 誠實待確認狀態標示 (PRD 3.4 嚴格要求) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', fontSize: '11px' }}>
              <div style={{ color: '#E65100' }}>• 交通：{offlineProp.transitStatus}</div>
              <div style={{ color: '#E65100' }}>• 可及性：{offlineProp.accessibilityStatus}</div>
              <div style={{ color: '#E65100' }}>• 費用：{offlineProp.feeStatus}</div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              我的意願選擇：<strong>{offlineProp.responses[applicant.id] || '尚未表態'}</strong>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {(['有興趣', '想先繼續線上活動', '暫不考慮'] as const).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => dispatch({
                    type: 'VOTE_OFFLINE_PROPOSAL',
                    proposalId: offlineProp.id,
                    applicantId: applicant.id,
                    choice
                  })}
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    borderRadius: 'var(--radius-full)',
                    border: offlineProp.responses[applicant.id] === choice ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: offlineProp.responses[applicant.id] === choice ? 'var(--primary)' : 'var(--surface)',
                    color: offlineProp.responses[applicant.id] === choice ? '#FFFFFF' : 'var(--ink-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 提案彈出 Modal */}
      {showProposalModal && (
        <div
          role="dialog"
          aria-labelledby="modal-prop-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 500,
              width: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-6)',
            }}
          >
            <h3 id="modal-prop-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 12 }}>
              提出你的基地入口設計想法
            </h3>
            <form onSubmit={handleCreateProposal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  提案名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：柔和暖光雙層拱門"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  建築構想與建材說明
                </label>
                <textarea
                  rows={3}
                  placeholder="說明你希望採用的材質、顏色或空間佈局..."
                  value={newPropConcept}
                  onChange={(e) => setNewPropConcept(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  無障礙或友善特色
                </label>
                <input
                  type="text"
                  placeholder="例如：寬敞平坦坡道、高對比夜光導引地燈"
                  value={newPropAccess}
                  onChange={(e) => setNewPropAccess(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  送出加入小組討論
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 求助彈出 Modal */}
      {showHelpModal && (
        <div
          role="dialog"
          aria-labelledby="modal-help-title"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 460,
              width: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              padding: 'var(--space-6)',
            }}
          >
            <h3 id="modal-help-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>
              遇到卡關或想調整參與方式？
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginBottom: 12 }}>
              主持人將即時在後台接收您的求助訊號，提供彈性切換或支援。不需公開說明個人醫療診斷。
            </p>

            <form onSubmit={handleHelpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  求助類型
                </label>
                <select
                  value={helpType}
                  onChange={(e) => setHelpType(e.target.value as any)}
                  style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
                >
                  <option value="換參與方式">換參與方式（例如：由操作改為設計投票/文字）</option>
                  <option value="操作卡關">操作卡關（鍵位失靈、方塊卡住、視角延遲）</option>
                  <option value="需要小歇">需要小歇（暫停 5-10 分鐘，稍後回歸）</option>
                  <option value="其他支援">其他支援（請主持人線上引導）</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  簡短說明（選填）
                </label>
                <input
                  type="text"
                  placeholder="例如：手部稍微疲累，想先純文字參與"
                  value={helpNote}
                  onChange={(e) => setHelpNote(e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: 'var(--text-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: 'var(--text-sm)' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: 'var(--text-sm)', backgroundColor: '#D9534F', borderColor: '#D9534F' }}
                >
                  發出求助訊號
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
