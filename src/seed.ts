import {
  Application,
  Group,
  Session,
  Feedback,
  IssueReport,
  FollowUpRecord,
  GroupBaseWorld,
  CoopTask,
  HelpRequestRecord,
  ReflectionQuestion,
  NextPlanOption,
  OfflineActivityProposal,
  ScenarioStepMeta
} from './types';

// 虛構示範參與者（包含成功路徑主角「小禾」，以及滿足不同偏好的成員）
export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-01',
    submittedAt: '2026-10-25 14:20',
    nickname: '小禾',
    age: 26,
    contactInfo: 'Line: xiaohe2026 / 0912-345-678',
    shareContactConsent: false,
    agreedRules: true,
    availableSlots: ['每週三晚間 19:30-21:00', '每週六下午 14:00-15:30'],
    gamingExperience: '平常偶爾玩模擬經營遊戲，曾試過沙盒建造',
    inputMethod: '標準滑鼠 + 螢幕虛擬按鍵',
    communicationPreference: '文字為主',
    supportNeeds: '移動游標稍慢，遊戲中請主持人提醒指令，不需語音',
    status: '已入組',
    currentContributionMode: 'direct_build',
    accessibilityCheck: {
      deviceConfirmed: true,
      controlsConfirmed: true,
      communicationConfirmed: true,
      supportNeedConfirmed: true,
    },
    adminNotes: '初次測試順利，自備大軌跡球，文字頻道溝通順暢。',
    assignedGroupId: 'grp-01',
  },
  {
    id: 'app-02',
    submittedAt: '2026-10-26 10:15',
    nickname: '阿木',
    age: 31,
    contactInfo: 'Email: wood@example.tw',
    shareContactConsent: true,
    agreedRules: true,
    availableSlots: ['每週三晚間 19:30-21:00'],
    gamingExperience: 'Minecraft 老手，喜歡紅石與大型結構規劃',
    inputMethod: '一般鍵盤與手把',
    communicationPreference: '兩者皆可',
    supportNeeds: '久坐容易疲勞，中途需要 5 分鐘伸展小休',
    status: '已入組',
    currentContributionMode: 'design_choice',
    accessibilityCheck: {
      deviceConfirmed: true,
      controlsConfirmed: true,
      communicationConfirmed: true,
      supportNeedConfirmed: true,
    },
    adminNotes: '熱心願任小組長，引導新成員建造。',
    assignedGroupId: 'grp-01',
  },
  {
    id: 'app-03',
    submittedAt: '2026-10-26 16:40',
    nickname: '海風',
    age: 29,
    contactInfo: 'Email: seabreeze@example.tw',
    shareContactConsent: false,
    agreedRules: true,
    availableSlots: ['每週三晚間 19:30-21:00'],
    gamingExperience: '玩過動物森友會，沒玩過 Minecraft',
    inputMethod: '筆電觸控板與按鍵',
    communicationPreference: '文字為主',
    supportNeeds: '需要開場逐步圖文指引',
    status: '已入組',
    currentContributionMode: 'resource_sort',
    accessibilityCheck: {
      deviceConfirmed: true,
      controlsConfirmed: true,
      communicationConfirmed: true,
      supportNeedConfirmed: true,
    },
    adminNotes: '引導專員已提供基礎教學文件。',
    assignedGroupId: 'grp-01',
  },
  {
    id: 'app-04',
    submittedAt: '2026-10-27 11:00',
    nickname: '雲雀',
    age: 24,
    contactInfo: 'Line: skylark99',
    shareContactConsent: false,
    agreedRules: true,
    availableSlots: ['每週三晚間 19:30-21:00'],
    gamingExperience: '喜愛探索解謎',
    inputMethod: '改裝單手控制器',
    communicationPreference: '語音為主',
    supportNeeds: '無特殊要求，僅需耐心等候操作',
    status: '已入組',
    currentContributionMode: 'text_voice_coord',
    accessibilityCheck: {
      deviceConfirmed: true,
      controlsConfirmed: true,
      communicationConfirmed: true,
      supportNeedConfirmed: true,
    },
    adminNotes: '手把鍵位映射已校準完成。',
    assignedGroupId: 'grp-01',
  },
  {
    id: 'app-05',
    submittedAt: '2026-10-27 18:30',
    nickname: '晴天',
    age: 35,
    contactInfo: 'Phone: 0988-777-666',
    shareContactConsent: true,
    agreedRules: true,
    availableSlots: ['每週三晚間 19:30-21:00'],
    gamingExperience: '初學者',
    inputMethod: '標準滑鼠',
    communicationPreference: '兩者皆可',
    supportNeeds: '視線容易疲憊，需要高對比遊戲介面',
    status: '可安排',
    accessibilityCheck: {
      deviceConfirmed: true,
      controlsConfirmed: true,
      communicationConfirmed: true,
      supportNeedConfirmed: true,
    },
    adminNotes: '四項檢核全數合格，等待安排進第二梯次。',
  },
  {
    id: 'app-06',
    submittedAt: '2026-10-28 09:20',
    nickname: '星光',
    age: 22,
    contactInfo: 'Email: starlight@demo.tw',
    shareContactConsent: false,
    agreedRules: true,
    availableSlots: ['每週五晚間 20:00-21:30'],
    gamingExperience: '完全無電腦遊戲經驗',
    inputMethod: '平板/觸控',
    communicationPreference: '文字為主',
    supportNeeds: '家中有舊型筆電，不知道能否跑得順',
    status: '需後續聯繫',
    accessibilityCheck: {
      deviceConfirmed: false,
      controlsConfirmed: false,
      communicationConfirmed: true,
      supportNeedConfirmed: false,
    },
    adminNotes: '需安排通話測試舊筆電規格與網路延遲。',
  },
  {
    id: 'app-07',
    submittedAt: '2026-10-28 14:00',
    nickname: '晨曦',
    age: 28,
    contactInfo: 'Line: morning_sun',
    shareContactConsent: false,
    agreedRules: false,
    availableSlots: ['未確定時段'],
    gamingExperience: '手機休閒遊戲',
    inputMethod: '尚未確認',
    communicationPreference: '兩者皆可',
    supportNeeds: '希望先了解活動細節',
    status: '待確認',
    accessibilityCheck: {
      deviceConfirmed: false,
      controlsConfirmed: false,
      communicationConfirmed: false,
      supportNeedConfirmed: false,
    },
    adminNotes: '新送件，待服務專員進行初次可及性說明。',
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'grp-01',
    name: '常青樹小隊 (試辦固定組)',
    fixedTimeSlot: '每週三晚間 19:30 - 21:00',
    hostName: '陳主持 (引導社工師)',
    backupContact: '專線 02-2345-6789 / 官方備援 Discord: @admin_sos',
    createdAt: '2026-10-26',
    members: [
      { applicantId: 'app-01', nickname: '小禾', joinedAt: '2026-10-26', role: '成員' },
      { applicantId: 'app-02', nickname: '阿木', joinedAt: '2026-10-26', role: '小組長' },
      { applicantId: 'app-03', nickname: '海風', joinedAt: '2026-10-27', role: '成員' },
      { applicantId: 'app-04', nickname: '雲雀', joinedAt: '2026-10-27', role: '成員' },
    ]
  }
];

// FR-01 & FR-02: 常青樹小隊持續發展的共同世界 (Minecraft Creative 示範世界)
export const INITIAL_BASE_WORLDS: GroupBaseWorld[] = [
  {
    groupId: 'grp-01',
    worldName: '常青樹浮空島嶼基地',
    worldTheme: '無障礙環湖花園與空中閱讀城邦',
    serverAddress: 'mc.handinhand.demo:25565 (示範專用伺服器)',
    versionInfo: 'Minecraft Creative 1.20+ 無障礙輔具映射相容',
    pastDeliverables: [
      {
        id: 'deliv-01',
        title: '基地初創地標與休憩景觀台',
        weekNumber: 1,
        description: '小組成員在中央空島共同選址、插上常青樹隊旗，鋪設平坦安全的集合廣場，並設置夜間柔和螢石照明。',
        category: '休閒空間',
        completedAt: '2026-10-14',
        imageTag: 'pavilion',
        highlight: '由阿木與小禾分工標誌塔，全員文字熱絡討論命名。'
      },
      {
        id: 'deliv-02',
        title: '無障礙水上步道與環湖休憩涼亭',
        weekNumber: 2,
        description: '依湖面地形延伸的無高低階平坦木棧道，兩側設防墜扶手與自動停靠小艇泊位，中心設有玻璃頂遮雨涼亭。',
        category: '無障礙步道',
        completedAt: '2026-10-21',
        imageTag: 'garden',
        highlight: '雲雀使用手把鋪設步道底座，海風整理建材箱，小禾完成採光玻璃頂。'
      }
    ],
    pendingTasksSummary: [
      '基地正門迎賓入口造型尚未定案（本週協作任務）',
      '水上步道連接至空中圖書館的斜坡軌道待鋪設',
      '成員專屬休憩儲物櫃位待規劃'
    ]
  }
];

// FR-03, FR-04, FR-05: 當前合作任務（第 3 週：基地入口與地標建設）
export const INITIAL_COOP_TASKS: CoopTask[] = [
  {
    id: 'task-01',
    sessionId: 'ses-03',
    groupId: 'grp-01',
    weekNumber: 3,
    title: '一起決定並建設基地無障礙迎賓入口',
    teamGoal: '透過方案提案與小組投票，決定基地入口造型風格，並運用多元貢獻分工完成實體建造。',
    status: '討論提案中',
    activeProposalId: 'prop-01',
    proposals: [
      {
        id: 'prop-01',
        taskId: 'task-01',
        applicantId: 'app-01',
        authorNickname: '小禾',
        title: '中世紀石磚門樓',
        concept: '以石磚拱門搭配中央雙開平緩斜坡，入口設有夜行柔光螢石柱，寬度 4 格便於多人並行通過。',
        accessibilityFeature: '超寬平坦通道無門檻，高對比夜光方塊指引，視覺清晰容易定位。',
        votes: ['app-01', 'app-03']
      },
      {
        id: 'prop-02',
        taskId: 'task-01',
        applicantId: 'app-02',
        authorNickname: '阿木',
        title: '紅石自動踏板雙開門＋景觀穿堂',
        concept: '踩壓踏板自動向兩側滑開的機械石門，穿堂兩側種植發光漿果與流動水幕。',
        accessibilityFeature: '走近自動開啟，無需點擊滑鼠右鍵或操作繁複開關。',
        votes: ['app-02']
      },
      {
        id: 'prop-03',
        taskId: 'task-01',
        applicantId: 'app-03',
        authorNickname: '海風',
        title: '自然藤蔓綠意廊道',
        concept: '木質拱架搭滿垂掛藤蔓與花盆，地面鋪設防滑青苔毯，營造放鬆清幽森林氛圍。',
        accessibilityFeature: '無落差平坦草皮地毯，柔和自然漫射採光不刺眼。',
        votes: ['app-04']
      }
    ],
    contributionOptions: [
      {
        id: 'direct_build',
        title: '空間建造（放置方塊與實體搭建）',
        shortDesc: '進入 Minecraft Creative 共同世界放置方塊、鋪設路徑與搭建建築結構。',
        inputDescription: '支援鍵鼠、單手控制器、螢幕按鈕或無障礙輸入開關。',
        iconName: 'GameController'
      },
      {
        id: 'resource_sort',
        title: '景觀配置（植栽、照明與風格色彩）',
        shortDesc: '挑選並放置植栽花草、光照光源、裝飾小物與建築外觀配色調和。',
        inputDescription: '單一功能點選放置或選色建議，步調緩和，無操作手速壓力。',
        iconName: 'Package'
      },
      {
        id: 'design_choice',
        title: '設計規劃（動線配置與格局提案）',
        shortDesc: '在小組討論板瀏覽建築草圖、提出空間動線規劃與設計構想表決。',
        inputDescription: '純瀏覽與點擊投票，無需頻繁微調畫面或精準瞄準。',
        iconName: 'PaintBrush'
      },
      {
        id: 'text_voice_coord',
        title: '導覽敘事（空間命名、導覽標示與基地故事）',
        shortDesc: '為小隊建築設計迎賓標示、命名景點、撰寫故事背景與導覽指引。',
        inputDescription: '文字輸入、語音轉文字或提示詞輔助，以溝通創作凝聚共同記憶。',
        iconName: 'Sparkle'
      }
    ],
    stepProgress: 65,
    completedSummary: '小組以 2 票支持選定小禾提案「中世紀石磚門樓」；阿木負責空間建造，海風與雲雀協助景觀配置與導覽敘事。'
  }
];

// FR-06: 求助、暫停與切換方式紀錄
export const INITIAL_HELP_REQUESTS: HelpRequestRecord[] = [
  {
    id: 'help-01',
    applicantId: 'app-04',
    nickname: '雲雀',
    sessionId: 'ses-03',
    requestType: '換參與方式',
    note: '手部控制稍疲憊，想從空間建造改為設計規劃與景觀配置。',
    submittedAt: '2026-10-28 19:48',
    status: '已由主持人支援',
    hostReply: '沒問題雲雀！已將您切換至設計規劃模式，請安心休息放鬆雙手。',
    handledAt: '2026-10-28 19:50'
  }
];

// FR-07: 低壓力回顧題目（可跳過）
export const INITIAL_REFLECTIONS: ReflectionQuestion[] = [
  {
    id: 'refl-01',
    sessionId: 'ses-03',
    question: '今天基地建設中，哪個決定或細節是大家一起討論想出來的？',
    category: '共同決策',
    answers: [
      {
        applicantId: 'app-01',
        nickname: '小禾',
        text: '原本擔心拱橋斜率太陡，阿木建議拉長兩側引道，走起來平順很多！',
        submittedAt: '2026-10-28 20:45'
      },
      {
        applicantId: 'app-02',
        nickname: '阿木',
        text: '小禾選的螢石地燈顏色很溫柔，海風鋪的花架也超搭。',
        submittedAt: '2026-10-28 20:47'
      }
    ]
  },
  {
    id: 'refl-02',
    sessionId: 'ses-03',
    question: '下次聚會，你最期待看到基地的哪一個新部分出現？',
    category: '下次期待',
    answers: [
      {
        applicantId: 'app-03',
        nickname: '海風',
        text: '希望能把水上高架鐵路開通，這樣隨時能坐礦車環島！',
        submittedAt: '2026-10-28 20:48'
      }
    ]
  }
];

// FR-09: 下次活動共同計畫選項
export const INITIAL_NEXT_PLAN_OPTIONS: NextPlanOption[] = [
  {
    id: 'npo-01',
    groupId: 'grp-01',
    targetTitle: '延伸水上無障礙高架景觀鐵路 (觀光礦車)',
    description: '連接迎賓入口與水上涼亭，全線平穩自動運行，沿途欣賞成員共同打造的花園景致。',
    votes: ['app-01', 'app-03', 'app-04']
  },
  {
    id: 'npo-02',
    groupId: 'grp-01',
    targetTitle: '中央博物館與同儕回憶藏寶閣',
    description: '每位成員擁有一座專屬展示台，收藏前幾週活動留下的手札書、特殊方塊與紀念照片。',
    votes: ['app-02']
  }
];

// FR-15: 自願的線下／活動外探索提案（示範模擬，強調透明與可及性待確認）
export const INITIAL_OFFLINE_PROPOSALS: OfflineActivityProposal[] = [
  {
    id: 'off-01',
    groupId: 'grp-01',
    title: '無障礙科技輔具與數位生活體驗展（小組自願小聚探索）',
    description: '成員討論有意願一起參觀年度無障礙科技展，並於展場友善咖啡座實體聊天。本項完全自願，不影響線上小組權益。',
    transitStatus: '待確認：鄰近捷運站全平坦坡道及低底盤公車班次',
    accessibilityStatus: '待確認：服務專員需先現場會勘輪椅無障礙通道與升降機尺寸',
    feeStatus: '待確認：身心障礙者及必要陪伴者免票優惠辦法查核中',
    isSimulation: true,
    responses: {
      'app-01': '有興趣',
      'app-02': '有興趣',
      'app-03': '想先繼續線上活動',
      'app-04': '暫不考慮'
    }
  }
];

// PRD 第 9 節：9 步驟端到端演示情境 Meta
export const SCENARIO_STEPS_META: ScenarioStepMeta[] = [
  {
    step: 1,
    title: '回到小組基地',
    shortDesc: '進入我的基地，查看固定小組、歷史成果（水上花園與步道）及未完成項目。',
    targetRole: 'participant',
    actionHint: '檢視頂部基地摘要與作品歷程卡片'
  },
  {
    step: 2,
    title: '打開合作任務板',
    shortDesc: '查看本週共同目標「建設基地無障礙迎賓入口」與 4 種多元貢獻方式。',
    targetRole: 'participant',
    actionHint: '切換至任務板並瀏覽貢獻方式選項'
  },
  {
    step: 3,
    title: '提交提案與小組投票',
    shortDesc: '小禾提出「柔光拱橋」，小組成員投票，即時計算勝出並更新共同決定。',
    targetRole: 'participant',
    actionHint: '點擊小禾提案「投票支持」使票數領先'
  },
  {
    step: 4,
    title: '切換參與方式',
    shortDesc: '示範成員將「直接操作遊戲」切換為「提出/篩選設計」，無診斷或障礙標籤。',
    targetRole: 'participant',
    actionHint: '點選貢獻方式切換為「提出或篩選設計方案」'
  },
  {
    step: 5,
    title: '請求協助與主持人回應',
    shortDesc: '成員點擊求助，主持人控制台即刻接收並回應「已完成支援」，參與者端顯示確認。',
    targetRole: 'host',
    actionHint: '切換至陳主持控制台並點擊「立即回應並支援」'
  },
  {
    step: 6,
    title: '活動結束與共同成果摘要',
    shortDesc: '產出本次活動共同摘要（選定入口風格、採納想法、下次接續項目）。',
    targetRole: 'participant',
    actionHint: '檢視生成的活動成果摘要卡'
  },
  {
    step: 7,
    title: '可跳過回顧與下次計畫',
    shortDesc: '回答無壓力對話提示（可自由略過），投票決定下次共同目標（高架鐵路）。',
    targetRole: 'participant',
    actionHint: '點選投票「延伸水上無障礙高架鐵路」'
  },
  {
    step: 8,
    title: '主持人小組互動摘要',
    shortDesc: '主持人檢視小組層級互動指標（共同決策、互助處理），無個人友誼分數。',
    targetRole: 'host',
    actionHint: '檢視主持人端小組互動觀察統計'
  },
  {
    step: 9,
    title: '自願線下／活動外提案',
    shortDesc: '探索科技展小聚意願，明確標明地點/交通待確認，拒絕或暫不考慮不扣分。',
    targetRole: 'participant',
    actionHint: '瀏覽自願線下探索卡並表達意願'
  }
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'ses-01',
    groupId: 'grp-01',
    weekNumber: 1,
    scheduledAt: '2026-10-14 19:30',
    durationMinutes: 90,
    title: '第 1 週：初次相遇與家園基地選址',
    goal: '認識小組夥伴、熟悉操作、共同在空島上挑選地標並插上隊旗',
    hostName: '陳主持',
    backupContact: '02-2345-6789 / LINE 官方緊急群',
    joinGuide: {
      gamePlatform: 'Minecraft (Java/Bedrock 跨平台 Creative)',
      serverAddress: 'mc.handinhand.demo:25565',
      voiceChannel: '攜手 Discord #翠鳥組專用房 (支援同屏文字筆記)',
      guideSteps: [
        '活動前 15 分鐘開機確認網路',
        '開啟 Minecraft 點選多人連線並輸入伺服器地址',
        '進入後向接待員小幫手打招呼即可傳送至基地廣場',
        '若連線超時，立即在備援 LINE 群呼叫主持人'
      ]
    },
    status: '已發布',
    attendance: {
      'app-01': '出席',
      'app-02': '出席',
      'app-03': '出席',
      'app-04': '事先請假'
    },
    hasCollaboration: true,
    summaryNotes: '初次破冰熱絡，阿木與小禾分工建立標誌塔，文字互動順暢。'
  },
  {
    id: 'ses-02',
    groupId: 'grp-01',
    weekNumber: 2,
    scheduledAt: '2026-10-21 19:30',
    durationMinutes: 90,
    title: '第 2 週：同儕水上花園協力建造',
    goal: '四人合力完成一條無障礙環湖步道與水上休憩涼亭',
    hostName: '陳主持',
    backupContact: '02-2345-6789 / LINE 官方緊急群',
    joinGuide: {
      gamePlatform: 'Minecraft Creative 模式',
      serverAddress: 'mc.handinhand.demo:25565',
      voiceChannel: '攜手 Discord #翠鳥組專用房',
      guideSteps: [
        '直接登入伺服器',
        '輸入指令 /warp garden 傳送至水上花園預定地',
        '主持人確認全員就位後宣布分配材料區'
      ]
    },
    status: '已發布',
    attendance: {
      'app-01': '出席',
      'app-02': '出席',
      'app-03': '出席',
      'app-04': '出席'
    },
    hasCollaboration: true,
    summaryNotes: '全員到齊，雲雀手把適應良好，步道由小禾與阿木共同鋪設完畢。'
  },
  {
    id: 'ses-03',
    groupId: 'grp-01',
    weekNumber: 3,
    scheduledAt: '2026-10-28 19:30',
    durationMinutes: 90,
    title: '第 3 週：基地迎賓入口與地標建設',
    goal: '投票決定迎賓拱橋造型，全員分工搭建無障礙引道與照明地燈',
    hostName: '陳主持',
    backupContact: '02-2345-6789 / LINE 官方緊急群',
    joinGuide: {
      gamePlatform: 'Minecraft Creative 模式',
      serverAddress: 'mc.handinhand.demo:25565',
      voiceChannel: '攜手 Discord #翠鳥組專用房',
      guideSteps: [
        '登入後由主持人引導傳送至基地大門廣場',
        '領取白石英與螢石建材箱',
        '依小組選定之提案分工合作'
      ]
    },
    status: '已發布',
    attendance: {
      'app-01': '出席',
      'app-02': '出席',
      'app-03': '出席',
      'app-04': '出席'
    },
    hasCollaboration: true,
    summaryNotes: '小組完成柔光拱橋入口，阿木與小禾密切配合，雲雀透過切換參與方式保持投入。'
  },
  {
    id: 'ses-04',
    groupId: 'grp-01',
    weekNumber: 4,
    scheduledAt: '2026-11-04 19:30',
    durationMinutes: 90,
    title: '第 4 週：水上高架景觀鐵道聯網',
    goal: '依小組共同決策，鋪設觀光礦車鐵路並串連水上花園與迎賓入口',
    hostName: '陳主持',
    backupContact: '02-2345-6789',
    joinGuide: {
      gamePlatform: 'Minecraft Creative 模式',
      serverAddress: 'mc.handinhand.demo:25565',
      voiceChannel: '攜手 Discord #翠鳥組專用房',
      guideSteps: [
        '待確認詳細線路分配後公佈'
      ]
    },
    status: '待發布',
    attendance: {},
    hasCollaboration: false
  }
];

export const INITIAL_FEEDBACKS: Feedback[] = [
  {
    id: 'fb-01',
    sessionId: 'ses-01',
    applicantId: 'app-01',
    submittedAt: '2026-10-14 21:10',
    overallRating: 5,
    peerConnectionFeeling: 4,
    enjoyedCoop: true,
    wantsNextSession: true,
    freeComment: '本來很擔心跟不上大家，但大家都等我用文字溝通，很溫暖！'
  },
  {
    id: 'fb-02',
    sessionId: 'ses-01',
    applicantId: 'app-02',
    submittedAt: '2026-10-14 21:15',
    overallRating: 5,
    peerConnectionFeeling: 5,
    enjoyedCoop: true,
    wantsNextSession: true,
    freeComment: '很久沒有跟固定的同儕一起蓋東西了，很有成就感。'
  },
  {
    id: 'fb-03',
    sessionId: 'ses-02',
    applicantId: 'app-01',
    submittedAt: '2026-10-21 21:05',
    overallRating: 5,
    peerConnectionFeeling: 5,
    enjoyedCoop: true,
    wantsNextSession: true,
    freeComment: '今天跟阿木一起完成了水上步道，超漂亮！'
  }
];

export const INITIAL_ISSUES: IssueReport[] = [
  {
    id: 'iss-01',
    applicantId: 'app-01',
    sessionId: 'ses-02',
    category: '技術問題',
    submittedAt: '2026-10-21 19:40',
    description: '剛進入水上花園區域時材質包載入延遲，畫面有些微卡頓。',
    status: '處理中',
    adminResponse: '已請技術志工在伺服端預先載入快取，並提供精簡材質設定指南。',
    followUpPlan: '第 3 週開場前 10 分鐘協助小禾預載確認。',
    handledAt: '2026-10-22 10:00'
  },
  {
    id: 'iss-02',
    applicantId: 'app-03',
    category: '互動與安全',
    submittedAt: '2026-10-23 15:20',
    description: '其他語音房有成員說話音量突然過大，希望能提醒大家維持適當音量。',
    status: '新案件',
    adminResponse: '服務協調員已標註，將於活動前廣播「麥克風音量校準」指引。',
    followUpPlan: '主持人於第 3 週宣導社群音量禮儀。'
  },
  {
    id: 'iss-03',
    applicantId: 'app-04',
    sessionId: 'ses-01',
    category: '技術問題',
    submittedAt: '2026-10-14 19:25',
    description: '手把左類比鍵位在進入全螢幕時無效。',
    status: '已處理',
    adminResponse: '協助切換至無邊框視窗模式即解決。',
    followUpPlan: '已記錄於該成員專屬無障礙備忘。',
    handledAt: '2026-10-14 19:35'
  }
];

export const INITIAL_FOLLOW_UPS: FollowUpRecord[] = [
  {
    applicantId: 'app-01',
    status: '追蹤待回覆',
    willingToStayInTouch: null,
    overallSatisfaction: null,
  },
  {
    applicantId: 'app-02',
    status: '追蹤已完成',
    willingToStayInTouch: true,
    overallSatisfaction: 5,
    submittedAt: '2026-10-27 15:00',
    feedbackText: '8 週結束後我們私下開了小群繼續一起打建築，很有歸屬感！'
  }
];
