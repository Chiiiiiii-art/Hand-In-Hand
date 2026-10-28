# 攜手基地 (Hand-in-Hand) — 系統架構圖與使用者流程圖

本文件提供「攜手基地 (Hand-in-Hand)」系統之完整技術架構、組件層級、狀態機模型與三條核心業務流程圖，採用標準 Mermaid 語法繪製，便於技術審查、交付驗收與後續擴充。

---

## 1. 系統架構圖 (System Architecture)

### 1.1 全端分層架構 (Layered Architecture)

系統採用輕量化、高效能的前端單頁應用（SPA）架構，嚴格遵循責任分離原則（Separation of Concerns）：

```mermaid
graph TD
    subgraph UI_Presentation ["展示層 (Presentation Layer)"]
        Shell["應用外框 (Shell & Header)"]
        Nav["導航與視角切換器 (RoleSwitch)"]
        Sim["示範導覽引導 (DemoGuide / SimBadge)"]
        P_Views["參與者頁面 (Home / Rules / Register / MyStatus / ReportIssue / Feedback)"]
        A_Views["管理者頁面 (Dashboard / Applications / Groups / Sessions / Issues / FollowUp)"]
    end

    subgraph Routing_Layer ["路由層 (Routing Layer)"]
        Router["React Router v7 (HashRouter)"]
        Routes_P["參與者端路由 (#/, #/rules, #/register, #/my-status, etc.)"]
        Routes_A["管理者端路由 (#/admin/dashboard, #/admin/applications, etc.)"]
    end

    subgraph State_Management ["狀態與資料流層 (State Management Layer)"]
        StoreProvider["React Context 全域狀態庫 (StoreContext)"]
        State_Hooks["Custom Hook (useAppStore)"]
        subgraph Domains ["領域實體 (Entities)"]
            AppList["申請名單 (applications)"]
            GrpList["固定小組 (groups)"]
            SesList["排程場次 (sessions)"]
            IssList["問題案件 (issues)"]
            FbList["單場回饋 (feedbacks)"]
            FuList["結案追蹤 (followUps)"]
        end
    end

    subgraph Business_Logic ["業務與指標運算層 (Domain Logic Layer)"]
        MetricsCalc["指標計算模組 (metrics.ts)"]
        Formula_Att["出席率演算法 (排除取消與未記錄)"]
        Formula_Rep["重複參與率 (>= 2 次出席)"]
        Formula_Con["同儕連結感加權平均 (1-5 星)"]
        Formula_Fu["結案聯繫意願 (未回覆獨立計算)"]
        A11yGuard["4 項可及性防呆檢核門檻 (BR-04)"]
    end

    subgraph Storage_Layer ["持久化儲存層 (Persistence Layer)"]
        StorageEngine["本地儲存引擎 (LocalStorage Engine)"]
        SeedData["脫敏虛構種子資料庫 (seed.ts)"]
        ResetHandler["一鍵還原預設資料 (Reset State)"]
    end

    Shell --> Nav
    Shell --> Sim
    Shell --> Router
    Router --> Routes_P --> P_Views
    Router --> Routes_A --> A_Views
    P_Views & A_Views --> State_Hooks
    State_Hooks --> StoreProvider
    StoreProvider --> Domains
    Domains --> MetricsCalc
    MetricsCalc --> Formula_Att & Formula_Rep & Formula_Con & Formula_Fu & A11yGuard
    StoreProvider <--> StorageEngine
    StorageEngine -.->|初次載入或重置| SeedData
```

---

### 1.2 前端組件層級樹 (Component Hierarchy)

```mermaid
graph TD
    App["App.tsx (Root Component)"]
    Store["StoreProvider (全域狀態注入)"]
    ShellComp["Shell.tsx (無障礙外框)"]
    Header["頂部導航列 (Header)"]
    RoleSwitch["角色切換器 (RoleSwitch)"]
    SimBadge["模擬標記 (SimBadge)"]
    DemoGuide["展示指引面板 (DemoGuide)"]
    MainContainer["主視圖容器 (Main Content Area)"]
    Footer["通用頁尾 (Footer)"]

    App --> Store
    Store --> ShellComp
    ShellComp --> Header
    Header --> RoleSwitch
    Header --> SimBadge
    Header --> DemoGuide
    ShellComp --> MainContainer
    ShellComp --> Footer

    MainContainer --> ViewRoute{"路由分發"}
    ViewRoute -->|前台| P_Pages["參與者端視圖 (Participant Views)"]
    ViewRoute -->|後台| A_Pages["後台管理端視圖 (Admin Views)"]
    ViewRoute -->|驗收| AccPage["驗收對照視圖 (Acceptance View)"]

    P_Pages --> RegComp["Register.tsx (表單驗證 / 範例帶入)"]
    P_Pages --> StatusComp["MyStatus.tsx (狀態標籤 / 加入指引卡片)"]
    P_Pages --> FeedbackComp["Feedback.tsx (評分星級 / 意願勾選)"]
    P_Pages --> IssueComp["ReportIssue.tsx (隱私求助表單)"]

    A_Pages --> DashComp["Dashboard.tsx (指標卡片 / 複製彙總)"]
    A_Pages --> AppMgmtComp["Applications.tsx (審核 Modal / 4 項檢核)"]
    A_Pages --> GrpMgmtComp["Groups.tsx (固定成員名冊)"]
    A_Pages --> SesMgmtComp["Sessions.tsx (場次發布 / 出席登記)"]
    A_Pages --> IssMgmtComp["Issues.tsx (安全事件處置備忘)"]
```

---

### 1.3 核心實體狀態機 (State Machine Model)

系統包含四個嚴格遵循 PRD 規格的狀態轉換生命週期：

```mermaid
stateDiagram-v2
    [*] --> 申請待確認: 參與者提交報名表單 (FR-02)
    
    state 申請狀態機 {
        申請待確認 --> 需後續聯繫: 設備或時段尚待釐清
        需後續聯繫 --> 申請待確認: 參與者補充資料完成
        申請待確認 --> 可安排: 通過 4 項可及性檢核 (BR-04)
        需後續聯繫 --> 可安排: 協調完成並通過檢核
        可安排 --> 已入組: 管理者指派至固定小組 (FR-06)
    }

    state 場次狀態機 {
        [*] --> 場次待發布: 建立 8 週活動規劃 (FR-07)
        場次待發布 --> 場次已發布: 確定主持人、目標與加入指引
        場次已發布 --> 進行出席登記: 活動開場 (FR-09)
    }

    state 問題回報狀態機 {
        [*] --> 新案件: 參與者提交問題 (FR-11)
        新案件 --> 處理中: 管理者受理解析
        處理中 --> 已處理: 處置對策確認並記錄後續追蹤 (FR-12)
    }

    state 結案追蹤狀態機 {
        [*] --> 追蹤待回覆: 第 8 週活動結算完畢 (FR-14)
        追蹤待回覆 --> 追蹤已完成: 參與者提交持續聯繫意願問卷
    }
```

---

## 2. 使用者流程圖 (User Flows)

### 2.1 參與者端到端主流程 (Participant End-to-End Journey)

涵蓋從了解服務、報名檢核、狀態查詢、加入活動、問題求助到完成回饋之完整旅程：

```mermaid
flowchart TD
    Start([參與者抵達首頁]) --> ViewService[瀏覽服務定位與固定小組介紹]
    ViewService --> ReadRules[閱讀安全守則與常見問答 /rules]
    ReadRules --> CheckEligible{是否符合條件？<br/>年滿18歲 & 移動受限成人}
    
    CheckEligible -- 否 --> ExitNotEligible([感謝關注，不符合本案試辦條件])
    CheckEligible -- 是 --> GoRegister[進入報名頁面 /register]
    
    GoRegister --> FillForm[填寫表單：聯絡資訊、可用時段、<br/>操作方式、溝通偏好]
    FillForm --> FormCheck{表單驗證<br/>BR-01 年齡檢核<br/>BR-02 同意守則}
    
    FormCheck -- 未通過 --> ShowFormErrors[顯示無障礙錯誤提示摘要]
    ShowFormErrors --> FillForm
    FormCheck -- 通過 --> SubmitApp[送出申請 (立案: 待確認)]
    
    SubmitApp --> ViewMyStatus[進入「我的狀態頁」/my-status]
    ViewMyStatus --> StatusPolling{當前申請狀態}
    
    StatusPolling -- 待確認 / 需後續聯繫 --> WaitStaff[顯示狀態文字解讀，等待團隊審查協調]
    StatusPolling -- 可安排 --> WaitGroup[已通過可及性確認，等待小組分派]
    StatusPolling -- 已入組 --> EnrolledView[看見所屬小組名稱與組員暱稱]
    
    EnrolledView --> CheckSessionInfo[查閱每週場次排程與共同任務目標]
    CheckSessionInfo --> SessionStatusCheck{場次是否已發布？}
    
    SessionStatusCheck -- 待發布 --> WaitPublish[顯示「待發布」狀態，暫不公開連線網址]
    SessionStatusCheck -- 已發布 --> ViewJoinGuide[查閱 Minecraft 伺服器 IP、<br/>語音文字頻道與備援聯絡人]
    
    ViewJoinGuide --> JoinActivity[進入遊戲與固定同儕協作互動]
    
    JoinActivity --> TroubleHappened{活動中是否遭遇<br/>技術或互動安全問題？}
    TroubleHappened -- 是 --> GoReport[前往問題求助頁 /report-issue<br/>一對一私密通報]
    TroubleHappened -- 否 --> CompleteSession[完成當次共同任務]
    
    GoReport --> SubmitIssue[提交事件，管理者端即時受理排解]
    SubmitIssue --> CompleteSession
    
    CompleteSession --> SubmitFeedback[前往回饋頁 /feedback<br/>評定同儕連結感與活動評分]
    
    SubmitFeedback --> WeekCycle{是否已完成 8 週週期？}
    WeekCycle -- 否 --> EnrolledView
    WeekCycle -- 是 --> FillFollowUp[填寫結案後續追蹤問卷<br/>自評同儕繼續聯繫意願]
    FillFollowUp --> EndJourney([圓滿完成同儕服務旅程])
```

---

### 2.2 管理者作業與活動維運流程 (Admin Operations Flow)

管理者在整個服務週期中的日常作業流程，包含審查、排程、維運與結案統計：

```mermaid
flowchart TD
    AdminLogin([管理者進入後台]) --> ViewDashboard[查閱服務儀表板 /admin/dashboard]
    ViewDashboard --> ReviewApps[進入申請審查清單 /admin/applications]
    
    ReviewApps --> PickApp[選擇待審查申請案件]
    PickApp --> OpenModal[開啟審查對話框，檢視輔具與時段偏好]
    
    OpenModal --> A11yChecklist{"4 項可及性事前檢核 (BR-04)<br/>1. 設備狀態<br/>2. 操作方式<br/>3. 溝通偏好<br/>4. 支援需求"}
    
    A11yChecklist -- 有項目不清楚或需調適 --> SetNeedContact[標記為「需後續聯繫」<br/>記錄內部備註]
    SetNeedContact --> FollowUpContact[線下主動聯繫協調輔具操作]
    FollowUpContact --> PickApp
    
    A11yChecklist -- 4 項皆已確認通過 --> SetReady[狀態更新為「可安排」]
    
    SetReady --> ManageGroups[進入小組管理 /admin/groups]
    ManageGroups --> AssignGroup[將「可安排」成員編入 6-8 人固定小組]
    AssignGroup --> AutoStatusUpdate[系統自動將成員狀態同步為「已入組」]
    
    AutoStatusUpdate --> ManageSessions[進入場次排程 /admin/sessions]
    ManageSessions --> PlanSchedule[確認每週任務主題、時間、主持人]
    PlanSchedule --> PublishSession[將場次切換為「已發布」<br/>指引正式向前台已入組成員公開]
    
    PublishSession --> HostActivity[主持線上共同活動]
    HostActivity --> RecordAttendance[登記每位組員出席狀態：<br/>出席 / 缺席 / 事先請假]
    
    RecordAttendance --> CheckIssues{是否有收到參與者通報？}
    CheckIssues -- 有新案件 --> ViewIssues[進入問題紀錄 /admin/issues<br/>執行安全隔離或技術處置]
    CheckIssues -- 無案件 --> UpdateMetrics[儀表板即時重算成效指標]
    
    ViewIssues --> RecordResolution[記錄處置對策與追蹤備忘]
    RecordResolution --> UpdateMetrics
    
    UpdateMetrics --> CycleEnd{8 週活動週期是否結束？}
    CycleEnd -- 否 --> PlanSchedule
    CycleEnd -- 是 --> ReviewFollowUp[進入後續追蹤專區 /admin/follow-up]
    
    ReviewFollowUp --> ExportSummary[點擊「複製彙總」產生成效報告]
    ExportSummary --> EndAdminWork([完成本期服務交付結案])
```

---

### 2.3 活動中異常與安全處置流程 (Issue Reporting & Safety Escalation Flow)

嚴格隔離個資、保障受害者安全與維持小組平穩運作之處置機制：

```mermaid
sequenceDiagram
    autonumber
    actor P as 參與者 (Participant)
    participant UI as 前台求助介面 (/report-issue)
    participant Store as 全域資料庫 (StoreContext)
    actor Admin as 服務管理者 / 主持人 (Admin)
    participant AUI as 後台事件管理 (/admin/issues)

    Note over P, Admin: 活動進行中發生技術卡頓、操作困難或遭遇不當言語騷擾
    P->>UI: 點擊問題回報，選擇類別 (技術/互動安全/其他)
    P->>UI: 填寫事件詳細描述 (非公開一對一加密表單)
    P->>UI: 提交問題 (BR-07, BR-09)
    UI->>Store: 建立案件 (狀態: 新案件, 時間戳記)
    Store-->>UI: 顯示「已收到回報，專責團隊將盡速排解」確認提示
    Store->>AUI: 事件清單即時出現紅色警示案件

    Admin->>AUI: 點擊開啟案件詳情 (非公開畫面)
    alt 技術問題 (如無法登入伺服器、快捷鍵衝突)
        Admin->>Admin: 啟動技術應變機制 / 切換備援通訊管道
        Admin->>AUI: 狀態更新為「處理中」，填寫線上排解步驟
    else 互動與安全事件 (如言語冒犯、騷擾、私自索要個資)
        Admin->>Admin: 活動主持人即刻介入保護受影響成員 (暫停發言/移出伺服器)
        Admin->>AUI: 狀態更新為「處理中」，記錄違規事項與安全處置方針
    end

    Admin->>Admin: 安排活動後一對一私下關懷與後續聯繫
    Admin->>AUI: 填寫「處置對策」與「後續聯繫追蹤安排」
    Admin->>AUI: 標記案件為「已處理」
    AUI->>Store: 更新事件狀態與處置紀錄
    Store-->>Admin: 儀表板事件統計數字同步更新 (已處理案件數 +1)
```

---
*文件編制：Hand-in-Hand 產品研發團隊*
