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
  ArrowSquareOut,
  House
} from '@phosphor-icons/react';

export const MyStatus: React.FC = () => {
  const { state } = useAppStore();

  const applicant = state.applications.find(a => a.id === state.currentParticipantId);

  if (!applicant) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
        <h2>尚未找到預約紀錄</h2>
        <p style={{ margin: 'var(--space-4) 0', color: 'var(--ink-secondary)' }}>
          你還沒填寫小隊預約單喔！花 3 分鐘告訴我們你的操作習慣吧。
        </p>
        <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>
          前往預約小隊
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
      {/* 頂部個人進度卡片 */}
      <section className="card" aria-labelledby="status-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 id="status-header" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
                {applicant.nickname} 的冒險小隊天地
              </h1>
              <StatusChip status={applicant.status} />
            </div>
            <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
              預約編號：<code>{applicant.id}</code> ｜ 登記時間：{applicant.submittedAt}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/" className="btn-primary" style={{ textDecoration: 'none', fontSize: 'var(--text-sm)', minHeight: 40, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <House size={18} />
              <span>進入我的小組基地</span>
            </Link>
            <Link to="/report-issue" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 'var(--text-sm)', minHeight: 40 }}>
              <WarningCircle size={18} />
              <span>遇困擾安心求助</span>
            </Link>
          </div>
        </div>

        {/* 狀態說明橫幅 */}
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
            <span>目前小隊進度：</span>
          </div>
          <p style={{ color: 'var(--ink-primary)', fontSize: 'var(--text-base)' }}>
            {applicant.status === '待確認' && '小幫手已收到你的預約，將於 1-2 個工作天內聯繫你，線上測試設備手感與連線。'}
            {applicant.status === '需後續聯繫' && '小幫手已收到你的設備備忘，尚有時段或手感細節想跟你進一步聊聊。請留意你的 LINE 或 Email。'}
            {applicant.status === '可安排' && '你的設備手感與溝通偏好都確認好囉！目前正在為你媒合最合拍的小隊夥伴，成隊後就會公布小隊名單。'}
            {applicant.status === '已入組' && '太棒了！你已經加入固定小隊囉。請查看下方的聚會時程與連線指引，期待在客廳與大家相聚！'}
          </p>
        </div>

        {/* 設備手感調校檢核摘要 */}
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 8, color: 'var(--ink-secondary)' }}>
            事前設備與手感調校檢核
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.deviceConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>設備連線測試：{applicant.accessibilityCheck.deviceConfirmed ? '已調校完成' : '待測試'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.controlsConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>按鍵手感確認：{applicant.accessibilityCheck.controlsConfirmed ? '順暢舒適' : '待測試'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.communicationConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>溝通偏好註記：{applicant.communicationPreference}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
              {applicant.accessibilityCheck.supportNeedConfirmed ? (
                <CheckCircle size={18} weight="fill" color="var(--primary)" />
              ) : (
                <Clock size={18} color="var(--ink-muted)" />
              )}
              <span>貼心需求建檔：{applicant.accessibilityCheck.supportNeedConfirmed ? '已轉交引導員' : '待確認'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 固定小隊資訊 */}
      {group ? (
        <section className="card" aria-labelledby="group-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 id="group-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <UsersThree size={24} color="var(--primary)" weight="duotone" />
                <span>我的固定小隊：{group.name}</span>
              </h2>
              <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                每週固定聚會時段：<strong>{group.fixedTimeSlot}</strong> ｜ 小隊引導員：{group.hostName}
              </p>
            </div>
            <SimBadge label="固定 6-8 人熟面孔" />
          </div>

          <div style={{ backgroundColor: 'var(--bg-sand)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', marginBottom: 8, fontWeight: 700 }}>
              小隊隊友（社群暱稱）
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
                  {member.nickname} {member.role === '小組長' && '🌟 (小隊長)'} {member.applicantId === applicant.id && '（你）'}
                </span>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
            備援緊急聯絡管道：{group.backupContact}
          </p>
        </section>
      ) : (
        <section className="card" style={{ backgroundColor: 'var(--bg-sand-darker)' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 8 }}>固定小隊安排中</h2>
          <p style={{ color: 'var(--ink-secondary)' }}>
            完成事前手感與設備調校後，小幫手會依據你的可用時段與偏好，為你安排最舒適的小隊。
          </p>
        </section>
      )}

      {/* 場次排程與加入指引 */}
      {groupSessions.length > 0 && (
        <section aria-labelledby="sessions-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h2 id="sessions-title" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
              聚會場次與連線指引
            </h2>
            <SimBadge label="Minecraft Creative 休閒建造" />
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
                        聚會時間：<strong>{session.scheduledAt}</strong> (預計 {session.durationMinutes} 分鐘) ｜ 引導員：{session.hostName}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', display: 'block' }}>
                        出席紀錄：
                      </span>
                      <strong style={{ color: myAttendance === '出席' ? 'var(--status-success-ink)' : 'var(--ink-primary)' }}>
                        {myAttendance}
                      </strong>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-sand)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                      🎯 本週小隊共同任務
                    </h4>
                    <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-primary)' }}>
                      {session.goal}
                    </p>
                  </div>

                  {/* 加入指引 */}
                  {session.status === '已發布' ? (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Compass size={20} color="var(--primary)" />
                        <span>聚會連線與加入指引</span>
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 12, fontSize: 'var(--text-sm)' }}>
                        <div>
                          <strong>遊戲平台：</strong>{session.joinGuide.gamePlatform}
                        </div>
                        <div>
                          <strong>伺服器位址：</strong>
                          <code style={{ background: 'var(--bg-sand-darker)', padding: '2px 6px', borderRadius: 4 }}>
                            {session.joinGuide.serverAddress}
                          </code>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <strong>同步語音/文字頻道：</strong>{session.joinGuide.voiceChannel}
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--surface-alt)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--text-sm)' }}>
                        <strong>連線步驟：</strong>
                        <ol style={{ paddingLeft: 20, marginTop: 4, lineHeight: 1.7 }}>
                          {session.joinGuide.guideSteps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
                          若連線卡關或遇到技術困難，隨時聯繫備援專線：<code>{session.backupContact}</code>
                        </span>
                        <Link to="/feedback" className="btn-secondary" style={{ textDecoration: 'none', fontSize: 'var(--text-sm)', minHeight: 36 }}>
                          <ChatTeardropDots size={16} />
                          <span>聚會後寫寫悄悄話</span>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>
                      （場次資訊整備中，完整連線指引確認後將自動解鎖顯示。）
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 8 週結束追蹤 */}
      <section className="card" style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary-border)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 8, color: 'var(--primary)' }}>
          8 週小隊畢業感想與後續陪伴
        </h2>
        <p style={{ color: 'var(--ink-primary)', fontSize: 'var(--text-base)', marginBottom: 12 }}>
          恭喜完成 8 週的小隊冒險！花 2 分鐘聊聊這段時間的相處心得，你的悄悄話能讓攜手基地變得更溫暖。
        </p>
        <Link to="/feedback" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          <span>填寫畢業心得</span>
        </Link>
      </section>
    </div>
  );
};
