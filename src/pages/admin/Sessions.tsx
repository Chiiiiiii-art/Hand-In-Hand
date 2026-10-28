import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { AttendanceStatus, SessionStatus } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { SimBadge } from '../../components/SimBadge';
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  Sparkle,
  FloppyDisk,
  WarningCircle
} from '@phosphor-icons/react';

export const AdminSessions: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const [selectedSessionId, setSelectedSessionId] = useState(state.sessions[0]?.id || 'ses-01');

  const activeSession = state.sessions.find(s => s.id === selectedSessionId);
  const activeGroup = activeSession ? state.groups.find(g => g.id === activeSession.groupId) : null;

  // 場次筆記與協作紀錄狀態
  const [summaryNotes, setSummaryNotes] = useState(activeSession?.summaryNotes || '');
  const [hasCollaboration, setHasCollaboration] = useState(activeSession?.hasCollaboration || false);

  const handleSessionChange = (id: string) => {
    setSelectedSessionId(id);
    const target = state.sessions.find(s => s.id === id);
    if (target) {
      setSummaryNotes(target.summaryNotes || '');
      setHasCollaboration(target.hasCollaboration || false);
    }
  };

  const handleAttendanceChange = (applicantId: string, status: AttendanceStatus) => {
    if (!activeSession) return;
    dispatch({
      type: 'RECORD_ATTENDANCE',
      sessionId: activeSession.id,
      applicantId,
      status,
    });
  };

  const handleTogglePublish = () => {
    if (!activeSession) return;
    const newStatus: SessionStatus = activeSession.status === '已發布' ? '待發布' : '已發布';
    
    // FR-07 檢查：未填寫加入指引或目標者不可發布
    if (newStatus === '已發布' && (!activeSession.goal || !activeSession.hostName)) {
      alert('發布失敗：活動目標與主持人為必要欄位，不可為空！');
      return;
    }

    dispatch({
      type: 'UPDATE_SESSION_STATUS',
      sessionId: activeSession.id,
      status: newStatus,
    });
  };

  const handleSaveNotes = () => {
    if (!activeSession) return;
    dispatch({
      type: 'UPDATE_SESSION_NOTES',
      sessionId: activeSession.id,
      summaryNotes,
      hasCollaboration,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
          場次排程、發布與出席管理 (FR-07, FR-09)
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
          建立各週活動目標、發布加入指引，並於活動結束後登錄成員出席狀況與協作摘要。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 左側：場次清單 */}
        <section className="card">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            8 週活動場次清單
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {state.sessions.map((s) => {
              const isSelected = s.id === selectedSessionId;
              const attendedCount = Object.values(s.attendance).filter(v => v === '出席').length;
              const totalScheduled = Object.values(s.attendance).length;

              return (
                <div
                  key={s.id}
                  onClick={() => handleSessionChange(s.id)}
                  style={{
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
                      {s.title}
                    </h3>
                    <StatusChip status={s.status} />
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>
                    時間：{s.scheduledAt} ｜ 出席：{attendedCount}/{totalScheduled} 人
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 右側：場次詳情、出席登記與成果紀錄 */}
        {activeSession && (
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 4 }}>
                  {activeSession.title}
                </h2>
                <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)' }}>
                  所屬小組：{activeGroup?.name} ｜ 活動時長：{activeSession.durationMinutes} 分鐘
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusChip status={activeSession.status} />
                <button
                  type="button"
                  onClick={handleTogglePublish}
                  className={activeSession.status === '已發布' ? 'btn-secondary' : 'btn-primary'}
                  style={{ minHeight: 38, fontSize: 'var(--text-sm)' }}
                >
                  {activeSession.status === '已發布' ? '撤回至待發布' : '確認發布場次'}
                </button>
              </div>
            </div>

            {/* 本次任務目標 */}
            <div style={{ backgroundColor: 'var(--bg-sand)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', display: 'block', marginBottom: 4 }}>
                🎯 本次共同任務目標
              </strong>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-primary)' }}>
                {activeSession.goal}
              </p>
            </div>

            {/* 成員出席登記 (FR-09) */}
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarCheck size={20} color="var(--primary)" />
                <span>小組成員出席登記 (FR-09)</span>
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginBottom: 12 }}>
                PRD 守則：請假或臨時缺席均需標記；缺席不自動視為不願參與。
              </p>

              {activeGroup && activeGroup.members.length > 0 ? (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>成員暱稱</th>
                        <th>目前出席標記</th>
                        <th>登記操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeGroup.members.map((member) => {
                        const status = activeSession.attendance[member.applicantId] || '未記錄';
                        return (
                          <tr key={member.applicantId}>
                            <td style={{ fontWeight: 600 }}>{member.nickname}</td>
                            <td>
                              <span className={`chip ${
                                status === '出席' ? 'chip-success' :
                                status === '缺席' ? 'chip-danger' :
                                status === '事先請假' ? 'chip-warning' : 'chip-neutral'
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(member.applicantId, '出席')}
                                  className={status === '出席' ? 'btn-primary' : 'btn-secondary'}
                                  style={{ minHeight: 32, padding: '0 8px', fontSize: '11px' }}
                                >
                                  出席
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(member.applicantId, '事先請假')}
                                  className={status === '事先請假' ? 'btn-primary' : 'btn-secondary'}
                                  style={{ minHeight: 32, padding: '0 8px', fontSize: '11px' }}
                                >
                                  請假
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleAttendanceChange(member.applicantId, '缺席')}
                                  className={status === '缺席' ? 'btn-primary' : 'btn-secondary'}
                                  style={{ minHeight: 32, padding: '0 8px', fontSize: '11px' }}
                                >
                                  缺席
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)' }}>尚未有成員分派至此小組</p>
              )}
            </div>

            {/* 共同協作紀錄與主持人摘要 (FR-10, §9) */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 8 }}>
                活動過程紀錄與協作摘要 (§9)
              </h3>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasCollaboration}
                    onChange={(e) => setHasCollaboration(e.target.checked)}
                    style={{ width: 18, height: 18 }}
                  />
                  <span style={{ fontWeight: 600 }}>本次活動有發生實質協作、角色分工或共同決策 (§9 互動指標)</span>
                </label>
              </div>

              <div>
                <label htmlFor="session-notes" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 4 }}>
                  主持人觀察紀錄（不記錄敏感聊天私訊，僅記活動脈絡）
                </label>
                <textarea
                  id="session-notes"
                  value={summaryNotes}
                  onChange={(e) => setSummaryNotes(e.target.value)}
                  placeholder="例如：全員順利進入空中花園，阿木與小禾分工鋪路，文字頻道討論熱絡..."
                  style={{ minHeight: 80 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button type="button" onClick={handleSaveNotes} className="btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>
                  <FloppyDisk size={18} />
                  <span>儲存紀錄</span>
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
