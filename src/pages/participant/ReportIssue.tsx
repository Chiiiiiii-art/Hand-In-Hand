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
      setError('請輸入問題情況描述，以便服務團隊能提供精確協助');
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
          活動問題回報與協助求助 (FR-11)
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
          無論是連線卡頓、操作按鍵衝突，或在活動中遇到不舒服的互動行為，您都可以透過此表單直接反映給後台管理者與主持人。
        </p>
      </div>

      {/* 隱私與安全提示 (PRD 4.3 不得要求在公開群組說明敏感細節) */}
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
          此回報為專責管理專員一對一接收處理。如為人際衝突或言行不當事件，我們將依安全規範介入處置，並保障您的發言不會在公開小組內曝光。
        </div>
      </div>

      {/* 回報表單 */}
      <form onSubmit={handleSubmit} noValidate className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="issue-applicant" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            回報身分
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
            <option value="互動與安全">互動與安全（音量不適、冒犯言論、同儕人際困擾等）</option>
            <option value="其他問題">其他問題（排程時間需協調、個人臨時狀況）</option>
          </select>
        </div>

        <div>
          <label htmlFor="issue-desc" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
            問題狀況描述 <span style={{ color: 'var(--accent)' }}>* (必填)</span>
          </label>
          <textarea
            id="issue-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="請簡述您遇到的狀況，例如：進入 Minecraft 伺服器時一直顯示 Connection Timed Out，或是手把按鍵無反應..."
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
            <span>送出回報</span>
            <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </form>

      {/* 我的案件紀錄清單 */}
      {myIssues.length > 0 && (
        <section aria-labelledby="history-title">
          <h2 id="history-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            我的回報紀錄與處理進度
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
                    <strong>服務團隊回覆：</strong>
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
