import React from 'react';
import { SimBadge } from '../components/SimBadge';
import { CheckCircle, Sparkle } from '@phosphor-icons/react';

export const Acceptance: React.FC = () => {
  const requirements = [
    { id: 'FR-01', name: '服務資訊與參與條件', level: 'P0', location: '首頁 (/)、參與守則與常見問答 (/rules)', proof: '清楚說明服務目的、對象、活動方式、規則與常見問答。' },
    { id: 'FR-02', name: '報名與需求提交', level: 'P0', location: '報名參與頁 (/register)', proof: '必填檢查（缺漏時顯示錯誤摘要）、送出後即時反映、支援操作偏好與溝通偏好。' },
    { id: 'FR-03', name: '申請狀態顯示', level: 'P0', location: '我的狀態頁 (/my-status)', proof: '顯示待確認、需後續聯繫、可安排、已入組，每種狀態皆有文字詳細解讀。' },
    { id: 'FR-04', name: '申請審查與管理', level: 'P0', location: '後台申請審查 (/admin/applications)', proof: '管理者可檢視申請內容、標記需後續聯繫、更新處理狀態。' },
    { id: 'FR-05', name: '可及性與操作確認', level: 'P0', location: '審查彈窗、我的狀態頁', proof: '4 項事前可及性檢核（設備、操作、溝通、支援需求），區分待確認與需調整，不要求診斷。' },
    { id: 'FR-06', name: '固定小組安排', level: 'P0', location: '固定小組管理 (/admin/groups)', proof: '將符合資格成員安排進 6-8 人固定小組，前台參與者端即時顯示同組成員暱稱。' },
    { id: 'FR-07', name: '活動排程與任務資訊', level: 'P0', location: '場次排程 (/admin/sessions)', proof: '8 週場次清單、共同目標、主持人、待發布/已發布狀態切換。' },
    { id: 'FR-08', name: '活動加入指引', level: 'P0', location: '我的狀態頁活動卡片 (/my-status)', proof: '包含連線遊戲平台、伺服器地址、語音/文字頻道、逐步指引與備援聯絡方式。' },
    { id: 'FR-09', name: '出席紀錄', level: 'P0', location: '場次出席登記 (/admin/sessions)', proof: '記錄出席、缺席、事先請假，即時計算出席率並排除取消場次。' },
    { id: 'FR-10', name: '活動回饋', level: 'P0', location: '活動回饋頁 (/feedback)', proof: '參與者提交活動滿意度、同儕連結感自評、協作感受與下次參與意願。' },
    { id: 'FR-11', name: '問題回報', level: 'P0', location: '問題求助頁 (/report-issue)', proof: '分類技術、互動安全與其他問題，一對一保護隱私，不在公開群組說明。' },
    { id: 'FR-12', name: '事件處理紀錄', level: 'P0', location: '事件處理紀錄 (/admin/issues)', proof: '管理者記錄事件處置說明、內部後續安排，更新新案件/處理中/已處理。' },
    { id: 'FR-13', name: '服務摘要儀表板', level: 'P0', location: '服務儀表板 (/admin/dashboard)', proof: '申請入組數、出席率、重複參與率、同儕連結感均分，嚴格標示計算口徑。' },
    { id: 'FR-14', name: '結束後追蹤', level: 'P0', location: '回饋頁追蹤分頁、後續追蹤 (/admin/follow-up)', proof: '8 週結束後聯繫意願自評，未回覆與負面分開計算。' },
    { id: 'FR-15', name: '活動提醒', level: 'P1', location: '儀表板頂部按鈕 (/admin/dashboard)', proof: '模擬發送開場前 1 小時提醒廣播，標記模擬狀態。' },
    { id: 'FR-16', name: '資料匯出', level: 'P1', location: '儀表板「匯出/複製彙總」按鈕', proof: '一鍵複製服務成效文字彙總至剪貼簿，不包含個人敏感資料。' },
  ];

  const businessRules = [
    { id: 'BR-01', name: '成年資格', proof: '報名表檢驗滿 18 歲，未達者禁止送出。' },
    { id: 'BR-02', name: '參與同意', proof: '必須勾選同意參與守則後才可送出申請。' },
    { id: 'BR-03', name: '固定小組', proof: '以固定小組為單位活動，支持持續同儕連結。' },
    { id: 'BR-04', name: '平台可及性', proof: '後台設定「可安排」前，必須通過 4 項可及性檢核。' },
    { id: 'BR-05', name: '參與方式選擇', proof: '文字與語音平等對待，不以開麥為唯一條件。' },
    { id: 'BR-06', name: '私人空間與權限', proof: '伺服器資訊與指引僅提供予已入組成員。' },
    { id: 'BR-07', name: '安全處理', proof: '專門事件處理流程，保護成員安全並記錄處置。' },
    { id: 'BR-08', name: '活動外聯繫', proof: '分享聯絡方式設為非必要自願勾選。' },
    { id: 'BR-09', name: '資料最小化', proof: '不收集醫療診斷證明，僅收集操作方式。' },
    { id: 'BR-10', name: 'PoC 資料', proof: '全站使用虛構示範資料與標示模擬。' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>
            PRD 需求與驗收條件對照清單 (FR-01 ~ FR-16)
          </h1>
          <SimBadge label="100% 覆蓋驗收基準" />
        </div>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
          嚴格對應 PRD 第 5 章功能需求與第 7 章業務規則。每個項目皆有具體畫面、驗證方式與狀態對照。
        </p>
      </div>

      <section className="card">
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          功能需求 (FR) 對照表
        </h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>需求名稱</th>
                <th>層級</th>
                <th>實作頁面位置</th>
                <th>PoC 驗收成果證明</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id}>
                  <td><code>{req.id}</code></td>
                  <td style={{ fontWeight: 600 }}>{req.name}</td>
                  <td>
                    <span className={`chip ${req.level === 'P0' ? 'chip-success' : 'chip-info'}`} style={{ fontSize: '11px' }}>
                      {req.level}
                    </span>
                  </td>
                  <td>{req.location}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 'var(--text-sm)' }}>
                      <CheckCircle size={16} color="var(--primary)" weight="fill" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span>{req.proof}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          業務規則與服務政策 (BR) 對照表
        </h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>規則 ID</th>
                <th>規則名稱</th>
                <th>實作對應機制</th>
              </tr>
            </thead>
            <tbody>
              {businessRules.map((br) => (
                <tr key={br.id}>
                  <td><code>{br.id}</code></td>
                  <td style={{ fontWeight: 600 }}>{br.name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
                      <CheckCircle size={16} color="var(--primary)" weight="fill" style={{ flexShrink: 0 }} />
                      <span>{br.proof}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
