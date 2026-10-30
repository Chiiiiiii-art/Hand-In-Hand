# 攜手基地 Hand-in-Hand
### 以線上遊戲為媒介的成年行動障礙者友誼支持系統

[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=vitest)](./docs/features-and-test-results.md)

攜手基地專為成年行動障礙者量身設計，以多人線上沙盒遊戲（Minecraft 創造模式）為創作載體，於外部建構一套無障礙、低門檻且著重人際信任累積的網頁支持系統。

專案透過「固定小組連續共創」、「四大多元分工路徑」、「非同步提案決策」與「引導主持人調適」等機制，化解主流商業線上遊戲精細微操與陌生匿名環境帶來的挫折，協助成員在自主舒適的步調下持續互動，建立持久且互惠的同儕社會資本。

---

## 專案提案書

本專案之社會關懷動機、學術理論依據、服務流程設計與先導試辦規劃，完整收錄於提案文件中：

- **完整提案企劃書（PDF 版本）**：[`proposal/攜手基地：以線上遊戲孕育友誼與社會連結.pdf`](./proposal/攜手基地：以線上遊戲孕育友誼與社會連結.pdf)
- **完整提案企劃書（Word 格式）**：[`proposal/攜手基地：以線上遊戲孕育友誼與社會連結.docx`](./proposal/攜手基地：以線上遊戲孕育友誼與社會連結.docx)
- **大會規章與申請表單**：[`proposal/附錄一：提案申請表.docx`](./proposal/附錄一：提案申請表.docx)、[`proposal/附錄二：提案書參考格式.docx`](./proposal/附錄二：提案書參考格式.docx)

---

## 系統核心設計

| 設計模組 | 機制說明 | 理論與規範依據 |
|---|---|---|
| **固定小組與進程延續** | 採 6–8 人固定小組共創同一個世界，跨週保留建設進度與成果紀錄卡，維繫穩定的同儕熟悉度。 | 世界衛生組織（WHO）社會連結架構，重視結構、功能與品質三層次指標。 |
| **四大多元貢獻路徑** | 拆解協作任務為空間建造、景觀配置、設計規劃、導覽敘事四項平等角色，成員依機能與當日體能自由切換。 | Baltzar et al. (2023) 社交可及性架構（Social Accessibility），確保全員具備實質貢獻感。 |
| **低門檻提案與共同決策** | 成員皆可提出建設點子並進行非同步投票，化解即時語音溝通的社交壓力與強者主導問題。 | 身心障礙者權利公約（CRPD）第 19 條與第 30 條，保障自主參與休閒權利。 |
| **引導工作台與求助分流** | 介面提供一鍵暫停與卡關求助功能，主持人端即時接收並進行個別調適；完全排除個人活躍度排行與社交評分。 | Best et al. (2024) 結構化同儕支持原則，守護心理安全感。 |
| **自願性課外人際延伸** | 活動結束後提供非同步記憶回顧，並支援成員自主發起課外同玩或實體小聚，內建場地無障礙檢核。 | Trepte et al. (2012) 與 Lai et al. (2023)，線上互信自然延伸至實體支持網絡。 |
| **多模態無障礙介面** | 系統頂部提供大字級、高對比主題與靜心模式切換，全站按鈕具備 48px 觸控範圍並消除快速閃爍。 | 參照 W3C Web Content Accessibility Guidelines (WCAG) 2.1 AA 規範標準。 |

---

## 技術文件導覽
系統各項規格與驗收文檔彙整於 [`docs/`](./docs) 目錄：

- **產品需求規格書（PRD v2.0）**：[`docs/prd.md`](./docs/prd.md)  
  包含 18 項功能需求（FR-01 ~ FR-18）、10 項業務規則（BR-01 ~ BR-10）、非功能需求與成效計算公式。
- **系統架構圖與業務流程圖**：[`docs/architecture-and-flows.md`](./docs/architecture-and-flows.md)  
  包含全端分層架構、狀態機模型、4 階段活動閉環時序圖與角色旅程。
- **功能清單及測試結果報告**：[`docs/features-and-test-results.md`](./docs/features-and-test-results.md)  
  包含需求追蹤矩陣、防呆檢驗紀錄與 Vitest 單元測試報告。
- **需求驗收矩陣**：[`docs/acceptance.md`](./docs/acceptance.md)
- **品牌識別與色彩規範**：[`docs/brand-guidelines.md`](./docs/brand-guidelines.md)

---

## 技術選型

- **核心技術**：React 19.0、TypeScript 5.7、Vite 6.2
- **路由架構**：React Router v7（Hash 模式，相容純靜態站點佈署與展示）
- **樣式架構**：Vanilla CSS Design Tokens（原生設計權標，輕量且完整支援高對比與無障礙模式）
- **圖示資源**：`@phosphor-icons/react`
- **測試工具**：Vitest 3.2.7（涵蓋指標運算邏輯、資料防呆與狀態流轉測試）

---

## 開發與執行方式

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```
啟動後於瀏覽器造訪 `http://localhost:5173/`。

### 執行單元測試
```bash
npm run test
```

### 生產環境編譯
```bash
npm run build
```

---

## 授權條款

本專案之提案企劃、系統架構與程式原始碼均保留所有權利（All Rights Reserved）。

依據「資訊人社會關懷獎學金」活動辦法，專案作者授權主辦單位（中華民國電腦學會）得於評審審查、成果公布、檢索出版與非商業推廣之範圍內利用本專案內容。未經著作權人正式書面許可，任何第三方不得擅自挪用、改作、散布或進行商業營利應用，詳見 [`LICENSE`](./LICENSE)。
