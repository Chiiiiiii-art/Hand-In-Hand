import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { SimBadge } from '../../components/SimBadge';
import { calculateGroupInteractionMetrics } from '../../metrics';
import {
  UsersThree,
  SlidersHorizontal,
  WarningCircle,
  CheckCircle,
  ChatTeardropDots,
  ShieldCheck,
  GameController,
  PaintBrush,
  Package,
  Sparkle,
  ArrowRight,
  ChartBar
} from '@phosphor-icons/react';

export const HostConsole: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const group = state.groups[0];
  const activeTask = state.coopTasks.find(t => t.groupId === group.id) || state.coopTasks[0];
  const helpRequests = state.helpRequests;

  const [replyText, setReplyText] = useState('沒問題！已為您切換至彈性參與模式，請安心放鬆雙手。');
  const [selectedHelpId, setSelectedHelpId] = useState<string | null>(helpRequests[0]?.id || null);

  const groupMetrics = calculateGroupInteractionMetrics(
    state.coopTasks,
    state.applications,
    state.helpRequests,
    state.nextPlanOptions,
    state.offlineProposals
  );

  const handleResolveHelp = (id: string) => {
    dispatch({
      type: 'RESPOND_HELP_REQUEST',
      id,
      hostReply: replyText,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 頂部標題列 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
              主持人活動即時控制台
            </h1>
            <span className="chip chip-info">陳主持（引導社工師）</span>
            <SimBadge label="即時協調・支援安全與連續性" />
          </div>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
            即時掌握固定小組（{group.name}）成員參與狀態、回應求助訊號，並紀錄小組互動觀察。不對個人進行社交打分。
          </p>
        </div>
      </div>

      {/* 1. 成員即時參與狀態與多元貢獻分佈 (FR-05, FR-12) */}
      <section className="card" aria-labelledby="members-status-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 id="members-status-heading" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <UsersThree size={22} color="var(--primary)" />
              <span>小組成員即時參與狀態</span>
            </h2>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
              尊重自主選擇，不強迫發言或固定分派角色
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, fontSize: 'var(--text-xs)' }}>
            <span className="chip chip-success">全員在線</span>
            <span className="chip chip-info">固定 4 人組</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
          {group.members.map((member) => {
            const app = state.applications.find(a => a.id === member.applicantId);
            return (
              <div
                key={member.applicantId}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 'var(--text-base)', color: 'var(--ink-primary)' }}>
                    {member.nickname}
                  </strong>
                  <span className="chip" style={{ fontSize: '11px' }}>
                    {member.role}
                  </span>
                </div>

                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div>偏好方式：<strong>{app?.communicationPreference || '文字為主'}</strong></div>
                  <div>操作工具：{app?.inputMethod || '標準滑鼠'}</div>
                  <div>
                    當前貢獻途徑：
                    <span className="chip chip-info" style={{ fontSize: '11px', marginLeft: 4 }}>
                      {app?.currentContributionMode === 'direct_build' && '空間建造'}
                      {app?.currentContributionMode === 'design_choice' && '設計規劃'}
                      {app?.currentContributionMode === 'resource_sort' && '景觀配置'}
                      {app?.currentContributionMode === 'text_voice_coord' && '導覽敘事'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 'auto' }}>
                  支持備忘：{app?.supportNeeds}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 求助與暫停處理工作台 (FR-06, PRD 第 9 節第 5 步) */}
      <section className="card" aria-labelledby="help-desk-heading" style={{ borderColor: 'var(--primary-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WarningCircle size={22} color="#D9534F" weight="bold" />
            <h2 id="help-desk-heading" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              成員求助與暫停處置工作台
            </h2>
            <SimBadge label="雙向支援・即時回應" />
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            雙向通訊・參與者端即時獲取確認
          </span>
        </div>

        {helpRequests.length === 0 ? (
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)' }}>目前小組運作順暢，尚無待處理求助。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {helpRequests.map((req) => {
              const isResolved = req.status === '已由主持人支援';
              return (
                <div
                  key={req.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                    backgroundColor: isResolved ? '#F8F9FA' : '#FFFDF7',
                    borderLeft: isResolved ? '4px solid #4CAF50' : '4px solid #FF9800',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 'var(--text-base)' }}>{req.nickname}</strong>
                      <span className="chip chip-warning" style={{ fontSize: '11px' }}>
                        {req.requestType}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
                        送達時間：{req.submittedAt}
                      </span>
                    </div>

                    <span className={`chip ${isResolved ? 'chip-success' : 'chip-warning'}`} style={{ fontSize: '11px' }}>
                      {req.status}
                    </span>
                  </div>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-primary)', margin: '6px 0' }}>
                    說明內容：{req.note}
                  </p>

                  {isResolved ? (
                    <div
                      style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        backgroundColor: '#E8F5E9',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-xs)',
                        color: '#2E7D32',
                      }}
                    >
                      <strong>主持人支援回覆：</strong>{req.hostReply} ({req.handledAt})
                    </div>
                  ) : (
                    <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ flex: 1, minWidth: 260, padding: '6px 12px', fontSize: 'var(--text-xs)' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleResolveHelp(req.id)}
                        className="btn-primary"
                        style={{ fontSize: 'var(--text-xs)', padding: '6px 16px', minHeight: 36 }}
                      >
                        <CheckCircle size={16} />
                        <span>立即回應並標記已支援</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. 小組層級互動摘要 (FR-17 & PRD 第 9 節第 8 步) */}
      <section className="card" aria-labelledby="interaction-metrics-heading">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ChartBar size={22} color="var(--primary)" />
              <h2 id="interaction-metrics-heading" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                小組層級協作與互動摘要
              </h2>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginTop: 2 }}>
              以小組協作與共同決策過程為主，絕無個人社交排行榜或友誼打分。
            </p>
          </div>
          <SimBadge label="服務觀察紀錄" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>共同決策完成數</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
              {groupMetrics.totalTasksWithDecisions} 次
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              方案提案總數：{groupMetrics.totalProposalsSubmitted} 件
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>提案投票參與率</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
              {groupMetrics.proposalVoteParticipationRate.percentage}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              {groupMetrics.proposalVoteParticipationRate.formula}
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>求助與暫停及時回應率</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: '#4CAF50', margin: '4px 0' }}>
              {groupMetrics.helpRequestResponseRate.percentage}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              已處理 {groupMetrics.helpRequestResponseRate.handledCount} / 提出 {groupMetrics.helpRequestResponseRate.totalRequests} 件
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>下次計畫共識首選</div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-primary)', margin: '6px 0', lineHeight: 1.3 }}>
              {groupMetrics.nextPlanConsensus.leadingTarget}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              投票參與率：{groupMetrics.nextPlanConsensus.participationRate}%
            </div>
          </div>
        </div>

        {/* 多元貢獻分佈條 */}
        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <strong style={{ fontSize: 'var(--text-xs)', display: 'block', marginBottom: 8 }}>
            多元參與貢獻分佈（不依障礙分類）：
          </strong>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 'var(--text-xs)' }}>
            <span>• 空間建造：<strong>{groupMetrics.contributionModeDistribution.direct_build}</strong> 人</span>
            <span>• 設計規劃：<strong>{groupMetrics.contributionModeDistribution.design_choice}</strong> 人</span>
            <span>• 景觀配置：<strong>{groupMetrics.contributionModeDistribution.resource_sort}</strong> 人</span>
            <span>• 導覽敘事：<strong>{groupMetrics.contributionModeDistribution.text_voice_coord}</strong> 人</span>
          </div>
        </div>
      </section>
    </div>
  );
};
