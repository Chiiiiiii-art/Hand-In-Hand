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
  Info,
  ListDashes,
  Target,
  UserCheck
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

  // 專注分頁模式：減少單頁認知負荷，讓參與者依活動進程聚焦目前步驟
  const [activeTab, setActiveTab] = useState<'task' | 'world' | 'reflect' | 'all'>('task');

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
        <p style={{ color: 'var(--ink-secondary)', marginTop: 8 }}>請在頂部視角切換器選取參與者。</p>
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
      case 'direct_build': return <GameController size={24} />;
      case 'design_choice': return <PaintBrush size={24} />;
      case 'resource_sort': return <Package size={24} />;
      case 'text_voice_coord': return <ChatTeardropDots size={24} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 1. 基地頂部看板：舒展、留白充足的小組家園歡迎區 */}
      <section
        className="card"
        aria-labelledby="base-world-title"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6EE 100%)',
          borderColor: 'var(--primary-border)',
          borderRadius: '20px',
          padding: '32px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 800 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="chip chip-info" style={{ fontWeight: 800, padding: '4px 14px', fontSize: '13px' }}>
                {group.name}
              </span>
              <span className="chip chip-success" style={{ fontWeight: 700, padding: '4px 14px', fontSize: '13px' }}>
                第 {activeTask.weekNumber} 週活動進行中
              </span>
              <SimBadge label="持續共同世界 (Minecraft Creative)" />
            </div>

            <h1
              id="base-world-title"
              style={{
                fontSize: '2.25rem',
                fontWeight: 800,
                color: 'var(--ink-primary)',
                lineHeight: 1.25,
                margin: '4px 0',
              }}
            >
              {world.worldName}
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--ink-secondary)', lineHeight: 1.7 }}>
              {world.worldTheme}。每次聚會我們都回到同一個共同家園，接續上週的建造與記憶。不比手速、不競爭排名、彼此陪伴一同成長。
            </p>

            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '14px', color: 'var(--ink-secondary)', marginTop: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color="var(--primary)" weight="bold" />
                <span>固定時段：<strong>{group.fixedTimeSlot}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="var(--primary)" weight="bold" />
                <span>引導主持：<strong>{group.hostName}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Compass size={18} color="var(--primary)" weight="bold" />
                <span>伺服器位址：<code>{world.serverAddress}</code></span>
              </div>
            </div>
          </div>
        </div>

        {/* 小組同伴水平緞帶（舒展大方，告別擠在側邊的擁擠感） */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '14px', fontWeight: 700, color: 'var(--ink-primary)' }}>
            <UsersThree size={20} color="var(--primary)" weight="bold" />
            <span>本小隊固定夥伴：</span>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {group.members.map((member) => {
              const memberApp = state.applications.find(a => a.id === member.applicantId);
              const isCurrent = member.applicantId === applicant.id;
              return (
                <div
                  key={member.applicantId}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isCurrent ? 'var(--primary-subtle, #FFF8E7)' : 'var(--surface)',
                    border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                    fontSize: '13px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: isCurrent ? 'var(--primary)' : '#4B5563',
                      color: '#FFFFFF',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    {member.nickname[0]}
                  </span>
                  <strong style={{ color: isCurrent ? 'var(--primary)' : 'var(--ink-primary)' }}>
                    {member.nickname} {isCurrent && '（你）'}
                  </strong>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      color: '#15803D',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: '#DCFCE7',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    ● 線上
                  </span>
                  <span style={{ color: 'var(--ink-muted)', fontSize: '12px' }}>
                    {memberApp?.currentContributionMode === 'direct_build' && '• 空間建造'}
                    {memberApp?.currentContributionMode === 'resource_sort' && '• 景觀配置'}
                    {memberApp?.currentContributionMode === 'design_choice' && '• 設計規劃'}
                    {memberApp?.currentContributionMode === 'text_voice_coord' && '• 導覽敘事'}
                    {!memberApp?.currentContributionMode && '• 線上就緒'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. 減少單頁認知負荷：四大清晰分頁標籤（大尺寸按鈕、文字完全舒展） */}
      <nav
        aria-label="基地功能分頁導覽"
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('task')}
          aria-current={activeTab === 'task' ? 'page' : undefined}
          style={{
            minHeight: 50,
            padding: '12px 26px',
            fontSize: '16px',
            fontWeight: 800,
            borderRadius: 'var(--radius-full)',
            border: activeTab === 'task' ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
            backgroundColor: activeTab === 'task' ? 'var(--primary)' : 'var(--surface)',
            color: activeTab === 'task' ? '#FFFFFF' : 'var(--ink-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            whiteSpace: 'nowrap',
            boxShadow: activeTab === 'task' ? 'var(--shadow-md)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Target size={22} weight={activeTab === 'task' ? 'bold' : 'regular'} />
          <span>今日聚會與任務</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('world')}
          aria-current={activeTab === 'world' ? 'page' : undefined}
          style={{
            minHeight: 50,
            padding: '12px 26px',
            fontSize: '16px',
            fontWeight: 800,
            borderRadius: 'var(--radius-full)',
            border: activeTab === 'world' ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
            backgroundColor: activeTab === 'world' ? 'var(--primary)' : 'var(--surface)',
            color: activeTab === 'world' ? '#FFFFFF' : 'var(--ink-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            whiteSpace: 'nowrap',
            boxShadow: activeTab === 'world' ? 'var(--shadow-md)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <House size={22} weight={activeTab === 'world' ? 'bold' : 'regular'} />
          <span>共同家園成果</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reflect')}
          aria-current={activeTab === 'reflect' ? 'page' : undefined}
          style={{
            minHeight: 50,
            padding: '12px 26px',
            fontSize: '16px',
            fontWeight: 800,
            borderRadius: 'var(--radius-full)',
            border: activeTab === 'reflect' ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
            backgroundColor: activeTab === 'reflect' ? 'var(--primary)' : 'var(--surface)',
            color: activeTab === 'reflect' ? '#FFFFFF' : 'var(--ink-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            whiteSpace: 'nowrap',
            boxShadow: activeTab === 'reflect' ? 'var(--shadow-md)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <ChatCircleText size={22} weight={activeTab === 'reflect' ? 'bold' : 'regular'} />
          <span>交流分享與接續</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          aria-current={activeTab === 'all' ? 'page' : undefined}
          style={{
            marginLeft: 'auto',
            minHeight: 44,
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid var(--border)',
            backgroundColor: activeTab === 'all' ? 'var(--ink-primary)' : 'var(--surface)',
            color: activeTab === 'all' ? '#FFFFFF' : 'var(--ink-secondary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          <ListDashes size={18} />
          <span>{activeTab === 'all' ? '已展開全部內容' : '展開全部內容瀏覽'}</span>
        </button>
      </nav>

      {/* 區塊 1：今日聚會與合作任務 (Tab: 'task' 或 'all') */}
      {(activeTab === 'task' || activeTab === 'all') && (
        <section
          className="card"
          aria-labelledby="active-task-heading"
          style={{
            border: '2px solid var(--primary-border)',
            backgroundColor: '#FFFFFF',
            padding: '32px 36px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {/* 任務標題與求助按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 760 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="chip chip-info" style={{ fontWeight: 800, padding: '4px 14px', fontSize: '13px' }}>
                  第 {activeTask.weekNumber} 週團隊目標
                </span>
                <span className="chip chip-success" style={{ fontWeight: 700, padding: '4px 14px', fontSize: '13px' }}>
                  {activeTask.status}
                </span>
                <SimBadge label="互惠任務・非單人競爭" />
              </div>
              <h2 id="active-task-heading" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--ink-primary)', marginTop: 4 }}>
                {activeTask.title}
              </h2>
              <div style={{ backgroundColor: 'var(--bg-sand-darker)', padding: '16px 20px', borderRadius: '12px', marginTop: 4 }}>
                <strong style={{ fontSize: '15px', color: 'var(--primary)' }}>團隊共同目標：</strong>
                <p style={{ fontSize: '16px', color: 'var(--ink-primary)', margin: '4px 0 0 0', lineHeight: 1.6 }}>
                  {activeTask.teamGoal}
                </p>
              </div>
            </div>

            {/* 求助按鈕（大尺寸、舒適大方） */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              style={{
                fontSize: '15px',
                fontWeight: 700,
                minHeight: 48,
                padding: '12px 24px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                borderRadius: 'var(--radius-full)',
                border: '2px solid #D9534F',
                backgroundColor: '#FFF8F8',
                color: '#D9534F',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <WarningCircle size={22} color="#D9534F" weight="bold" />
              <span>遇到卡關／請求協助</span>
            </button>
          </div>

          {/* 最近求助回饋狀態橫幅 */}
          {helpRecord && (
            <div
              style={{
                padding: '16px 20px',
                backgroundColor: helpRecord.status === '已由主持人支援' ? '#E8F5E9' : '#FFF3E0',
                borderLeft: helpRecord.status === '已由主持人支援' ? '5px solid #4CAF50' : '5px solid #FF9800',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <strong>求助狀態【{helpRecord.requestType}】：</strong>
                <span>{helpRecord.note}</span>
                {helpRecord.hostReply && (
                  <div style={{ marginTop: 6, color: '#2E7D32', fontWeight: 700 }}>
                    主持人回覆：{helpRecord.hostReply} ({helpRecord.handledAt})
                  </div>
                )}
              </div>
              <span className="chip" style={{ fontSize: '12px', padding: '4px 12px' }}>
                {helpRecord.status}
              </span>
            </div>
          )}

          {/* 多元貢獻方式自主切換器：使用 card-button 模式，呼吸感足 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-primary)' }}>
                  選擇你的參與貢獻方式
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginTop: 2 }}>
                  可自由切換，不依障礙分類固定角色。每一種方式都為小隊帶來不可或缺的價值。
                </p>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 800 }}>
                目前選擇：{
                  applicant.currentContributionMode === 'direct_build' ? '空間建造（放置方塊與實體搭建）' :
                    applicant.currentContributionMode === 'resource_sort' ? '景觀配置（植栽、照明與風格色彩）' :
                      applicant.currentContributionMode === 'design_choice' ? '設計規劃（動線配置與格局提案）' : '導覽敘事（空間命名、導覽標示與基地故事）'
                }
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
              {activeTask.contributionOptions.map((opt) => {
                const isSelected = applicant.currentContributionMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className="card-button"
                    onClick={() => dispatch({ type: 'CHANGE_CONTRIBUTION_MODE', applicantId: applicant.id, mode: opt.id })}
                    style={{
                      border: isSelected ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--primary-subtle, #FFF8E7)' : 'var(--surface)',
                      cursor: 'pointer',
                      gap: 10,
                      transition: 'all 0.15s ease',
                      minHeight: 160,
                      padding: '24px 22px',
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    }}
                    aria-pressed={isSelected}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: isSelected ? 'var(--primary)' : 'var(--ink-secondary)' }}>
                          {getModeIcon(opt.id)}
                        </span>
                        <strong style={{ fontSize: '16px', color: isSelected ? 'var(--primary)' : 'var(--ink-primary)' }}>
                          {opt.title}
                        </strong>
                      </div>
                      {isSelected && <CheckCircle size={22} color="var(--primary)" weight="fill" />}
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', margin: '4px 0', lineHeight: 1.6 }}>
                      {opt.shortDesc}
                    </p>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--ink-primary)',
                        backgroundColor: '#FFFFFF',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        marginTop: 'auto',
                      }}
                    >
                      操作特色：{opt.inputDescription}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 提案與小組投票（共同決策） */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  設計提案與小組投票
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginTop: 2 }}>
                  小組成員各自提出構想，共同投票選定最終施作藍圖。最高票將更新為團隊決策。
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowProposalModal(true)}
                className="btn-primary"
                style={{ fontSize: '14px', fontWeight: 700, padding: '12px 24px', minHeight: 46, borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
              >
                <span>+ 提出我的設計想法</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {activeTask.proposals.map((prop) => {
                const isLeading = activeTask.activeProposalId === prop.id;
                const hasMyVote = prop.votes.includes(applicant.id);

                return (
                  <div
                    key={prop.id}
                    style={{
                      backgroundColor: isLeading ? '#FFFDF8' : 'var(--surface)',
                      border: isLeading ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                      borderRadius: '16px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 14,
                      boxShadow: isLeading ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span className="chip" style={{ fontSize: '12px', padding: '3px 10px', backgroundColor: 'var(--bg-sand-darker)' }}>
                          提案夥伴：{prop.authorNickname}
                        </span>
                        {isLeading && (
                          <span className="chip chip-success" style={{ fontSize: '12px', padding: '3px 10px', fontWeight: 700 }}>
                            ★ 目前小組首選
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: '18px', fontWeight: 800, margin: '6px 0' }}>
                        {prop.title}
                      </h4>

                      <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                        {prop.concept}
                      </p>

                      <div
                        style={{
                          marginTop: 10,
                          padding: '8px 12px',
                          backgroundColor: 'var(--bg-sand-darker)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: 'var(--ink-secondary)',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>友善特色：</strong>{prop.accessibilityFeature}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                        獲得 <strong>{prop.votes.length}</strong> 票支持
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
                          minHeight: 42,
                          padding: '8px 22px',
                          fontSize: '13px',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-full)',
                          border: hasMyVote ? '2px solid var(--primary)' : '1.5px solid var(--primary)',
                          backgroundColor: hasMyVote ? 'var(--primary)' : 'var(--surface)',
                          color: hasMyVote ? '#FFFFFF' : 'var(--primary)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          boxShadow: 'var(--shadow-sm)',
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
      )}

      {/* 區塊 2：持續共同世界成果展與待延續清單 (Tab: 'world' 或 'all') */}
      {(activeTab === 'world' || activeTab === 'all') && (
        <section aria-labelledby="shared-world-history" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 id="shared-world-history" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                共同世界成果與延續進程
              </h2>
              <SimBadge label="成果屬於全組・無個人排名" />
            </div>
            <span style={{ fontSize: '14px', color: 'var(--ink-secondary)' }}>
              跨週接續建設・記錄共同足跡
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
            {world.pastDeliverables.map((deliv) => (
              <div
                key={deliv.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 16,
                  borderLeft: '5px solid var(--primary)',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span className="chip chip-success" style={{ fontSize: '12px', padding: '3px 10px', fontWeight: 700 }}>
                      第 {deliv.weekNumber} 週完工・{deliv.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                      {deliv.completedAt}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '6px 0 10px 0' }}>
                    {deliv.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                    {deliv.description}
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-sand-darker)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: 'var(--ink-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Sparkle size={18} color="var(--primary)" weight="fill" />
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
                borderWidth: '2px',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Bookmarks size={22} color="var(--primary)" weight="bold" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800 }}>待延續共同事項清單</h3>
                </div>
                <ul style={{ paddingLeft: 20, fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 2.0 }}>
                  {world.pendingTasksSummary.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)', textAlign: 'right' }}>
                由全組每週聚會共同決定推進次序
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 區塊 3：心得交流、下次計畫與延伸探索 (Tab: 'reflect' 或 'all') */}
      {(activeTab === 'reflect' || activeTab === 'all') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* 低壓力回顧與共同記憶 */}
          <section className="card" aria-labelledby="reflection-title" style={{ padding: '32px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h2 id="reflection-title" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    本週聚會心得與成果
                  </h2>
                  <SimBadge label="可自由略過・不強制分享" />
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginTop: 4 }}>
                  關注「我們一起完成了什麼、哪位夥伴的想法被採用」，絕不進行個人社交排名或評分。
                </p>
              </div>
            </div>

            {/* 成就照片紀錄與金句回顧橫幅 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 16,
                marginBottom: 20,
              }}
            >
              {/* 成就照片紀錄 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '15px', color: 'var(--ink-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    📸 成就照片紀錄（第 3 週完工留念）
                  </strong>
                  <span className="chip chip-success" style={{ fontSize: '11px', padding: '2px 8px' }}>
                    已存入基地記憶庫
                  </span>
                </div>

                {/* 模擬遊戲截圖卡 */}
                <div
                  style={{
                    height: 140,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 8,
                    padding: 16,
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div style={{ fontSize: '28px' }}>🏛️ 🌿 ✨</div>
                  <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: 0.5 }}>
                    【中世紀石磚門樓與全隊合影】
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    常青樹小隊全員 4 人共同協作落成・夜行螢石導引全面點亮
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="chip" style={{ fontSize: '11px' }}>#無障礙迎賓入口</span>
                  <span className="chip" style={{ fontSize: '11px' }}>#共同決策成果</span>
                  <span className="chip" style={{ fontSize: '11px' }}>#零社交壓力</span>
                </div>
              </div>

              {/* 金句回顧與一鍵心情反饋 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* 金句回顧 */}
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--ink-primary)', display: 'block', marginBottom: 8 }}>
                    💬 本週小隊金句回顧
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ backgroundColor: 'var(--bg-sand-darker)', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', lineHeight: 1.5, borderLeft: '4px solid var(--primary)' }}>
                      <strong>小禾：</strong>「原本擔心石磚拱門太陡，阿木建議拉長引道，輪椅也能平順通行！」
                    </div>
                    <div style={{ backgroundColor: 'var(--bg-sand-darker)', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', lineHeight: 1.5, borderLeft: '4px solid #10B981' }}>
                      <strong>阿木：</strong>「海風掛的花架超搭，大家一起蓋的真的比一個人厲害！」
                    </div>
                  </div>
                </div>

                {/* 一鍵心情反饋 */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink-primary)', marginBottom: 8 }}>
                    ✨ 一鍵心情反饋（無評分負擔・全體累積）：
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '2px solid var(--primary)',
                        backgroundColor: 'var(--primary-subtle, #FFF8E7)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      😄 很有成就感 (4) ✓
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--ink-secondary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      🥰 感到被支持 (4)
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--ink-secondary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      😌 節奏很放鬆 (3)
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--ink-secondary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      🌿 期待下次再聚 (4)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 共同成果摘要卡 */}
            <div
              style={{
                backgroundColor: 'var(--bg-sand-darker)',
                padding: '20px 24px',
                borderRadius: '16px',
                borderLeft: '5px solid var(--primary)',
                marginBottom: 20,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: 4, color: 'var(--primary)' }}>
                本場共同決定成果：
              </div>
              <p style={{ fontSize: '15px', color: 'var(--ink-primary)', lineHeight: 1.7, margin: 0 }}>
                {activeTask.completedSummary}
              </p>
            </div>

            {/* 可跳過的回顧題目 */}
            {state.reflections.map((q) => (
              <div
                key={q.id}
                style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ fontSize: '16px', color: 'var(--ink-primary)' }}>
                    {q.question}
                  </strong>
                  <span className="chip" style={{ fontSize: '11px', padding: '3px 10px' }}>
                    {q.category}（自由填寫）
                  </span>
                </div>

                {/* 其他同伴回答 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: ans.applicantId === applicant.id ? 'var(--primary-subtle, #FFF8E7)' : '#FAF9F6',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontSize: '14px',
                        lineHeight: 1.6,
                      }}
                    >
                      <strong style={{ color: ans.applicantId === applicant.id ? 'var(--primary)' : 'var(--ink-primary)' }}>
                        {ans.nickname}：
                      </strong>
                      <span>{ans.text}</span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)', marginLeft: 10 }}>
                        {ans.submittedAt}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 我的回應欄（大尺寸、舒適伸展） */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                  <input
                    type="text"
                    placeholder="寫下你的感想（可選填，亦可隨時略過）..."
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    style={{ flex: 1, minHeight: 46, fontSize: '14px', padding: '10px 16px', borderRadius: '10px' }}
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
                    style={{ fontSize: '14px', fontWeight: 700, padding: '0 24px', minHeight: 46, borderRadius: '10px', whiteSpace: 'nowrap' }}
                  >
                    分享感想
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* 接續下次計畫與自願延伸探索 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
            {/* 下次活動共同計畫 */}
            <section className="card" aria-labelledby="next-plan-title" style={{ padding: '28px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarCheck size={22} color="var(--primary)" weight="bold" />
                <h3 id="next-plan-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  下次活動共同計畫
                </h3>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
                由全體成員投票選擇下一次聚會的共同建造目標，讓下一次相聚有具體期盼。
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                {nextPlan.map((opt) => {
                  const hasVoted = opt.votes.includes(applicant.id);
                  return (
                    <div
                      key={opt.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        border: hasVoted ? '2.5px solid var(--primary)' : '1.5px solid var(--border)',
                        backgroundColor: hasVoted ? 'var(--primary-subtle, #FFF8E7)' : 'var(--surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <strong style={{ fontSize: '15px', color: 'var(--ink-primary)' }}>
                          {opt.targetTitle}
                        </strong>
                        <button
                          type="button"
                          onClick={() => dispatch({ type: 'VOTE_NEXT_PLAN', optionId: opt.id, applicantId: applicant.id })}
                          style={{
                            minHeight: 40,
                            padding: '8px 20px',
                            fontSize: '13px',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-full)',
                            border: hasVoted ? '2px solid var(--primary)' : '1.5px solid var(--primary)',
                            background: hasVoted ? 'var(--primary)' : 'transparent',
                            color: hasVoted ? '#FFFFFF' : 'var(--primary)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {hasVoted ? '已支持 ✓' : '支持此項目'}
                        </button>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', margin: 0, lineHeight: 1.6 }}>
                        {opt.description}
                      </p>
                      <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                        目前支持夥伴：<strong>{opt.votes.length}</strong> 位
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 自願線下／活動外探索提案 */}
            <section className="card" aria-labelledby="offline-explore-title" style={{ padding: '28px', borderRadius: '18px', borderColor: 'var(--primary-border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Compass size={22} color="var(--primary)" weight="bold" />
                  <h3 id="offline-explore-title" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    延伸活動與日常相處探索
                  </h3>
                </div>
                <SimBadge label="自由意願・不影響小隊資格" />
              </div>

              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '14px',
                  backgroundColor: '#FAF9F6',
                  border: '1.5px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <strong style={{ fontSize: '16px' }}>
                  {offlineProp.title}
                </strong>
                <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {offlineProp.description}
                </p>

                {/* 待確認細節標示 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', backgroundColor: '#FFFFFF', borderRadius: '10px', fontSize: '13px', border: '1px solid var(--border)' }}>
                  <div style={{ color: '#D97706' }}>• 交通安排：{offlineProp.transitStatus}</div>
                  <div style={{ color: '#D97706' }}>• 無障礙可及性：{offlineProp.accessibilityStatus}</div>
                  <div style={{ color: '#D97706' }}>• 費用預估：{offlineProp.feeStatus}</div>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--ink-secondary)' }}>
                  我的意願選擇：<strong style={{ color: 'var(--primary)' }}>{offlineProp.responses[applicant.id] || '尚未表態'}</strong>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
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
                        minHeight: 42,
                        padding: '8px 20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        borderRadius: 'var(--radius-full)',
                        border: offlineProp.responses[applicant.id] === choice ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                        backgroundColor: offlineProp.responses[applicant.id] === choice ? 'var(--primary)' : 'var(--surface)',
                        color: offlineProp.responses[applicant.id] === choice ? '#FFFFFF' : 'var(--ink-primary)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

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
            padding: 20,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 540,
              width: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              padding: '32px',
              borderRadius: '20px',
            }}
          >
            <h3 id="modal-prop-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 14 }}>
              提出你的基地入口設計想法
            </h3>
            <form onSubmit={handleCreateProposal} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  提案名稱 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：柔和暖光雙層拱門"
                  value={newPropTitle}
                  onChange={(e) => setNewPropTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '15px', borderRadius: '10px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  建築構想與建材說明
                </label>
                <textarea
                  rows={3}
                  placeholder="說明你希望採用的材質、顏色或空間佈局..."
                  value={newPropConcept}
                  onChange={(e) => setNewPropConcept(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '15px', borderRadius: '10px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  無障礙或友善特色
                </label>
                <input
                  type="text"
                  placeholder="例如：寬敞平坦坡道、高對比夜光導引地燈"
                  value={newPropAccess}
                  onChange={(e) => setNewPropAccess(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '15px', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="btn-secondary"
                  style={{ minHeight: 44, padding: '10px 22px', fontSize: '14px', fontWeight: 700, borderRadius: 'var(--radius-full)' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ minHeight: 44, padding: '10px 26px', fontSize: '14px', fontWeight: 700, borderRadius: 'var(--radius-full)' }}
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
            padding: 20,
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 500,
              width: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              padding: '32px',
              borderRadius: '20px',
            }}
          >
            <h3 id="modal-help-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>
              遇到卡關或想調整參與方式？
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              主持人將即時在後台接收您的求助訊號，提供彈性切換或支援。不需公開說明個人醫療診斷。
            </p>

            <form onSubmit={handleHelpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  求助類型
                </label>
                <select
                  value={helpType}
                  onChange={(e) => setHelpType(e.target.value as any)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '15px', borderRadius: '10px' }}
                >
                  <option value="換參與方式">換參與方式（例如：由操作改為設計投票/文字）</option>
                  <option value="操作卡關">操作卡關（鍵位失靈、方塊卡住、視角延遲）</option>
                  <option value="需要小歇">需要小歇（暫停 5-10 分鐘，稍後回歸）</option>
                  <option value="其他支援">其他支援（請主持人線上引導）</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  簡短說明（選填）
                </label>
                <input
                  type="text"
                  placeholder="例如：手部稍微疲累，想先純文字參與"
                  value={helpNote}
                  onChange={(e) => setHelpNote(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', fontSize: '15px', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="btn-secondary"
                  style={{ minHeight: 44, padding: '10px 22px', fontSize: '14px', fontWeight: 700, borderRadius: 'var(--radius-full)' }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    minHeight: 44,
                    padding: '10px 26px',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#D9534F',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                  }}
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
