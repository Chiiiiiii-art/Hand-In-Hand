import React from 'react';
import { SimBadge } from '../components/SimBadge';
import { CheckCircle, Sparkle } from '@phosphor-icons/react';

export const Acceptance: React.FC = () => {
  const requirements = [
    { id: 'FR-01', name: '小組基地首頁', level: 'P0', location: '參與者首頁 (/)', proof: '顯示固定小組名、天空翠鳥基地名稱、上次水上花園成果、下次活動與共同目標，非純場次表單。' },
    { id: 'FR-02', name: '共同世界／成果延續', level: 'P0', location: '基地首頁成果卡 (/), 待延續清單', proof: '檢視第 1 週與第 2 週成果（景觀台、水上步道）、待完成項目清單，刷新後資料本機持續保存。' },
    { id: 'FR-03', name: '合作任務板', level: 'P0', location: '基地首頁任務區塊 (/)', proof: '第 3 週任務「基地無障礙迎賓入口」，具備清楚團隊目標、步驟進程與成果說明。' },
    { id: 'FR-04', name: '提案與共同決策', level: 'P0', location: '任務板提案投票卡片 (/)', proof: '支援發表新提案、檢視小禾/阿木/海風提案並投票，即時計算票數最高並更新為小組共同決策。' },
    { id: 'FR-05', name: '貢獻方式選擇與切換', level: 'P0', location: '任務板貢獻方式切換器 (/)', proof: '提供直接操作、設計方案、建材歸納、文字協調 4 種方式，可自主隨時切換，不依障礙分類。' },
    { id: 'FR-06', name: '求助／暫停／重新加入', level: 'P0', location: '基地首頁求助按鈕、主持人控制台 (/host/console)', proof: '參與者一鍵求助，主持人控制台即時接收並一鍵回覆支援，前台即刻顯示已收到協助。' },
    { id: 'FR-07', name: '低壓力交流與回顧', level: 'P0', location: '基地首頁回顧區塊 (/)', proof: '提供共同決策與下次期待對話提示，每題允許自由略過跳過，不強迫揭露個資或創傷。' },
    { id: 'FR-08', name: '共同記憶／活動摘要', level: 'P0', location: '基地首頁共同成果卡 (/)', proof: '活動後自動生成小組決策成果摘要（選定入口風格、採納想法、下次接續內容），不存完整聊天。' },
    { id: 'FR-09', name: '下次活動共同計畫', level: 'P0', location: '下次計畫卡片 (/)', proof: '小組成員投票選擇下次共同目標（高架鐵路 vs 藏寶閣），即時呈現小組共識首選。' },
    { id: 'FR-10', name: '參與偏好與支持設定', level: 'P0', location: '偏好設定與狀態頁 (/my-status)', proof: '可設定文字/語音偏好、操作工具與休息需求，不要求診斷證明，僅授權主持人查看。' },
    { id: 'FR-11', name: '主持人任務編排器', level: 'P0', location: '主持人任務編排器 (/host/tasks)', proof: '主持人選取 8 週範本、填寫團隊目標、多元貢獻選項與發布前規則檢核。' },
    { id: 'FR-12', name: '主持人活動控制台', level: 'P0', location: '主持人控制台 (/host/console)', proof: '即時檢視成員貢獻途徑、處置待回應求助、觀察小組互動，絕無個人社交打分。' },
    { id: 'FR-13', name: '固定小組與場次管理', level: 'P0', location: '管理者後台 (/admin/groups, /admin/sessions)', proof: '管理者維持固定小組與場次排程能力，退居支援層不干擾參與者主頁。' },
    { id: 'FR-14', name: '安全事件回報與管理', level: 'P0', location: '問題求助頁 (/report-issue), 後台 (/admin/issues)', proof: '參與者私密回報技術或互動問題，一對一處置，不在公開小組揭露敏感資訊。' },
    { id: 'FR-15', name: '自願線下／活動外提案', level: 'P1', location: '基地首頁其他共同活動卡 (/)', proof: '成員表達科技展小聚意願，明示地點/交通待確認，拒絕或暫不考慮不扣分。' },
    { id: 'FR-16', name: '活動提醒', level: 'P1', location: '服務儀表板頂部 (/admin/dashboard)', proof: '模擬站內廣播提醒，明確標明未發送真實簡訊或外部推播。' },
    { id: 'FR-17', name: '匯總成效摘要', level: 'P1', location: '服務儀表板 (/admin/dashboard)', proof: '小組協作與共同決策指標聚合，嚴格標註「示範資料，非實際服務成效」，無個人排行。' },
    { id: 'FR-18', name: '資料匯出', level: 'P2', location: '儀表板複製彙總按鈕', proof: '一鍵複製 PRD v2.0 服務執行與小組互動成效文字摘要至剪貼簿。' },
  ];

  const scenarioSteps = [
    { step: 1, title: '回到基地', desc: '進入我的基地，查看固定小組、歷史成果「水上步道與涼亭」及未完成事項。' },
    { step: 2, title: '查看任務與可用方式', desc: '查看共同目標「決定並建設基地入口」，瀏覽 4 種多元貢獻方式。' },
    { step: 3, title: '提案與小組投票', desc: '小禾提出柔光拱橋，小組成員投票，即時計算勝出並更新共同決定。' },
    { step: 4, title: '切換參與方式', desc: '示範成員將直接操作切換為設計選擇，無障礙標籤或診斷推測。' },
    { step: 5, title: '請求協助與主持人回應', desc: '成員點擊求助，主持人控制台即刻接收並回應「已完成支援」，參與者端顯示確認。' },
    { step: 6, title: '共同成果摘要', desc: '產出本次活動共同摘要（選定入口風格、採納想法、下次接續項目）。' },
    { step: 7, title: '可跳過回顧與下次計畫', desc: '回答無壓力對話提示（可自由略過），投票決定下次共同目標（高架鐵路）。' },
    { step: 8, title: '主持人互動摘要', desc: '主持人檢視小組層級互動指標（共同決策、互助處理），無個人友誼分數。' },
    { step: 9, title: '自願線下／活動外提案', desc: '探索科技展小聚意願，明確標明地點/交通待確認，拒絕或暫不考慮不扣分。' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
            PRD v2.0 需求與驗收對照清單 (FR-01 ~ FR-18)
          </h1>
          <SimBadge label="100% 完整對照 PRD v2.0" />
        </div>
        <p style={{ color: 'var(--ink-secondary)', fontSize: 'var(--text-base)', marginTop: 4 }}>
          全面覆蓋 PRD v2.0 核心機制：共同世界持續存在、互惠合作任務、低壓力相處、關係延續與第 9 節端到端演示。
        </p>
      </div>

      {/* 第 9 節端到端 9 步驟驗收檢查表 */}
      <section className="card" style={{ borderColor: 'var(--primary-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
          <Sparkle size={22} color="var(--primary)" weight="fill" />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            PRD 第 9 節：從再次相聚到接續共同計畫 9 步驟走查對照
          </h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>步驟</th>
                <th style={{ width: 160 }}>情境名稱</th>
                <th>實作與驗收證明</th>
              </tr>
            </thead>
            <tbody>
              {scenarioSteps.map((s) => (
                <tr key={s.step}>
                  <td><span className="chip chip-info" style={{ fontSize: '11px' }}>第 {s.step} 步</span></td>
                  <td style={{ fontWeight: 700 }}>{s.title}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)' }}>
                      <CheckCircle size={16} color="var(--primary)" weight="fill" />
                      <span>{s.desc}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 功能需求表 */}
      <section className="card">
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
          功能需求 (FR-01 ~ FR-18) 實作對照表
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
    </div>
  );
};
