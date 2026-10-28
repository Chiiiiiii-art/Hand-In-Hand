// PRD 名詞與狀態定義（附錄 A & 第 5 章 FR）

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
}

export interface GroupMember {
  applicantId: string;
  nickname: string;
  joinedAt: string;
  role: '成員' | '小組長';
}

export interface Group {
  id: string;
  name: string;               // 例如：青鳥組、種子組
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

export type CurrentRole = 'participant' | 'admin';

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
