import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { calculateMetrics, calculateGroupInteractionMetrics } from '../../metrics';
import { SimBadge } from '../../components/SimBadge';
import {
  UsersThree,
  CheckCircle,
  Clock,
  ChartLineUp,
  Heart,
  WarningCircle,
  Copy,
  Bell,
  Sparkle,
  ChartBar,
  Compass
} from '@phosphor-icons/react';

export const AdminDashboard: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const metrics = calculateMetrics(
    state.applications,
    state.sessions,
    state.feedbacks,
    state.issues,
    state.followUps
  );

  const groupMetrics = calculateGroupInteractionMetrics(
    state.coopTasks,
    state.applications,
    state.helpRequests,
    state.nextPlanOptions,
    state.offlineProposals
  );

  // 匯出摘要至剪貼簿
  const [copied, setCopied] = useState(false);
  const handleCopySummary = () => {
    const summaryText = `【攜手基地 — 線上遊戲同儕友誼支持社群 服務成效與小組互動摘要】
統計時間：${new Date().toISOString().slice(0, 10)}
備註：恪守同儕支持與無障礙原則，絕不對個人進行社交排名或友誼打分。
---------------------------------------------
1. 服務執行層級：
   - 累積申請總數：${metrics.totalApplications} 人（已入組：${metrics.totalEnrolled} 人）
   - 平均出席率：${metrics.attendanceRate.percentage}% (出席 ${metrics.attendanceRate.attendedCount} / 排定 ${metrics.attendanceRate.scheduledCount} 人次)
   - 重複參與率：${metrics.repeatParticipationRate.percentage}% (至少參與2場：${metrics.repeatParticipationRate.repeatMembersCount} 人)
2. 小組互惠與協作互動：
   - 共同決策完成數：${groupMetrics.totalTasksWithDecisions} 次 (提案總數：${groupMetrics.totalProposalsSubmitted} 件)
   - 提案投票參與率：${groupMetrics.proposalVoteParticipationRate.percentage}%
   - 多元參與途徑：空間建造 ${groupMetrics.contributionModeDistribution.direct_build} / 設計規劃 ${groupMetrics.contributionModeDistribution.design_choice} / 景觀配置 ${groupMetrics.contributionModeDistribution.resource_sort} / 導覽敘事 ${groupMetrics.contributionModeDistribution.text_voice_coord} 人
   - 求助及時回應率：${groupMetrics.helpRequestResponseRate.percentage}%
   - 下次計畫共識首選：${groupMetrics.nextPlanConsensus.leadingTarget}
3. 主觀歸屬與安全：
   - 歸屬與同儕連結均分：${metrics.peerConnectionAverage.average} / 5.0 (共 ${metrics.peerConnectionAverage.totalResponses} 份自評)
   - 結束後聯繫意願：${metrics.postProgramWillingness.percentage}% (尚有 ${metrics.postProgramWillingness.pendingCount} 人待回覆，分開列示)
   - 安全與問題通報：總計 ${metrics.issueSummary.total} 件 (已處理 ${metrics.issueSummary.resolved} 件)
---------------------------------------------`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // 模擬活動提醒廣播
  const handleSimulateReminder = () => {
    dispatch({
      type: 'SET_TOAST',
      message: '【站內活動提醒】：已向第 3 週翠鳥組成員顯示開場前 1 小時基地連線提醒！',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 頂部標題列與操作 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
              服務成效與小組互動儀表板
            </h1>
            <SimBadge label="服務指標聚合" />
          </div>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
            以小組層級協作、決策與服務執行為主；嚴格排除任何個人社交排行榜或友誼分數。
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSimulateReminder}
            className="btn-secondary"
            title="發布站內活動提醒通知"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            <Bell size={18} />
            <span>發布活動溫馨提醒</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="btn-primary"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            <Copy size={18} />
            <span>{copied ? '已複製彙總至剪貼簿！' : '匯出/複製成效彙總'}</span>
          </button>
        </div>
      </div>

      {/* 小組協作與互動層級指標 */}
      <section className="card" style={{ borderColor: 'var(--primary-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ChartBar size={22} color="var(--primary)" />
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
              小組協作與互惠互動歷程
            </h2>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            統計小組：翠鳥一組 (樣本數 N=4)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>小組共同決策完成數</div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
              {groupMetrics.totalTasksWithDecisions} 次
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              方案提案總數：{groupMetrics.totalProposalsSubmitted} 件
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>提案投票參與覆蓋率</div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
              {groupMetrics.proposalVoteParticipationRate.percentage}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              {groupMetrics.proposalVoteParticipationRate.formula}
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>求助與暫停及時回應率</div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: '#4CAF50', margin: '4px 0' }}>
              {groupMetrics.helpRequestResponseRate.percentage}%
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              已由主持人支援 {groupMetrics.helpRequestResponseRate.handledCount} / 提出 {groupMetrics.helpRequestResponseRate.totalRequests} 件
            </div>
          </div>

          <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--bg-sand-darker)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>下次計畫共識達成</div>
            <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--ink-primary)', margin: '6px 0', lineHeight: 1.3 }}>
              {groupMetrics.nextPlanConsensus.leadingTarget}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-secondary)' }}>
              投票率：{groupMetrics.nextPlanConsensus.participationRate}%
            </div>
          </div>
        </div>

        {/* 多元貢獻途徑分佈 */}
        <div style={{ marginTop: 'var(--space-4)', padding: '12px 16px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)' }}>
          <strong>多元貢獻方式分佈（不依障礙分類，所有途徑皆影響共同成果）：</strong>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 6, color: 'var(--ink-secondary)' }}>
            <span>• 空間建造：<strong>{groupMetrics.contributionModeDistribution.direct_build}</strong> 人</span>
            <span>• 設計規劃：<strong>{groupMetrics.contributionModeDistribution.design_choice}</strong> 人</span>
            <span>• 景觀配置：<strong>{groupMetrics.contributionModeDistribution.resource_sort}</strong> 人</span>
            <span>• 導覽敘事：<strong>{groupMetrics.contributionModeDistribution.text_voice_coord}</strong> 人</span>
          </div>
        </div>
      </section>

      {/* 服務執行與出席指標卡 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 指標 1：申請與入組 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              服務執行 ｜ 申請與入組
            </span>
            <UsersThree size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--primary)' }}>
            {metrics.totalEnrolled} <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-secondary)', fontWeight: 400 }}>/ {metrics.totalApplications} 人</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            固定小組入組率：{Math.round((metrics.totalEnrolled / metrics.totalApplications) * 100)}%
          </div>
        </div>

        {/* 指標 2：出席率 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              服務執行 ｜ 活動出席率
            </span>
            <CheckCircle size={22} color="var(--status-success-ink)" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--status-success-ink)' }}>
            {metrics.attendanceRate.percentage}%
          </div>
          <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            實際出席 {metrics.attendanceRate.attendedCount} 人次 ｜ 已排定 {metrics.attendanceRate.scheduledCount} 人次
          </div>
        </div>

        {/* 指標 3：重複參與率 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              持續性 ｜ 重複參與率
            </span>
            <ChartLineUp size={22} color="var(--primary)" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--primary)' }}>
            {metrics.repeatParticipationRate.percentage}%
          </div>
          <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            至少出席 2 場：{metrics.repeatParticipationRate.repeatMembersCount} 人 ｜ 安排至少 1 場：{metrics.repeatParticipationRate.eligibleMembersCount} 人
          </div>
        </div>

        {/* 指標 4：歸屬感平均分 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', fontWeight: 600 }}>
              主觀結果 ｜ 歸屬與同儕連結
            </span>
            <Heart size={22} color="var(--accent)" weight="fill" />
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--accent)' }}>
            {metrics.peerConnectionAverage.average} <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink-secondary)', fontWeight: 400 }}>/ 5.0</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            累計自評份數：{metrics.peerConnectionAverage.totalResponses} 份（未回覆不作負面推估）
          </div>
        </div>
      </div>

      {/* 安全事件與自願線下探索紀錄 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 待處理問題事件 */}
        <div className="card" style={{ borderLeft: '6px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <WarningCircle size={22} color="var(--accent)" weight="fill" />
              <span>待處理問題事件 ({metrics.issueSummary.unresolved} 件)</span>
            </h2>
            <span className="chip chip-warning">即時安全處置</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', marginBottom: 12 }}>
            包含技術障礙與互動安全通報。保護成員隱私，不在公開小組揭露。
          </p>
          <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-sm)' }}>
            <span>技術問題：<strong>{metrics.issueSummary.technical}</strong></span>
            <span>互動安全：<strong>{metrics.issueSummary.safety}</strong></span>
            <span>其他：<strong>{metrics.issueSummary.other}</strong></span>
          </div>
        </div>

        {/* 自願線下探索意願 */}
        <div className="card" style={{ borderLeft: '6px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Compass size={22} color="var(--primary)" weight="fill" />
              <span>自願線下／活動外探索意願</span>
            </h2>
            <span className="chip chip-info">意願統計</span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-sm)', margin: '8px 0' }}>
            <span>有興趣：<strong>{groupMetrics.offlineExploration.interestedCount}</strong> 人</span>
            <span>想先繼續線上：<strong>{groupMetrics.offlineExploration.continueOnlineCount}</strong> 人</span>
            <span>暫不考慮：<strong>{groupMetrics.offlineExploration.notConsideringCount}</strong> 人</span>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            {groupMetrics.offlineExploration.note}。
          </p>
        </div>
      </div>
    </div>
  );
};
