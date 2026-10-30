import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { UsersThree, UserPlus, ShieldCheck, CheckCircle } from '@phosphor-icons/react';
import { StatusChip } from '../../components/StatusChip';
import { SimBadge } from '../../components/SimBadge';

export const AdminGroups: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const [selectedGroupId, setSelectedGroupId] = useState(state.groups[0]?.id || 'grp-01');
  const [selectedApplicantId, setSelectedApplicantId] = useState('');

  // 篩選出目前「可安排」或尚未入組的申請人
  const availableApplicants = state.applications.filter(
    (a) => a.status === '可安排' || (!a.assignedGroupId && a.status !== '已入組')
  );

  const activeGroup = state.groups.find((g) => g.id === selectedGroupId);

  const handleAssignMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicantId || !selectedGroupId) return;

    dispatch({
      type: 'ASSIGN_GROUP',
      applicantId: selectedApplicantId,
      groupId: selectedGroupId,
    });

    setSelectedApplicantId('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
          固定同儕小組管理
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
          固定小組原則：每組維持 6-8 人穩定成員，支持在每週相聚中逐步熟悉並自然建立深厚友誼。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* 左側：現有小組清單 */}
        <section className="card">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UsersThree size={24} color="var(--primary)" />
            <span>目前小組清單 ({state.groups.length})</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {state.groups.map((group) => {
              const isSelected = group.id === selectedGroupId;
              return (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  style={{
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                      {group.name}
                    </h3>
                    <span className="chip chip-info" style={{ fontSize: 'var(--text-xs)' }}>
                      {group.members.length} / 8 位成員
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)' }}>
                    固定時段：{group.fixedTimeSlot}
                  </p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: 4 }}>
                    活動主持：{group.hostName} ｜ 備援：{group.backupContact}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 右側：成員管理與入組指派 */}
        <section className="card">
          {activeGroup ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                  【{activeGroup.name}】成員名單
                </h2>
                <SimBadge label="6-8 人固定編制" />
              </div>

              {/* 成員列表 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--space-6)' }}>
                {activeGroup.members.map((m, idx) => {
                  const memberApp = state.applications.find(a => a.id === m.applicantId);
                  return (
                    <div
                      key={m.applicantId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-sand)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      <div>
                        <strong>{idx + 1}. {m.nickname}</strong>
                        {m.role === '小組長' && <span style={{ marginLeft: 6, color: 'var(--primary)', fontWeight: 700 }}>🌟 (小組長)</span>}
                        {memberApp && (
                          <span style={{ fontSize: '11px', color: 'var(--ink-secondary)', display: 'block' }}>
                            操作：{memberApp.inputMethod} ｜ 溝通：{memberApp.communicationPreference}
                          </span>
                        )}
                      </div>
                      <span className="chip chip-success" style={{ fontSize: '11px' }}>已入組</span>
                    </div>
                  );
                })}
              </div>

              {/* 指派新成員入組表單 */}
              <form onSubmit={handleAssignMember} style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 8, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <UserPlus size={18} />
                  <span>指派符合資格的成員加入本組</span>
                </h3>

                {availableApplicants.length > 0 ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <select
                      value={selectedApplicantId}
                      onChange={(e) => setSelectedApplicantId(e.target.value)}
                      style={{ flex: 1, minWidth: 200 }}
                    >
                      <option value="">-- 請選擇待分組成員 --</option>
                      {availableApplicants.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.nickname} (狀態: {app.status} / {app.inputMethod})
                        </option>
                      ))}
                    </select>

                    <button type="submit" disabled={!selectedApplicantId} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                      確認入組
                    </button>
                  </div>
                ) : (
                  <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-sm)' }}>
                    目前無「可安排」狀態之申請人。請先至審查頁完成可及性測試。
                  </p>
                )}
              </form>
            </div>
          ) : (
            <p>請先由左側選取小組</p>
          )}
        </section>
      </div>
    </div>
  );
};
