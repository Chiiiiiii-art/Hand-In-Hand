import { Application, Group, Session, Feedback, IssueReport, FollowUpRecord } from './types';

// 虛構示範參與者（包含成功路徑主角「小禾」，以及滿足 5 種狀態的資料）
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
    accessibilityCheck: {
      deviceConfirmed: true,
      controlsConfirmed: true,
      communicationConfirmed: true,
      supportNeedConfirmed: true,
    },
    adminNotes: '初次視訊測試順利，自備大軌跡球，建議搭配純文字頻道支援。',
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
    adminNotes: '四項檢核全數合格，等待安排進第二梯次或補入青鳥組。',
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
    adminNotes: '需安排 15 分鐘通話測試舊筆電規格與網路延遲。',
  },
  {
    id: 'app-07',
    submittedAt: '2026-10-28 14:00',
    nickname: '晨曦',
    age: 28,
    contactInfo: 'Line: morning_sun',
    shareContactConsent: false,
    agreedRules: false, // 尚未完成同意
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
    name: '青鳥一組 (試辦固定組)',
    fixedTimeSlot: '每週三晚間 19:30 - 21:00',
    hostName: '陳主持 (資深社工師)',
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
      voiceChannel: '攜手 Discord #青鳥組專用房 (支援同屏文字筆記)',
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
      voiceChannel: '攜手 Discord #青鳥組專用房',
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
    title: '第 3 週：空中圖書館與同儕收藏室',
    goal: '運用彩色羊毛與發光方塊，為每位成員設計專屬閱讀小角落',
    hostName: '陳主持',
    backupContact: '02-2345-6789 / LINE 官方緊急群',
    joinGuide: {
      gamePlatform: 'Minecraft Creative 模式',
      serverAddress: 'mc.handinhand.demo:25565',
      voiceChannel: '攜手 Discord #青鳥組專用房',
      guideSteps: [
        '登入後由主持人引導傳送至空中平台',
        '領取無限制建材箱',
        '有任何疑問隨時在聊天室輸入 @主持'
      ]
    },
    status: '已發布',
    attendance: {
      'app-01': '未記錄',
      'app-02': '未記錄',
      'app-03': '未記錄',
      'app-04': '未記錄'
    },
    hasCollaboration: false,
    summaryNotes: ''
  },
  {
    id: 'ses-04',
    groupId: 'grp-01',
    weekNumber: 4,
    scheduledAt: '2026-11-04 19:30',
    durationMinutes: 90,
    title: '第 4 週：地下鐵道聯網探險',
    goal: '規劃並鋪設連結各個基地的礦車觀光鐵路',
    hostName: '陳主持',
    backupContact: '02-2345-6789',
    joinGuide: {
      gamePlatform: 'Minecraft Creative 模式',
      serverAddress: 'mc.handinhand.demo:25565',
      voiceChannel: '攜手 Discord #青鳥組專用房',
      guideSteps: [
        '待確認詳細線路分配後公佈'
      ]
    },
    status: '待發布', // 待發布狀態展示
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
