import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Star, Heart, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { SimBadge } from '../../components/SimBadge';

export const ParticipantFeedback: React.FC = () => {
  const { state, dispatch } = useAppStore();

  const applicant = state.applications.find(a => a.id === state.currentParticipantId);

  // 回饋表單狀態
  const [selectedSessionId, setSelectedSessionId] = useState(
    state.sessions[0]?.id || 'ses-01'
  );
  const [overallRating, setOverallRating] = useState(5);
  const [peerConnectionFeeling, setPeerConnectionFeeling] = useState(5);
  const [enjoyedCoop, setEnjoyedCoop] = useState(true);
  const [wantsNextSession, setWantsNextSession] = useState(true);
  const [freeComment, setFreeComment] = useState('');

  // 結束後追蹤自評 (FR-14)
  const [willingToStayInTouch, setWillingToStayInTouch] = useState<boolean>(true);
  const [followUpSatisfaction, setFollowUpSatisfaction] = useState<number>(5);
  const [followUpText, setFollowUpText] = useState('');

  const [activeTab, setActiveTab] = useState<'session' | 'followup'>('session');

  const handleSessionFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SUBMIT_FEEDBACK',
      feedback: {
        sessionId: selectedSessionId,
        applicantId: state.currentParticipantId,
        overallRating,
        peerConnectionFeeling,
        enjoyedCoop,
        wantsNextSession,
        freeComment: freeComment.trim(),
      }
    });
    setFreeComment('');
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SUBMIT_FOLLOW_UP',
      record: {
        applicantId: state.currentParticipantId,
        status: '追蹤已完成',
        willingToStayInTouch,
        overallSatisfaction: followUpSatisfaction,
        submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        feedbackText: followUpText.trim(),
      }
    });
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
          活動體驗與同儕連結回饋 (FR-10, FR-14)
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
          目前的填寫身分：<strong>{applicant ? applicant.nickname : '訪客'}</strong>
        </p>
      </div>

      {/* 分頁按鈕 */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '2px solid var(--border)', paddingBottom: 4 }}>
        <button
          type="button"
          onClick={() => setActiveTab('session')}
          className={activeTab === 'session' ? 'btn-primary' : 'btn-secondary'}
          style={{ minHeight: 40 }}
        >
          單場活動回饋 (FR-10)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={activeTab === 'followup' ? 'btn-primary' : 'btn-secondary'}
          style={{ minHeight: 40 }}
        >
          8 週結束後續追蹤 (FR-14)
        </button>
      </div>

      {activeTab === 'session' ? (
        <form onSubmit={handleSessionFeedbackSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div>
            <label htmlFor="fb-session" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              選擇活動場次
            </label>
            <select
              id="fb-session"
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
            >
              {state.sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.scheduledAt})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              整體活動體驗滿意度 (1-5 分)
            </label>
            <div style={{ display: 'flex', gap: 16 }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="overallRating"
                    value={val}
                    checked={overallRating === val}
                    onChange={() => setOverallRating(val)}
                  />
                  <span>{val} 分</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              同儕連結感／歸屬感自評 (PRD §9 成效衡量重要指標)
            </label>
            <div style={{ display: 'flex', gap: 16 }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="peerConnection"
                    value={val}
                    checked={peerConnectionFeeling === val}
                    onChange={() => setPeerConnectionFeeling(val)}
                  />
                  <span>{val} 分</span>
                </label>
              ))}
            </div>
            <small style={{ color: 'var(--ink-secondary)', display: 'block', marginTop: 4 }}>
              1 分代表完全疏離；5 分代表強烈感受到被小組夥伴接納與連結。
            </small>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enjoyedCoop}
                onChange={(e) => setEnjoyedCoop(e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span style={{ fontWeight: 600 }}>我享受本次共同建造與協作任務的過程</span>
            </label>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={wantsNextSession}
                onChange={(e) => setWantsNextSession(e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span style={{ fontWeight: 600 }}>我有意願繼續參加下週的固定小組活動</span>
            </label>
          </div>

          <div>
            <label htmlFor="fb-comment" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              自由想對主持或夥伴說的話（選填）
            </label>
            <textarea
              id="fb-comment"
              value={freeComment}
              onChange={(e) => setFreeComment(e.target.value)}
              placeholder="例如：今天的水上花園很漂亮！或是希望下次能先介紹建材用法..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              <span>提交單場回饋</span>
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFollowUpSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
              8 週試辦週期結束追蹤自評 (FR-14)
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)' }}>
              此調查用於評估同儕支持之持續性，統計時將未回覆與自願回覆獨立計算，不作為負面懲罰。
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              活動週期結束後，您是否願意與小組成員繼續保持自願聯繫？ (持續性指標 §9)
            </label>
            <div style={{ display: 'flex', gap: 24 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="willingContact"
                  checked={willingToStayInTouch === true}
                  onChange={() => setWillingToStayInTouch(true)}
                />
                <span>非常願意（已自願互留聯絡方式或私下約好繼續同玩）</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="willingContact"
                  checked={willingToStayInTouch === false}
                  onChange={() => setWillingToStayInTouch(false)}
                />
                <span>目前暫無意願（偏好僅在官方活動期間交流）</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              這 8 週同儕活動對您日常生活的正面心理影響程度 (1-5 分)
            </label>
            <div style={{ display: 'flex', gap: 16 }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="followUpSat"
                    value={val}
                    checked={followUpSatisfaction === val}
                    onChange={() => setFollowUpSatisfaction(val)}
                  />
                  <span>{val} 分</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="followup-text" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              總結回饋與給後續梯次的建議
            </label>
            <textarea
              id="followup-text"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              placeholder="分享這段時間的成長、結交朋友的心情，或任何平台可改進之處..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              <span>提交 8 週後續追蹤</span>
              <CheckCircle size={20} weight="fill" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
