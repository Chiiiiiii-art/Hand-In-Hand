# 攜手基地 (Hand-in-Hand) — 線上同儕活動服務系統 (PoC)

本系統以現有多人線上沙盒遊戲（以 Minecraft Creative 模式為首選候選）為共同活動載體，支援成年行動障礙者持續參與同儕活動，提供標準化之服務管理流程與互動原型。

---

## 專案核心交付文件

本專案已完成完整規格設計、架構繪製與驗收測試，核心交付文件請參閱：

1. **最新版 PRD**：[docs/prd.md](file:///c:/Users/alexl/Desktop/Programs/Hand-In-Hand/docs/prd.md)  
   完整涵蓋產品定位、16 項功能需求 (FR-01 ~ FR-16)、10 項業務規則 (BR-01 ~ BR-10)、非功能需求 (NFR) 與指標計算口徑。

2. **使用者流程圖與系統架構圖**：[docs/architecture-and-flows.md](file:///c:/Users/alexl/Desktop/Programs/Hand-In-Hand/docs/architecture-and-flows.md)  
   提供 Mermaid 全端分層架構圖、前端組件樹、狀態機模型，以及參與者旅程、管理者維運、問題回報安全處置 3 條端到端流程圖。

3. **功能清單及測試結果**：[docs/features-and-test-results.md](file:///c:/Users/alexl/Desktop/Programs/Hand-In-Hand/docs/features-and-test-results.md)  
   包含完整功能追蹤矩陣、Vitest 單元測試報告、端到端 7 步展示劇本驗收成果與無障礙 (WCAG 2.1 AA) 檢驗報告。

---

## 快速上手與執行

### 安裝相依套件
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

### 建置生產環境版本
```bash
npm run build
```
