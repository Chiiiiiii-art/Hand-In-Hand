import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { IssueReport, IssueStatus } from '../../types';
import { StatusChip } from '../../components/StatusChip';
import { WarningCircle, CheckCircle, ShieldCheck, Clock, X } from '@phosphor-icons/react';

export const AdminIssues: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  const handleOpenModal = (iss: IssueReport) => {
    setSelectedIssue(iss);
    setAdminResponse(iss.adminResponse || '');
    setFollowUpPlan(iss.followUpPlan || '');
  };

  const handleUpdateStatus = (status: IssueStatus) => {
    if (!selectedIssue) return;

    dispatch({
      type: 'UPDATE_ISSUE_STATUS',
      id: selectedIssue.id,
      status,
      adminResponse: adminResponse.trim(),
      followUpPlan: followUpPlan.trim(),
    });

    setSelectedIssue(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
          事件回報與安全處置紀錄 (FR-12, BR-07)
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
          記錄技術障礙與社群互動安全事件。嚴格遵循隱私最小化原則，不將敏感事件公開。
        </p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>通報時間</th>
              <th>案件編號</th>
              <th>通報成員</th>
              <th>問題類別</th>
              <th>情況說明摘要</th>
              <th>當前狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {state.issues.map((iss) => {
              const applicant = state.applications.find(a => a.id === iss.applicantId);

              return (
                <tr key={iss.id}>
                  <td>{iss.submittedAt}</td>
                  <td><code>{iss.id}</code></td>
                  <td style={{ fontWeight: 600 }}>{applicant ? applicant.nickname : iss.applicantId}</td>
                  <td>
                    <span className={`chip ${iss.category === '互動與安全' ? 'chip-danger' : 'chip-info'}`} style={{ fontSize: '11px' }}>
                      {iss.category}
                    </span>
                  </td>
                  <td style={{ maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {iss.description}
                  </td>
                  <td>
                    <StatusChip status={iss.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenModal(iss)}
                      className="btn-secondary"
                      style={{ minHeight: 34, padding: '0 10px', fontSize: '12px' }}
                    >
                      處置 / 更新
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 處置彈窗 */}
      {selectedIssue && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="issue-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(25, 39, 45, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 id="issue-modal-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                  案件處置：{selectedIssue.id} ({selectedIssue.category})
                </h2>
                <div style={{ marginTop: 4 }}>
                  <StatusChip status={selectedIssue.status} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                aria-label="關閉"
                style={{ minHeight: 32, padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 案件內容 */}
            <div style={{ backgroundColor: 'var(--bg-sand)', padding: 14, borderRadius: 'var(--radius-md)', marginBottom: 16 }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)', marginBottom: 4 }}>
                通報時間：{selectedIssue.submittedAt} ｜ 提報人：{selectedIssue.applicantId}
              </div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-primary)' }}>
                {selectedIssue.description}
              </p>
            </div>

            {/* 處置表單 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div>
                <label htmlFor="issue-reply" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 4 }}>
                  回覆參與者之說明（參與者端可見）
                </label>
                <textarea
                  id="issue-reply"
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="例如：已安排技術志工協助排除延遲，並於活動前 10 分鐘進行線路測試..."
                  style={{ minHeight: 80 }}
                />
              </div>

              <div>
                <label htmlFor="issue-followup" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 4 }}>
                  內部後續追蹤與保護措施（限管理者紀錄，FR-12）
                </label>
                <textarea
                  id="issue-followup"
                  value={followUpPlan}
                  onChange={(e) => setFollowUpPlan(e.target.value)}
                  placeholder="例如：若為人際衝突，記錄是否需要主持人介入協調，或提供個別諮詢..."
                  style={{ minHeight: 80 }}
                />
              </div>
            </div>

            {/* 狀態切換按鈕 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
              <button
                type="button"
                onClick={() => handleUpdateStatus('處理中')}
                className={selectedIssue.status === '處理中' ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                標為處理中
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('已處理')}
                className={selectedIssue.status === '已處理' ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                完成結案 (已處理)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
