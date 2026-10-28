import React from 'react';
import { useAppStore } from '../../store';
import { StatusChip } from '../../components/StatusChip';
import { SimBadge } from '../../components/SimBadge';
import { CheckCircle, Clock, Heart, UsersThree } from '@phosphor-icons/react';

export const AdminFollowUp: React.FC = () => {
  const { state } = useAppStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
            結束後續追蹤管理 (FR-14)
          </h1>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
            追蹤 8 週活動完成後成員之同儕聯繫意願與服務回饋。嚴格落實未回覆不作負面推估。
          </p>
        </div>
        <SimBadge label="持續性指標 (§9)" />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>成員暱稱</th>
              <th>追蹤狀態</th>
              <th>結束後仍有聯繫意願</th>
              <th>生活滿意度自評</th>
              <th>提交時間</th>
              <th>回饋文字</th>
            </tr>
          </thead>
          <tbody>
            {state.followUps.map((fu) => {
              const applicant = state.applications.find(a => a.id === fu.applicantId);

              return (
                <tr key={fu.applicantId}>
                  <td style={{ fontWeight: 600 }}>{applicant ? applicant.nickname : fu.applicantId}</td>
                  <td>
                    <StatusChip status={fu.status} />
                  </td>
                  <td>
                    {fu.willingToStayInTouch === null ? (
                      <span style={{ color: 'var(--ink-muted)' }}>待回覆</span>
                    ) : fu.willingToStayInTouch ? (
                      <span style={{ color: 'var(--status-success-ink)', fontWeight: 600 }}>願意保持聯繫</span>
                    ) : (
                      <span style={{ color: 'var(--ink-secondary)' }}>暫無意願</span>
                    )}
                  </td>
                  <td>
                    {fu.overallSatisfaction !== null ? (
                      <span>{fu.overallSatisfaction} / 5 分</span>
                    ) : (
                      <span style={{ color: 'var(--ink-muted)' }}>-</span>
                    )}
                  </td>
                  <td>{fu.submittedAt || '-'}</td>
                  <td style={{ maxWidth: 300 }}>
                    {fu.feedbackText || <span style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>尚未填寫</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
