// PRD 名詞與狀態定義（附錄 A & 第 5 章 FR & v2.0 友誼支持系統架構）

export type ApplicationStatus = '待確認' | '需後續聯繫' | '可安排' | '已入組';

export type SessionStatus = '待發布' | '已發布';

export type AttendanceStatus = '出席' | '缺席' | '事先請假' | '未記錄';

export type IssueCategory = '技術問題' | '互動與安全' | '其他問題';
export type IssueStatus = '新案件' | '處理中' | '已處理';

export type FollowUpStatus = '追蹤待回覆' | '追蹤已完成';

export interface AccessibilityChecklist {
  deviceConfirmed: boolean;      // 設備已確認（電腦/控制設備）
  controlsConfirmed: boolean;    // 操作方式測試已確認（鍵鼠/手把/輔具）
  communicationConfirmed: boolean; // 文字/語音溝通偏好已確認
  supportNeedConfirmed: boolean; // 專案協助需求已確認
}

export interface Application {
  id: string;
  submittedAt: string;
  nickname: string;            // 暱稱（公開）
  age: number;                // 滿 18 歲檢查 (BR-01)
  contactInfo: string;        // 聯絡方式（限管理者後台可見，隱私保護）
  shareContactConsent: boolean;// 是否同意與其他成員分享聯絡方式（自願原則 BR-08）
  agreedRules: boolean;       // 是否同意參與規則 (BR-02)
  availableSlots: string[];   // 可用時段
  gamingExperience: string;   // 遊戲經驗簡述
  inputMethod: string;        // 偏好操作方式（滑鼠、單手鍵盤、眼控、手把、特殊開關等）
  communicationPreference: '文字為主' | '語音為主' | '兩者皆可'; // BR-05
  supportNeeds: string;       // 所需協助（不要求填寫醫療診斷 BR-09）
  status: ApplicationStatus;
  accessibilityCheck: AccessibilityChecklist;
  adminNotes: string;         // 管理者備註（限後台）
  assignedGroupId?: string;   // 所屬固定小組 ID
  currentContributionMode?: ContributionModeId; // 當前選擇的參與方式 (FR-05)
}

export interface GroupMember {
  applicantId: string;
  nickname: string;
  joinedAt: string;
  role: '成員' | '小組長';
}

export interface Group {
  id: string;
  name: string;               // 例如：翠鳥組、種子組
  fixedTimeSlot: string;      // 例如：每週三 19:30 - 21:00
  hostName: string;           // 活動主持人
  backupContact: string;      // 備援聯絡管道
  members: GroupMember[];
  createdAt: string;
}

export interface Session {
  id: string;
  groupId: string;
  weekNumber: number;
  scheduledAt: string;        // 例如 2026-11-04 19:30
  durationMinutes: number;    // 90
  title: string;
  goal: string;               // 本次共同任務目標
  hostName: string;
  backupContact: string;
  joinGuide: {
    gamePlatform: string;     // 如 Minecraft (Creative 模式)
    serverAddress: string;    // 如 mc.handinhand.demo:25565
    voiceChannel: string;     // 如 Discord 語音（可選，提供文字同步）
    guideSteps: string[];     // 加入步驟指引
  };
  status: SessionStatus;      // 待發布 / 已發布
  attendance: Record<string, AttendanceStatus>; // applicantId -> AttendanceStatus
  hasCollaboration: boolean;  // 是否有發生協作（主持人記錄 FR-10）
  summaryNotes?: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  applicantId: string;
  submittedAt: string;
  overallRating: number;      // 1-5
  peerConnectionFeeling: number; // 歸屬感/同儕連結感 1-5 (FR-10, §9)
  enjoyedCoop: boolean;       // 是否享受共同任務協作
  wantsNextSession: boolean;  // 下次參與意願
  freeComment: string;
}

export interface IssueReport {
  id: string;
  applicantId: string;
  sessionId?: string;
  category: IssueCategory;
  submittedAt: string;
  description: string;
  status: IssueStatus;
  adminResponse?: string;
  followUpPlan?: string;      // 後續安排/聯繫紀錄
  handledAt?: string;
}

export interface FollowUpRecord {
  applicantId: string;
  status: FollowUpStatus;
  willingToStayInTouch: boolean | null; // 結束後仍有聯繫意願
  overallSatisfaction: number | null;  // 1-5
  submittedAt?: string;
  feedbackText?: string;
}

// 角色切換：三角色（參與者、主持人、服務管理者）
export type CurrentRole = 'participant' | 'host' | 'admin';

// ==========================================
// PRD v2.0 友誼支持系統新增模型
// ==========================================

// FR-02 共同世界成果
export interface SharedDeliverable {
  id: string;
  title: string;
  weekNumber: number;
  description: string;
  category: '地標建築' | '無障礙步道' | '休閒空間' | '收藏展示';
  completedAt: string;
  imageTag: 'garden' | 'pavilion' | 'entrance' | 'library';
  highlight: string;
}

// FR-01 共同世界基地
export interface GroupBaseWorld {
  groupId: string;
  worldName: string;
  worldTheme: string;
  serverAddress: string;
  versionInfo: string;
  pastDeliverables: SharedDeliverable[];
  pendingTasksSummary: string[];
}

// FR-05 多元貢獻方式
export type ContributionModeId = 'direct_build' | 'design_choice' | 'resource_sort' | 'text_voice_coord';

export interface ContributionModeOption {
  id: ContributionModeId;
  title: string;
  shortDesc: string;
  inputDescription: string;
  iconName: string;
}

// FR-04 提案與共同決策
export interface TaskProposal {
  id: string;
  taskId: string;
  applicantId: string;
  authorNickname: string;
  title: string;
  concept: string;
  accessibilityFeature: string;
  votes: string[]; // 投票成員的 applicantId 列表
}

// FR-03 合作任務板
export interface CoopTask {
  id: string;
  sessionId: string;
  groupId: string;
  weekNumber: number;
  title: string;
  teamGoal: string;
  status: '討論提案中' | '進行協作中' | '完成待回顧' | '已歸檔';
  activeProposalId?: string; // 選定的提案
  proposals: TaskProposal[];
  contributionOptions: ContributionModeOption[];
  stepProgress: number; // 0-100%
  completedSummary?: string;
}

// FR-06 求助／暫停／切換方式雙向紀錄
export interface HelpRequestRecord {
  id: string;
  applicantId: string;
  nickname: string;
  sessionId: string;
  requestType: '換參與方式' | '操作卡關' | '需要小歇' | '其他支援';
  note: string;
  submittedAt: string;
  status: '待回應' | '已由主持人支援';
  hostReply?: string;
  handledAt?: string;
}

// FR-07 低壓力交流與回顧（可跳過）
export interface ReflectionQuestion {
  id: string;
  sessionId: string;
  question: string;
  category: '共同決策' | '互助時刻' | '下次期待';
  answers: {
    applicantId: string;
    nickname: string;
    text: string;
    submittedAt: string;
  }[];
}

// FR-09 下次活動共同計畫
export interface NextPlanOption {
  id: string;
  groupId: string;
  targetTitle: string;
  description: string;
  votes: string[]; // applicantId
}

// FR-15 自願的線下／活動外探索提案（PoC 模擬，明確標示待確認）
export interface OfflineActivityProposal {
  id: string;
  groupId: string;
  title: string;
  description: string;
  transitStatus: string;       // 待確認捷運/無障礙專車路線
  accessibilityStatus: string; // 場地無障礙設施待專員查核
  feeStatus: string;           // 費用/門票待確認
  isSimulation: boolean;       // 模擬標示
  responses: Record<string, '有興趣' | '暫不考慮' | '想先繼續線上活動'>; // applicantId -> 選擇
}

// PRD 第 9 節：9 步驟端到端演示情境
export type ScenarioStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface ScenarioStepMeta {
  step: ScenarioStepNumber;
  title: string;
  shortDesc: string;
  targetRole: CurrentRole;
  actionHint: string;
}

// 狀態解釋字典（FR-03 規定：每種狀態都有對應說明；不以沒有說明的代碼顯示）
export const STATUS_DESCRIPTIONS: Record<string, { label: string; desc: string; variant: 'info' | 'warning' | 'success' | 'neutral' | 'danger' }> = {
  '待確認': {
    label: '待確認',
    desc: '服務團隊已收到申請，正在確認資格、參與意願與操作可及性。',
    variant: 'warning'
  },
  '需後續聯繫': {
    label: '需後續聯繫',
    desc: '尚有設備操作或時段細節待進一步討論，我們會主動與您聯繫協調。',
    variant: 'warning'
  },
  '可安排': {
    label: '可安排',
    desc: '資格與參與方式已確認完成，正在安排適合的固定小組與場次。',
    variant: 'info'
  },
  '已入組': {
    label: '已入組',
    desc: '已成功加入固定小組！您現在可以查看小組成員與未來的活動場次。',
    variant: 'success'
  },
  '待發布': {
    label: '待發布',
    desc: '場次規劃中，待時間、目標與加入指引完整確認後正式發布。',
    variant: 'neutral'
  },
  '已發布': {
    label: '已發布',
    desc: '活動資訊、加入步驟與求助管道皆已確認，可直接查閱。',
    variant: 'success'
  },
  '新案件': {
    label: '新案件',
    desc: '問題回報已送達，等待管理者指派與處理。',
    variant: 'warning'
  },
  '處理中': {
    label: '處理中',
    desc: '服務團隊或主持人正在排除問題或進行安全處置。',
    variant: 'info'
  },
  '已處理': {
    label: '已處理',
    desc: '事件處置完畢並已記錄後續備忘。',
    variant: 'success'
  },
  '追蹤待回覆': {
    label: '追蹤待回覆',
    desc: '8 週週期已圓滿完成，邀請您填寫結束後續追蹤問卷。',
    variant: 'warning'
  },
  '追蹤已完成': {
    label: '追蹤已完成',
    desc: '感謝您完成後續追蹤！您的回饋是推動同儕服務成長的關鍵。',
    variant: 'success'
  }
};
