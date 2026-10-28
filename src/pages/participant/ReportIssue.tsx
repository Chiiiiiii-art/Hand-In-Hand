import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { IssueCategory } from '../../types';
import { ShieldCheck, WarningCircle, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { StatusChip } from '../../components/StatusChip';

export const ReportIssue: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();

  const applicant = state.applications.find(a => a.id === state.currentParticipantId);

  const [category, setCategory] = useState<IssueCategory>('技術問題');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // 參與者過去提交的案件
  const myIssues = state.issues.filter(i => i.applicantId === state.currentParticipantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('請簡短描述你遇到的狀況，方便小幫手盡快為你排除');
      return;
    }

    dispatch({
      type: 'SUBMIT_ISSUE',
      issue: {
        applicantId: state.currentParticipantId,
        category,
        description: description.trim(),
      }
    });

    setDescription('');
    setError('');
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          安心求助與小幫手私訊
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
          無論遇到連線卡頓、操作按鍵衝突，或在小隊中感到不自在、遇到不舒服的發言，都可以透過這個私密管道告訴小幫手。
        </p>
      </div>

      {/* 隱私與安全提示 */}
      <div
        style={{
          backgroundColor: 'var(--status-info-bg)',
          border: '1.5px solid var(--status-info-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <ShieldCheck size={26} color="var(--status-info-ink)" weight="fill" style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--status-info-ink)' }}>
          <strong>安全與隱私承諾：</strong>
          求助訊息由專屬小幫手一對一私下接收與處置。若涉及小隊內的人際困擾，我們會主動介入協調，絕不會在小隊公開頻道透露你的求助內容。
        </div>
      </div>

      {/* 求助表單 */}
      <form onSubmit={handleSubmit} noValidate className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="issue-applicant" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            求助隊友
          </label>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--primary)' }}>
            {applicant ? applicant.nickname : '訪客'} <code>({state.currentParticipantId})</code>
          </div>
        </div>

        <div>
          <label htmlFor="issue-category" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            問題類別
          </label>
          <select
            id="issue-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as IssueCategory)}
          >
            <option value="技術問題">技術問題（遊戲無法連線、延遲卡頓、輔具鍵位衝突等）</option>
            <option value="互動與安全">人際與互動感受（對話感到不適、音量或節奏困擾等）</option>
            <option value="其他問題">其他狀況（聚會請假、時間微調、其他個人狀況）</option>
          </select>
        </div>

        <div>
          <label htmlFor="issue-desc" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            狀況描述 <span style={{ color: 'var(--accent)' }}>* (必填)</span>
          </label>
          <textarea
            id="issue-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="請告訴小幫手你遇到的情況，例如：進入 Minecraft 伺服器一直超時，或是手把特定按鍵卡住了..."
            style={{ minHeight: 120 }}
            aria-invalid={!!error}
          />
          {error && (
            <p style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
              {error}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
            <span>送出求助訊息</span>
            <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </form>

      {/* 我的案件紀錄清單 */}
      {myIssues.length > 0 && (
        <section aria-labelledby="history-title">
          <h2 id="history-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            我的求助紀錄與小幫手回覆
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {myIssues.map((iss) => (
              <div key={iss.id} className="card" style={{ backgroundColor: 'var(--surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="chip chip-info" style={{ fontSize: 'var(--text-xs)' }}>{iss.category}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-secondary)' }}>{iss.submittedAt}</span>
                  </div>
                  <StatusChip status={iss.status} />
                </div>

                <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-primary)', marginBottom: 12 }}>
                  {iss.description}
                </p>

                {iss.adminResponse && (
                  <div style={{ backgroundColor: 'var(--bg-sand)', padding: 12, borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)', fontSize: 'var(--text-sm)' }}>
                    <strong>小幫手回覆：</strong>
                    <p style={{ marginTop: 2 }}>{iss.adminResponse}</p>
                    {iss.handledAt && (
                      <span style={{ fontSize: '11px', color: 'var(--ink-muted)', display: 'block', marginTop: 4 }}>
                        處理時間：{iss.handledAt}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
