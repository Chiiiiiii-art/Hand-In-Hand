import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { calculateMetrics } from '../../metrics';
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
  ArrowSquareOut
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

  // 匯出摘要至剪貼簿 (FR-16)
  const [copied, setCopied] = useState(false);
  const handleCopySummary = () => {
    const summaryText = `【攜手基地 服務執行與成效摘要 (PoC 示範資料)】
統計時間：${new Date().toISOString().slice(0, 10)}
---------------------------------------------
1. 招募與入組：
   - 累積申請總數：${metrics.totalApplications} 人
   - 已完成入組數：${metrics.totalEnrolled} 人
   - 待確認/後續聯繫：${metrics.pendingApplications} 人
2. 活動出席與留存：
   - 平均出席率：${metrics.attendanceRate.percentage}% (出席 ${metrics.attendanceRate.attendedCount} / 排定 ${metrics.attendanceRate.scheduledCount} 人次)
   - 重複參與率：${metrics.repeatParticipationRate.percentage}% (至少參與2場：${metrics.repeatParticipationRate.repeatMembersCount} / 至少被安排1場：${metrics.repeatParticipationRate.eligibleMembersCount} 人)
3. 同儕連結與主觀感受：
   - 歸屬感/同儕連結均分：${metrics.peerConnectionAverage.average} / 5.0 (共 ${metrics.peerConnectionAverage.totalResponses} 份回饋)
   - 8週結束後續聯繫意願：${metrics.postProgramWillingness.percentage}% (願意 ${metrics.postProgramWillingness.willingCount} / 已回覆 ${metrics.postProgramWillingness.totalAnswered} 人，尚有 ${metrics.postProgramWillingness.pendingCount} 人待回覆)
4. 安全與問題處理：
   - 總通報數：${metrics.issueSummary.total} 件
   - 未處理/處理中：${metrics.issueSummary.unresolved} 件
   - 已處理：${metrics.issueSummary.resolved} 件
---------------------------------------------
註：本資料為 PoC 示範原型模擬數據，非實際醫療評估結果。`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // 模擬活動提醒廣播 (FR-15)
  const handleSimulateReminder = () => {
    dispatch({
      type: 'SET_TOAST',
      message: '【模擬提醒已發送】（FR-15）：已向第 3 週青鳥組成員發送開場前 1 小時登入提醒與連線網址！',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 頂部儀表板標題與操作按鈕 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
              服務成效摘要儀表板 (FR-13)
            </h1>
            <SimBadge label="口徑嚴格對齊 PRD §9" />
          </div>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
            即時彙整申請審查、固定組別排程、活動出席、主觀歸屬感與事件處置進度。
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSimulateReminder}
            className="btn-secondary"
            title="模擬向全組成員發送活動提醒通知 (FR-15)"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            <Bell size={18} />
            <span>模擬活動提醒 (FR-15)</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="btn-primary"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            <Copy size={18} />
            <span>{copied ? '已複製彙總至剪貼簿！' : '匯出/複製彙總 (FR-16)'}</span>
          </button>
        </div>
      </div>

      {/* 關鍵數據指標卡 (4 大層級 §9) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
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
            完成固定小組入組率：{Math.round((metrics.totalEnrolled / metrics.totalApplications) * 100)}%
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', marginTop: 10, paddingTop: 6, fontSize: '11px', color: 'var(--ink-muted)' }}>
            <strong>口徑：</strong>選定期間收到的申請與完成分組安排者分開計算。
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
          <div style={{ borderTop: '1px dashed var(--border)', marginTop: 10, paddingTop: 6, fontSize: '11px', color: 'var(--ink-muted)' }}>
            <strong>口徑：</strong>{metrics.attendanceRate.formula}；取消或未開放場次不計入。
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
            至少參與 2 場：{metrics.repeatParticipationRate.repeatMembersCount} 人 ｜ 安排至少 1 場：{metrics.repeatParticipationRate.eligibleMembersCount} 人
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', marginTop: 10, paddingTop: 6, fontSize: '11px', color: 'var(--ink-muted)' }}>
            <strong>口徑：</strong>{metrics.repeatParticipationRate.formula}。
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
            累計有效回饋：{metrics.peerConnectionAverage.totalResponses} 份自評
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', marginTop: 10, paddingTop: 6, fontSize: '11px', color: 'var(--ink-muted)' }}>
            <strong>口徑：</strong>每場活動自評問卷加總平均，未回覆不作負面推估。
          </div>
        </div>
      </div>

      {/* 待辦項目警示橫幅 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 待處理事件 */}
        <div className="card" style={{ borderLeft: '6px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <WarningCircle size={22} color="var(--accent)" weight="fill" />
              <span>待處理問題事件 ({metrics.issueSummary.unresolved} 件)</span>
            </h2>
            <span className="chip chip-warning">FR-12</span>
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', marginBottom: 12 }}>
            包含技術障礙與互動安全通報。需即時聯繫並登錄後續處置。
          </p>
          <div style={{ display: 'flex', gap: 12, fontSize: 'var(--text-sm)' }}>
            <span>技術問題：<strong>{metrics.issueSummary.technical}</strong></span>
            <span>互動安全：<strong>{metrics.issueSummary.safety}</strong></span>
            <span>其他：<strong>{metrics.issueSummary.other}</strong></span>
          </div>
        </div>

        {/* 結束後聯繫意願 */}
        <div className="card" style={{ borderLeft: '6px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkle size={22} color="var(--primary)" weight="fill" />
              <span>8 週結束後聯繫意願 (FR-14)</span>
            </h2>
            <span className="chip chip-info">持續性追蹤</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--primary)', margin: '4px 0' }}>
            {metrics.postProgramWillingness.percentage}% 願意繼續保持聯繫
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            已回覆成員中願意自願交流比率。尚有 <strong>{metrics.postProgramWillingness.pendingCount} 位</strong> 待回覆（嚴格將「待回覆」與「無意願」分開計算）。
          </p>
        </div>
      </div>

      {/* 待確認名單快速跳轉 */}
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            近期待確認申請 (FR-04)
          </h2>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)' }}>
            尚有 {metrics.pendingApplications} 筆待進行可及性測試
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>送出時間</th>
                <th>申請暱稱</th>
                <th>年齡</th>
                <th>操作設備偏好</th>
                <th>溝通偏好</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {state.applications.slice(0, 5).map((app) => (
                <tr key={app.id}>
                  <td>{app.submittedAt}</td>
                  <td style={{ fontWeight: 600 }}>{app.nickname}</td>
                  <td>{app.age} 歲</td>
                  <td>{app.inputMethod}</td>
                  <td>{app.communicationPreference}</td>
                  <td>
                    <span className="chip chip-info">{app.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
