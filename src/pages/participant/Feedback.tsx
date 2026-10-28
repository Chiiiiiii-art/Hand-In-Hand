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
          聚會悄悄話與心情日記
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
          填寫隊友：<strong>{applicant ? applicant.nickname : '訪客'}</strong>
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
          本週聚會心情
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('followup')}
          className={activeTab === 'followup' ? 'btn-primary' : 'btn-secondary'}
          style={{ minHeight: 40 }}
        >
          8 週小隊畢業感想
        </button>
      </div>

      {activeTab === 'session' ? (
        <form onSubmit={handleSessionFeedbackSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div>
            <label htmlFor="fb-session" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              選擇聚會場次
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
              今天玩得開心嗎？（整體滿意度 1-5 分）
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
              今天跟小隊隊友互動的感覺如何？（1 分覺得生疏，5 分像認識很久的好朋友）
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
              隨心評分即可，有助於我們為大家打造更舒適的聚會步調。
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
              <span style={{ fontWeight: 600 }}>我很享受今天跟隊友一起建造、分工合作的過程</span>
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
              <span style={{ fontWeight: 600 }}>我期待下週繼續跟固定隊友一起聚會</span>
            </label>
          </div>

          <div>
            <label htmlFor="fb-comment" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              想對引導員或隊友說的悄悄話（選填）
            </label>
            <textarea
              id="fb-comment"
              value={freeComment}
              onChange={(e) => setFreeComment(e.target.value)}
              placeholder="例如：今天一起蓋的水上花園超美！或是希望下次能先介紹怎麼領取建材..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              <span>送出聚會悄悄話</span>
              <ArrowRight size={20} weight="bold" />
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleFollowUpSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
              8 週小隊畢業感想
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)' }}>
              恭喜完成 8 週的小隊冒險！花 2 分鐘聊聊這段時間的陪伴感受，你的心聲能讓攜手基地的客廳更溫暖。
            </p>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              8 週聚會告一段落後，你願意與小隊夥伴私下保持自願聯絡嗎？
            </label>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="willingContact"
                  checked={willingToStayInTouch === true}
                  onChange={() => setWillingToStayInTouch(true)}
                />
                <span>非常願意（已經私下交換聯絡方式，或約好要繼續一起同玩）</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="willingContact"
                  checked={willingToStayInTouch === false}
                  onChange={() => setWillingToStayInTouch(false)}
                />
                <span>先不用（比較喜歡在每週固定聚會時跟大家一起玩）</span>
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              這 8 週的每週聚會，帶給你的心情放鬆與陪伴感受 (1-5 分)
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
              想對大家或給未來新隊友的話
            </label>
            <textarea
              id="followup-text"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              placeholder="分享這段時間的收穫、認識隊友的心情，或是希望攜手基地未來還能增加什麼新玩法..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              <span>送出畢業感想</span>
              <CheckCircle size={20} weight="fill" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
