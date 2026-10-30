# 攜手基地 PRD v2.0 系統架構圖與使用者流程圖

本文件提供「攜手基地 — 以線上遊戲為媒介的友誼支持系統 (PRD v2.0)」之完整系統架構、使用者流程圖與狀態機流轉圖。

---

## 1. 系統整體架構圖 (System Architecture)

系統定位為「友誼發展支持層」，不取代外部沙盒遊戲（如 Minecraft Creative），專注於維持關係連續性、互惠任務決策、低壓力社交與安全管理。

```mermaid
graph TD
  subgraph Client_Presentation [前端展示層 (React 19 SPA + Vite + Vanilla CSS Tokens)]
    subgraph Role_Participant [參與者視角 (小禾)]
      P_Base[小組基地首頁 FR-01 /]
      P_World[共同世界成果卡 FR-02]
      P_Task[合作任務板 FR-03]
      P_Prop[提案與投票 FR-04]
      P_Mode[貢獻方式切換 FR-05]
      P_Help[求助與暫停 FR-06]
      P_Memory[共同記憶與成果 FR-08]
      P_Retro[低壓力回顧 FR-07]
      P_Next[下次計畫投票 FR-09]
      P_Off[自願線下探索 FR-15]
    end

    subgraph Role_Host [引導主持人視角 (陳主持)]
      H_Console[活動即時控制台 FR-12 /host/console]
      H_Orch[任務範本編排器 FR-11 /host/tasks]
      H_HelpDesk[求助即時處置工作台]
      H_Metrics[小組互動摘要觀察 FR-17]
    end

    subgraph Role_Admin [服務管理支援層]
      A_Dash[成效儀表板 FR-17 /admin/dashboard]
      A_Group[固定小組管理 FR-13 /admin/groups]
      A_Session[場次排程 FR-13 /admin/sessions]
      A_Issue[私密安全事件處置 FR-14 /admin/issues]
      A_Acc[需求驗收矩陣 /acceptance]
    end

    ScenarioBar[PRD 第 9 節 9 步情境導覽浮條 (ScenarioStepper)]
  end

  subgraph State_Domain [狀態與領域邏輯層 (React Context + Reducer)]
    Store[AppStore 狀態中樞]
    Reducer[appReducer 狀態轉移機]
    MetricsCalc[metrics.ts 指標運算引擎 (無個人排名)]
  end

  subgraph Persistence_Data [資料與模擬層]
    LocalStorage[(瀏覽器 LocalStorage: hand_in_hand_state_v2)]
    SeedData[PRD v2.0 虛構示範資料庫 seed.ts]
    SimBadgeRule[PRD 誠實標籤約束層 (示範資料 / 待確認 / 模擬狀態)]
  end

  Client_Presentation <--> State_Domain
  State_Domain <--> Persistence_Data
```

---

## 2. 參與者核心旅程使用者流程圖 (Participant Core Journey)

嚴格對應 PRD 第 5.1 節與第 9 節端到端情境：

```mermaid
sequenceDiagram
  autonumber
  actor User as 參與者 (小禾)
  participant Base as 小組基地首頁 (FR-01)
  participant World as 持續共同世界 (FR-02)
  participant Task as 合作任務板 (FR-03/04/05)
  participant Host as 主持人控制台 (FR-06/12)
  participant Retro as 回顧與記憶 (FR-07/08)
  participant Next as 下次活動與線下 (FR-09/15)

  User->>Base: 1. 登入進入小組基地
  Base-->>User: 顯示固定小組 (青鳥一組) 與上次成果 (水上花園步道)
  User->>World: 2. 檢視島嶼歷史作品與未完成待延續清單
  User->>Task: 3. 打開當期合作任務「基地無障礙迎賓入口」
  Task-->>User: 檢視小禾、阿木、海風提案與 4 種多元貢獻方式
  User->>Task: 4. 投票支持提案 (小禾柔光拱橋) -> 更新小組首選
  User->>Task: 5. 自主切換參與方式 (直接操作 -> 提出/篩選設計)
  opt 遇到卡關或疲累
    User->>Task: 6. 點擊「遇到卡關／請求協助」送出求助訊號
    Task->>Host: 訊號即時傳送至主持人控制台
    Host->>Task: 主持人一鍵回應「已完成支援，請放鬆雙手」
    Task-->>User: 畫面即刻顯示「已由主持人支援」確認通知
  end
  User->>Retro: 7. 檢視活動結算生成之「共同摘要」
  User->>Retro: 8. 回答或跳過低壓力對話提示 (無強迫揭露個資)
  User->>Next: 9. 投票選定下次共同目標 (延伸水上高架景觀鐵路)
  User->>Next: 10. 表達自願線下探索意願 (科技展小聚，地點交通待確認)
```

---

## 3. 主持人引導與即時協調流程圖 (Host Facilitator Flow)

對應 PRD 第 5.2 節與 FR-11、FR-12：

```mermaid
flowchart TD
  Start([活動前準備]) --> Orch[進入任務編排器 /host/tasks FR-11]
  Orch --> ChooseTpl[選取 8 週進程範本]
  ChooseTpl --> SetGoal[設定團隊目標、4 種多元貢獻選項與可選題目]
  SetGoal --> CheckRule{發布前規則檢核<br/>團隊互惠目標? 多元途徑?}
  CheckRule -- 通過 --> Publish[發布任務至小組基地]

  Publish --> LiveSession([活動進行中])
  LiveSession --> LiveConsole[開啟活動即時控制台 /host/console FR-12]
  LiveConsole --> Monitor[即時監控成員貢獻途徑與在線狀態]

  Monitor --> CheckHelp{收到成員求助/暫停訊號? FR-06}
  CheckHelp -- 是 --> HandleHelp[檢視求助類型: 換方式 / 卡關 / 休息]
  HandleHelp --> ReplyHelp[填寫支援留言並一鍵點擊「立即回應並支援」]
  ReplyHelp --> AckUser[參與者端即時獲取支援狀態]

  CheckHelp -- 否 --> CheckSafe{發生互動衝突或技術異常?}
  CheckSafe -- 是 --> HandleSafety[介入協調 / 轉入私密安全事件處置 FR-14]
  CheckSafe -- 否 --> CompleteTask[推進任務至回顧階段]

  AckUser --> CompleteTask
  CompleteTask --> PostSession([活動結束後])
  PostSession --> ViewMetrics[檢視小組層級互動摘要 FR-17]
  ViewMetrics --> Note[確認無個人友誼分數 / 僅保留小組合作指標]
  Note --> End([完成本週活動引導閉環])
```

---

## 4. 關鍵領域狀態機流轉圖 (State Machines)

### 4.1 提案與共同決策狀態機 (FR-04)
```mermaid
stateDiagram-v2
  [*] --> 討論提案中: 任務發布
  討論提案中 --> 成員發表提案: 成員點擊「+ 提出我的設計想法」
  成員發表提案 --> 討論提案中: 提案送出並附帶可及性特色
  討論提案中 --> 票數統計中: 成員點選「投票支持」
  票數統計中 --> 產生小組首選: 計算最高支持票數提案
  產生小組首選 --> 進行協作中: 鎖定藍圖進入實體建造
  進行協作中 --> 完成待回顧: 共同成果達成並生成摘要
  完成待回顧 --> 已歸檔: 活動結束收錄至共同世界歷程卡
  已歸檔 --> [*]
```

### 4.2 求助與暫停處置狀態機 (FR-06, FR-12)
```mermaid
stateDiagram-v2
  [*] --> 無求助狀態
  無求助狀態 --> 待回應: 成員點選「遇到卡關／請求協助」送出表單
  待回應 --> 已由主持人支援: 主持人控制台點擊「立即回應並標記已支援」
  已由主持人支援 --> 無求助狀態: 成員確認收到協助並繼續參與活動
```

### 4.3 線下與活動外探索意願狀態機 (FR-15)
```mermaid
stateDiagram-v2
  [*] --> 模擬提案建立: 標註「地點、交通與場地可及性待確認」
  模擬提案建立 --> 尚未表態: 呈現在小組基地首頁
  尚未表態 --> 有興趣: 成員點擊「有興趣」
  尚未表態 --> 想先繼續線上: 成員點擊「想先繼續線上活動」
  尚未表態 --> 暫不考慮: 成員點擊「暫不考慮」
  暫不考慮 --> 權益無損: 系統明確提示「不扣分、不影響線上活動參與權」
  想先繼續線上 --> 權益無損
  有興趣 --> 意願匯總: 納入小組自願意願統計
```

---

## 5. 資料流與模組相依架構 (Data Flow Architecture)

```mermaid
graph LR
  subgraph Data_Source [持久化儲存]
    LS[(LocalStorage)]
    Seed[(初始示範種子)]
  end

  subgraph Store_Context [狀態容器 store.tsx]
    State[AppState]
    Dispatch[dispatch Action]
  end

  subgraph Domain_Calculators [領域計算與規則]
    Metrics[metrics.ts]
    RuleValidation[PRD 業務規則檢查 BR-01~BR-10]
  end

  subgraph Views_Pages [視圖分層]
    BaseHome[BaseHome.tsx 小組基地]
    HostConsole[HostConsole.tsx 主持人台]
    TaskOrch[TaskOrchestrator.tsx 編排器]
    AdminDash[Dashboard.tsx 管理儀表板]
    AcceptanceView[Acceptance.tsx 驗收清單]
  end

  Data_Source --> State
  State --> Metrics
  Metrics --> BaseHome
  Metrics --> HostConsole
  Metrics --> AdminDash
  RuleValidation --> BaseHome
  RuleValidation --> TaskOrch
  Views_Pages --> Dispatch
  Dispatch --> State
  State --> LS
```
