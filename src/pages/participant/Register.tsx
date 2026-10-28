import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store';
import { WarningCircle, CheckCircle, ShieldCheck, ArrowRight } from '@phosphor-icons/react';

interface FormErrors {
  nickname?: string;
  age?: string;
  contactInfo?: string;
  availableSlots?: string;
  inputMethod?: string;
  agreedRules?: string;
}

export const Register: React.FC = () => {
  const { dispatch } = useAppStore();
  const navigate = useNavigate();

  // 表單狀態
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState<number | ''>(25);
  const [contactInfo, setContactInfo] = useState('');
  const [shareContactConsent, setShareContactConsent] = useState(false);
  const [agreedRules, setAgreedRules] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [gamingExperience, setGamingExperience] = useState('');
  const [inputMethod, setInputMethod] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState<'文字為主' | '語音為主' | '兩者皆可'>('文字為主');
  const [supportNeeds, setSupportNeeds] = useState('');

  // 錯誤驗證狀態
  const [errors, setErrors] = useState<FormErrors>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const slotOptions = [
    '每週三晚間 19:30-21:00 (主要推薦時段)',
    '每週五晚間 20:00-21:30',
    '每週六下午 14:00-15:30',
    '每週日下午 15:00-16:30'
  ];

  const handleSlotToggle = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // 必填驗證（FR-02, BR-01, BR-02）
    if (!nickname.trim()) {
      newErrors.nickname = '請輸入您想在小組中被稱呼的暱稱';
    }
    if (age === '' || age < 18) {
      newErrors.age = '依服務規範（BR-01），參與者需年滿 18 歲';
    }
    if (!contactInfo.trim()) {
      newErrors.contactInfo = '請提供聯絡方式（Email 或 LINE），以便進行一對一可及性確認';
    }
    if (selectedSlots.length === 0) {
      newErrors.availableSlots = '請至少勾選一個您可以參與的時段';
    }
    if (!inputMethod.trim()) {
      newErrors.inputMethod = '請填寫您偏好的操作方式（如滑鼠、手把或特定輔具）';
    }
    if (!agreedRules) {
      newErrors.agreedRules = '請閱讀並同意社群守則（BR-02）後送出';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // 依無障礙要求：錯誤時聚焦至錯誤摘要區
      setTimeout(() => {
        errorSummaryRef.current?.focus();
      }, 50);
      return;
    }

    // 驗證通過，送出資料
    dispatch({
      type: 'SUBMIT_APPLICATION',
      application: {
        nickname: nickname.trim(),
        age: Number(age),
        contactInfo: contactInfo.trim(),
        shareContactConsent,
        agreedRules,
        availableSlots: selectedSlots,
        gamingExperience: gamingExperience.trim() || '初次接觸',
        inputMethod: inputMethod.trim(),
        communicationPreference,
        supportNeeds: supportNeeds.trim() || '無特殊需求',
      }
    });

    // 跳轉至狀態頁
    navigate('/my-status');
  };

  const handleFillDemo = () => {
    setNickname('測試小飛');
    setAge(26);
    setContactInfo('xiaofei@example.com');
    setShareContactConsent(false);
    setSelectedSlots(['每週三晚間 19:30-21:00 (主要推薦時段)']);
    setGamingExperience('曾玩過 Minecraft 創造模式與建造冒險');
    setInputMethod('單手軌跡球 + 螢幕虛擬鍵盤');
    setCommunicationPreference('文字為主');
    setSupportNeeds('語音聽力良好，操作需稍多指令反應時間');
    setAgreedRules(true);
    setErrors({});
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            參與需求與報名登記 (FR-02)
          </h1>
          <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)' }}>
            請填寫您的基本資訊與操作偏好。送出後，服務團隊會在一對一確認後為您安排固定小組。
          </p>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="btn btn-secondary"
          id="btn-fill-demo"
          style={{ whiteSpace: 'nowrap', marginTop: 4 }}
        >
          一鍵帶入示範資料（測試小飛）
        </button>
      </div>

      {/* 錯誤摘要看板 (無障礙與情境 6.2 申請資料不完整驗證) */}
      {hasErrors && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-title"
          style={{
            backgroundColor: 'var(--status-danger-bg)',
            border: '2px solid var(--status-danger-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--status-danger-ink)', fontWeight: 700, marginBottom: 8 }} id="error-summary-title">
            <WarningCircle size={24} weight="fill" />
            <span>報名表尚有 {Object.keys(errors).length} 項需要補充或修正：</span>
          </div>
          <ul style={{ paddingLeft: 'var(--space-6)', color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
            {errors.nickname && <li>{errors.nickname}</li>}
            {errors.age && <li>{errors.age}</li>}
            {errors.contactInfo && <li>{errors.contactInfo}</li>}
            {errors.availableSlots && <li>{errors.availableSlots}</li>}
            {errors.inputMethod && <li>{errors.inputMethod}</li>}
            {errors.agreedRules && <li>{errors.agreedRules}</li>}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* 基本資訊 */}
        <fieldset style={{ border: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <legend style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--primary)' }}>
            1. 基本資訊
          </legend>

          <div>
            <label htmlFor="field-nickname" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              社群暱稱 <span style={{ color: 'var(--accent)' }}>* (必填)</span>
            </label>
            <input
              id="field-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例如：小禾、SkyWalker"
              aria-invalid={!!errors.nickname}
              aria-describedby={errors.nickname ? 'error-nickname' : undefined}
            />
            {errors.nickname && (
              <p id="error-nickname" style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {errors.nickname}
              </p>
            )}
            <small style={{ color: 'var(--ink-secondary)', display: 'block', marginTop: 4 }}>
              此暱稱將公開於小組成員名單，不需填寫真實姓名。
            </small>
          </div>

          <div>
            <label htmlFor="field-age" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              年齡 <span style={{ color: 'var(--accent)' }}>* (必填，需年滿 18 歲)</span>
            </label>
            <input
              id="field-age"
              type="number"
              min="18"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              aria-invalid={!!errors.age}
              aria-describedby={errors.age ? 'error-age' : undefined}
            />
            {errors.age && (
              <p id="error-age" style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {errors.age}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-contact" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              一對一聯絡管道 <span style={{ color: 'var(--accent)' }}>* (必填，限管理專員可見)</span>
            </label>
            <input
              id="field-contact"
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="例如：LINE ID: myline2026 或 Email: me@example.com"
              aria-invalid={!!errors.contactInfo}
              aria-describedby={errors.contactInfo ? 'error-contact' : undefined}
            />
            {errors.contactInfo && (
              <p id="error-contact" style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {errors.contactInfo}
              </p>
            )}
            <small style={{ color: 'var(--ink-secondary)', display: 'block', marginTop: 4 }}>
              僅供初次測試通知與緊急備援使用，絕不公開。
            </small>
          </div>

          <div style={{ marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
              <input
                type="checkbox"
                checked={shareContactConsent}
                onChange={(e) => setShareContactConsent(e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              <span>我自願同意在未來活動外，向同組成員分享聯絡方式（非必要條件 BR-08）</span>
            </label>
          </div>
        </fieldset>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* 可及性與偏好 */}
        <fieldset style={{ border: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <legend style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--primary)' }}>
            2. 可及性與互動偏好
          </legend>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
              可參與時段 <span style={{ color: 'var(--accent)' }}>* (可複選)</span>
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {slotOptions.map((slot) => (
                <label key={slot} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedSlots.includes(slot)}
                    onChange={() => handleSlotToggle(slot)}
                    style={{ width: 20, height: 20 }}
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
            {errors.availableSlots && (
              <p style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {errors.availableSlots}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-input" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              您預計使用的操作設備與方式 <span style={{ color: 'var(--accent)' }}>* (必填)</span>
            </label>
            <input
              id="field-input"
              type="text"
              value={inputMethod}
              onChange={(e) => setInputMethod(e.target.value)}
              placeholder="例如：筆電普通滑鼠、單手微軟手把、特殊軌跡球、眼控設備"
              aria-invalid={!!errors.inputMethod}
            />
            {errors.inputMethod && (
              <p style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                {errors.inputMethod}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-comm" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              活動溝通偏好 (BR-05 文字與語音平等)
            </label>
            <select
              id="field-comm"
              value={communicationPreference}
              onChange={(e) => setCommunicationPreference(e.target.value as any)}
            >
              <option value="文字為主">文字為主（不開麥克風，主持人與隊友同步文字支援）</option>
              <option value="語音為主">語音為主（使用 Discord 語音通話）</option>
              <option value="兩者皆可">兩者皆可（依活動情況彈性調整）</option>
            </select>
          </div>

          <div>
            <label htmlFor="field-needs" style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>
              希望服務團隊留意或協助的事項（免填診斷）
            </label>
            <textarea
              id="field-needs"
              value={supportNeeds}
              onChange={(e) => setSupportNeeds(e.target.value)}
              placeholder="例如：移動游標較慢需要耐心等候、活動中途需暫停伸展 5 分鐘、需要大字體指引等。（不要求提供醫療診斷 BR-09）"
            />
          </div>
        </fieldset>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />

        {/* 守則同意 */}
        <div style={{ backgroundColor: 'var(--bg-sand-darker)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreedRules}
              onChange={(e) => setAgreedRules(e.target.checked)}
              style={{ width: 22, height: 22, marginTop: 2 }}
              aria-invalid={!!errors.agreedRules}
            />
            <div>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-base)' }}>
                我已閱讀並同意「攜手基地參與守則與社群安全規範」(BR-02)
              </span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-secondary)', marginTop: 4 }}>
                包含尊重文字與語音溝通、共同維護友善環境、私下聯繫自願原則等。
              </p>
              {errors.agreedRules && (
                <p style={{ color: 'var(--status-danger-ink)', fontSize: 'var(--text-sm)', marginTop: 4 }}>
                  {errors.agreedRules}
                </p>
              )}
            </div>
          </label>
        </div>

        {/* 送出按鈕 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button type="submit" className="btn-primary" style={{ padding: '12px 32px' }}>
            <span>確認無誤，送出申請</span>
            <ArrowRight size={20} weight="bold" />
          </button>
        </div>
      </form>
    </div>
  );
};
