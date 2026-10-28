import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { StatusChip } from '../../components/StatusChip';
import { SimBadge } from '../../components/SimBadge';
import {
  CalendarCheck,
  GameController,
  UsersThree,
  WarningCircle,
  ChatTeardropDots,
  ShieldCheck,
  CheckCircle,
  Clock,
  Compass,
  ArrowSquareOut
} from '@phosphor-icons/react';

export const MyStatus: React.FC = () => {
  const { state } = useAppStore();

  const applicant = state.applications.find(a => a.id === state.currentParticipantId);

  if (!applicant) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <h2>未找到申請者紀錄</h2>
        <p style={{ margin: 'var(--space-4) 0', color: 'var(--ink-secondary)' }}>
          您尚未提交報名資料，請先前往報名頁填寫。
        </p>
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
          前往報名
        </Link>
      </div>
    );
  }

  // 取得所屬小組與場次
  const group = applicant.assignedGroupId
    ? state.groups.find(g => g.id === applicant.assignedGroupId)
    : null;

  const groupSessions = group
    ? state.sessions.filter(s => s.groupId === group.id)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* 頂部個人進度卡片 (FR-03) */}
      <section className="card" aria-labelledby="status-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 id="status-header" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {applicant.nickname} 的同儕活動進度
              </h1>
              <StatusChip status={applicant.status} />
            </div>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              申請編號：<code>{applicant.id}</code> ｜ 送件時間：{applicant.submittedAt}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/report-issue" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 'var(--text-sm)', minHeight: 40 }}>
              <WarningCircle size={18} />
              <span>遇問題求助</span>
            </Link>
          </div>
        </div>

        {/* 狀態說明橫幅 (FR-03 規定：每種狀態都有對應說明；不以沒有說明的代碼顯示) */}
        <div
          style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-sand-darker)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>目前狀態解讀：</span>
          </div>
          <p style={{ color: 'var(--ink-primary)', fontSize: 'var(--text-base)' }}>
            {applicant.status === '待確認' && '服務團隊已收到您的報名表，將於 1-2 個工作天內聯繫您進行一對一設備與操作測試。'}
            {applicant.status === '需後續聯繫' && '服務專員已收到您的操作備忘，尚有設備規格或時段微調需與您線上確認。請留意您的聯絡信箱或 LINE。'}
            {applicant.status === '可安排' && '您的操作與溝通偏好已全數確認完畢！目前服務團隊正在協調最適合的同儕梯次，組成人數達 6-8 人後將發布小組名單。'}
            {applicant.status === '已入組' && '恭喜您！您已被分配至固定小組。請詳閱下方活動時程與加入指引，期待在線上與大家相遇！'}
          </p>
        </div>

        {/* 可及性檢核結果摘要 (FR-05) */}
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 8, color: 'var(--ink-secondary)' }}>
            事前可及性確認檢核 (FR-05)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.deviceConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>設備環境確認：{applicant.accessibilityCheck.deviceConfirmed ? '已完成' : '待測試'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.controlsConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>操作方式確認：{applicant.accessibilityCheck.controlsConfirmed ? '已完成' : '待測試'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.communicationConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>溝通偏好確認：{applicant.communicationPreference}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.supportNeedConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>支援需求註記：{applicant.accessibilityCheck.supportNeedConfirmed ? '已建檔' : '待確認'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 固定小組資訊 (FR-06) */}
      {group ? (
        <section className="card" aria-labelledby="group-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 id="group-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <UsersThree size={24} color="var(--primary)" weight="duotone" />
                <span>所屬固定小組：{group.name} (FR-06)</span>
              </h2>
              <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                固定聚會時段：<strong>{group.fixedTimeSlot}</strong> ｜ 活動主持：{group.hostName}
              </p>
            </div>
            <SimBadge label="固定 6-8 人成員架構" />
          </div>

          <div style={{ backgroundColor: 'var(--bg-sand)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 8, fontWeight: 700 }}>
              同組夥伴（社群暱稱）
            </h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {group.members.map(member => (
                <span
                  key={member.applicantId}
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: member.applicantId === applicant.id ? 700 : 500,
                    color: member.applicantId === applicant.id ? 'var(--primary)' : 'var(--ink-primary)',
                  }}
                >
                  {member.nickname} {member.role === '小組長' && '🌟 (小組長)'} {member.applicantId === applicant.id && '（您）'}
                </span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            備援緊急聯絡：{group.backupContact}
          </p>
        </section>
      ) : (
        <section className="card" style={{ backgroundColor: 'var(--bg-sand-darker)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>固定小組安排中</h2>
          <p style={{ color: 'var(--ink-secondary)' }}>
            完成事前可及性確認後，管理專員會依據您的可用時段與偏好將您加入固定小組。
          </p>
        </section>
      )}

      {/* 場次排程與加入指引 (FR-07, FR-08) */}
      {groupSessions.length > 0 && (
        <section aria-labelledby="sessions-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 id="sessions-title" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
              活動場次與加入指引 (FR-07, FR-08)
            </h2>
            <SimBadge label="Minecraft Creative 候選 (OD-01)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {groupSessions.map((session) => {
              const myAttendance = session.attendance[applicant.id] || '未記錄';

              return (
                <article
                  key={session.id}
                  className="card"
                  style={{
                    borderLeft: session.status === '已發布' ? '6px solid var(--primary)' : '6px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                          {session.title}
                        </h3>
                        <StatusChip status={session.status} />
                      </div>
                      <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)' }}>
                        活動時間：<strong>{session.scheduledAt}</strong> (長度 {session.durationMinutes} 分鐘) ｜ 主持人：{session.hostName}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', display: 'block' }}>
                        出席狀態：
                      </span>
                      <strong style={{ color: myAttendance === '出席' ? 'var(--status-success-ink)' : 'var(--ink-primary)' }}>
                        {myAttendance}
                      </strong>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-sand)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                      🎯 本次共同目標
                    </h4>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-primary)' }}>
                      {session.goal}
                    </p>
                  </div>

                  {/* 加入指引 (FR-08 必須包含時間、工具、加入方式與備援聯絡) */}
                  {session.status === '已發布' ? (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Compass size={20} color="var(--primary)" />
                        <span>活動連線與加入指引 (FR-08)</span>
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 12, fontSize: 'var(--text-sm)' }}>
                        <div>
                          <strong>連線遊戲平台：</strong>{session.joinGuide.gamePlatform}
                        </div>
                        <div>
                          <strong>伺服器地址：</strong>
                          <code style={{ background: 'var(--bg-sand-darker)', padding: '2px 6px', borderRadius: 4 }}>
                            {session.joinGuide.serverAddress}
                          </code>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong>同步語音/文字頻道：</strong>{session.joinGuide.voiceChannel}
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--surface-alt)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--text-sm)' }}>
                        <strong>逐步步驟：</strong>
                        <ol style={{ paddingLeft: 20, marginTop: 4, lineHeight: 1.7 }}>
                          {session.joinGuide.guideSteps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
                          若遭遇伺服器連線卡關，請立即聯絡備援專線：<code>{session.backupContact}</code>
                        </span>
                        <Link to="/feedback" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 'var(--text-sm)', minHeight: 36 }}>
                          <ChatTeardropDots size={16} />
                          <span>活動後提交回饋</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>
                      （場次資訊尚在整備中，完整加入指引確認後將自動解鎖顯示。）
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 結束後追蹤邀請 (FR-14) */}
      <section className="card" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 8, color: 'var(--primary)' }}>
          8 週同儕活動結束後續追蹤 (FR-14)
        </h2>
        <p style={{ color: 'var(--ink-primary)', fontSize: 'var(--text-base)', marginBottom: 12 }}>
          每期 8 週活動完成後，我們邀請您填寫簡短的同儕關係自評。無論您日後是否繼續參與，您的回覆都將幫助我們優化可及性服務。
        </p>
        <Link to="/feedback" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <span>填寫結束後追蹤問卷</span>
        </Link>
      </section>
    </div>
  );
};
