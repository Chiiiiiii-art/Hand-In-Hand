# 攜手基地 (Hand-in-Hand)
### 以線上遊戲孕育友誼與社會連結之支持系統 (Friendship Support System)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen?logo=vitest)](./docs/features-and-test-results.md)
[![Accessibility](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-success)](#4-全方位無障礙與易讀性支援)

> **專案簡介**：本系統專為成年行動障礙者量身設計。以 Minecraft 創造模式為創作載體，外部建構「輔助友誼發展」的網頁支持系統。透過固定小組、四大多元貢獻途徑、低門檻非同步提案與即時求助引導，消除操作障礙與人際摩擦，協助成員累積持久互助的社會資本與真誠友誼。

---

## 評審快速展示與體驗指南 (Judge's Quick Tour)

系統內建完整展示模擬與視角切換器，請依下列方式快速體驗核心流程：

1. **頂部視角切換器 (`RoleSwitch`)**：
   - **參與者前台 (`小禾 / 探索者`)**：體驗青鳥一組首頁、四大多元貢獻切換、合作任務板、小組提案投票與非同步回顧。
   - **主持工作台 (`陳主持 / 引導者`)**：體驗活動進程監控、即時求助派工與多元參與路徑觀察。
   - **管理支援後台 (`李專案 / 系統協調`)**：檢視 WHO 社會連結架構指標彙總、固定小組與場次排程、安全通報處置。
2. **頂部友善無障礙輔助列 (`AccessibilityBar`)**：
   - 支援 **「大字級顯示」**、**「高對比模式」** 與 **「靜心專注模式」**（降低視覺刺激與微動畫）。
3. **右下角展示控制台 (`DemoConsole`)**：
   - 可一鍵「填入示範資料」、「重置展示狀態」或快速跳轉至核心驗證場景。

---

## 六大核心系統機制 (PRD v2.0 Highlights)

| 機制核心 | 設計重點與實踐 | 對應文獻與理論依據 |
|---|---|---|
| **1. 固定小組與成果延續** | 6–8 人固定編組，共創同一個世界，跨週累積成果卡與共同記憶。 | WHO 社會連結架構；確保互動深度而非隨機片段交際。 |
| **2. 四大多元貢獻路徑** | 拆解為「空間建造、景觀配置、設計規劃、導覽敘事」，成員自主切換。 | Baltzar et al. (2023) 社交可及性原則；打破操作機能限制。 |
| **3. 低門檻提案與共同決策** | 每一位成員皆可提出設計構想，非同步投票凝聚小組共識。 | CRPD 第 19/30 條；消除社交焦慮與強者主導。 |
| **4. 即時求助與暫停引導** | 介面提供「遇到卡關／請求協助」，主持工作台即時接收並調適。 | Best et al. (2024)；即時支援確保零挫折與低流失。 |
| **5. 尊重邊界與無評級設計** | 絕無個人社交排行榜或活躍度評級；中性呈現群體合作進程。 | 避免同儕壓力，捍衛隱私與心理安全。 |
| **6. 自願遊戲外延伸探索** | 系統提供課外同玩與實體見面提案平台，內建無障礙場地檢核。 | Trepte et al. (2012)、Lai et al. (2023)；自願促成強固友誼。 |

---

## 專案核心文件索引 (Documentation)

全數技術規範、架構圖與測試驗收報告皆已統一收錄於 [`docs/`](./docs) 目錄：

- 📄 **產品需求規格書 (PRD v2.0)**：[`docs/prd.md`](./docs/prd.md)  
  *詳細定義 18 項功能需求 (FR-01 ~ FR-18)、10 項業務規則 (BR-01 ~ BR-10) 與非功能規範。*
- 📐 **系統架構圖與使用者流程圖**：[`docs/architecture-and-flows.md`](./docs/architecture-and-flows.md)  
  *包含全端分層架構、狀態機模型、4 階段活動閉環時序圖與角色流程圖。*
- ✅ **功能清單及測試結果報告**：[`docs/features-and-test-results.md`](./docs/features-and-test-results.md)  
  *18 項功能驗收對照表、業務規則防呆驗證與 Vitest 單元測試報告。*
- 📋 **需求驗收矩陣**：[`docs/acceptance.md`](./docs/acceptance.md)
- 🎨 **品牌設計規範與色彩系統**：[`docs/brand-guidelines.md`](./docs/brand-guidelines.md)
- 🏆 **競賽提案全文與書面報告**：[`proposal/`](./proposal)
  - 正式提案 PDF：[`proposal/攜手基地：以線上遊戲孕育友誼與社會連結.pdf`](./proposal/攜手基地：以線上遊戲孕育友誼與社會連結.pdf)
  - 提案原始 Markdown：[`proposal/攜手基地：以線上遊戲孕育友誼與社會連結.md`](./proposal/攜手基地：以線上遊戲孕育友誼與社會連結.md)

---

## 技術架構 (Tech Stack)

- **核心前端**：React 19.0, TypeScript 5.7, Vite 6.2
- **路由導航**：React Router v7 (HashRouter，便於靜態預覽與離線展示)
- **視覺風格**：純手刻 Vanilla CSS Design Tokens (雙主題高對比、WCAG 2.1 AA 規範、無第三方龐大框架負擔)
- **圖示庫**：`@phosphor-icons/react`
- **單元測試**：Vitest 3.2.7 (涵蓋指標演算法、資料模型與防呆邏輯)

---

## 快速啟動與開發指引 (Getting Started)

### 1. 安裝相依套件
```bash
npm install
```

### 2. 啟動本機開發伺服器
```bash
npm run dev
```
啟動完成後，於瀏覽器造訪 `http://localhost:5173/` 即可進入系統。

### 3. 執行單元測試
```bash
npm run test
```

### 4. 生產環境編譯
```bash
npm run build
```

---

## 開源授權 (License)

本專案採用 [MIT License](./LICENSE) 開源授權。
