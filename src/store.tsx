import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Application,
  Group,
  Session,
  Feedback,
  IssueReport,
  FollowUpRecord,
  CurrentRole,
  ApplicationStatus,
  SessionStatus,
  AttendanceStatus,
  IssueStatus,
  AccessibilityChecklist
} from './types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_GROUPS,
  INITIAL_SESSIONS,
  INITIAL_FEEDBACKS,
  INITIAL_ISSUES,
  INITIAL_FOLLOW_UPS
} from './seed';

interface AppState {
  currentRole: CurrentRole;
  currentParticipantId: string; // 當前視角主角，預設 'app-01' (小禾)
  applications: Application[];
  groups: Group[];
  sessions: Session[];
  feedbacks: Feedback[];
  issues: IssueReport[];
  followUps: FollowUpRecord[];
  isDemoGuideOpen: boolean;
  toastMessage: string | null;
}

type Action =
  | { type: 'SET_ROLE'; role: CurrentRole }
  | { type: 'SET_PARTICIPANT_ID'; id: string }
  | { type: 'TOGGLE_DEMO_GUIDE' }
  | { type: 'SET_DEMO_GUIDE_OPEN'; open: boolean }
  | { type: 'SET_TOAST'; message: string | null }
  | { type: 'RESET_DATA' }
  | { type: 'SUBMIT_APPLICATION'; application: Omit<Application, 'id' | 'submittedAt' | 'status' | 'accessibilityCheck' | 'adminNotes'> }
  | { type: 'UPDATE_ACCESSIBILITY_CHECK'; id: string; checks: Partial<AccessibilityChecklist> }
  | { type: 'UPDATE_APPLICATION_STATUS'; id: string; status: ApplicationStatus; notes?: string }
  | { type: 'ASSIGN_GROUP'; applicantId: string; groupId: string }
  | { type: 'UPDATE_SESSION_STATUS'; sessionId: string; status: SessionStatus }
  | { type: 'RECORD_ATTENDANCE'; sessionId: string; applicantId: string; status: AttendanceStatus }
  | { type: 'UPDATE_SESSION_NOTES'; sessionId: string; summaryNotes: string; hasCollaboration: boolean }
  | { type: 'SUBMIT_FEEDBACK'; feedback: Omit<Feedback, 'id' | 'submittedAt'> }
  | { type: 'SUBMIT_ISSUE'; issue: Omit<IssueReport, 'id' | 'submittedAt' | 'status'> }
  | { type: 'UPDATE_ISSUE_STATUS'; id: string; status: IssueStatus; adminResponse?: string; followUpPlan?: string }
  | { type: 'SUBMIT_FOLLOW_UP'; record: FollowUpRecord };

const STORAGE_KEY = 'hand_in_hand_state_v1';

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return {
    currentRole: 'participant',
    currentParticipantId: 'app-01',
    applications: INITIAL_APPLICATIONS,
    groups: INITIAL_GROUPS,
    sessions: INITIAL_SESSIONS,
    feedbacks: INITIAL_FEEDBACKS,
    issues: INITIAL_ISSUES,
    followUps: INITIAL_FOLLOW_UPS,
    isDemoGuideOpen: true,
    toastMessage: null,
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.role };

    case 'SET_PARTICIPANT_ID':
      return { ...state, currentParticipantId: action.id };

    case 'TOGGLE_DEMO_GUIDE':
      return { ...state, isDemoGuideOpen: !state.isDemoGuideOpen };

    case 'SET_DEMO_GUIDE_OPEN':
      return { ...state, isDemoGuideOpen: action.open };

    case 'SET_TOAST':
      return { ...state, toastMessage: action.message };

    case 'RESET_DATA': {
      localStorage.removeItem(STORAGE_KEY);
      return {
        currentRole: 'participant',
        currentParticipantId: 'app-01',
        applications: INITIAL_APPLICATIONS,
        groups: INITIAL_GROUPS,
        sessions: INITIAL_SESSIONS,
        feedbacks: INITIAL_FEEDBACKS,
        issues: INITIAL_ISSUES,
        followUps: INITIAL_FOLLOW_UPS,
        isDemoGuideOpen: true,
        toastMessage: '已重置為初始示範資料！',
      };
    }

    case 'SUBMIT_APPLICATION': {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newId = `app-${Date.now().toString().slice(-4)}`;
      const newApp: Application = {
        ...action.application,
        id: newId,
        submittedAt: dateStr,
        status: '待確認',
        accessibilityCheck: {
          deviceConfirmed: false,
          controlsConfirmed: false,
          communicationConfirmed: false,
          supportNeedConfirmed: false,
        },
        adminNotes: '',
      };
      return {
        ...state,
        applications: [newApp, ...state.applications],
        currentParticipantId: newId,
        toastMessage: `報名已收到！已切換至新送出者【${newApp.nickname}】`,
      };
    }

    case 'UPDATE_ACCESSIBILITY_CHECK': {
      const updatedApps = state.applications.map(app => {
        if (app.id !== action.id) return app;
        const newCheck = { ...app.accessibilityCheck, ...action.checks };
        return { ...app, accessibilityCheck: newCheck };
      });
      return { ...state, applications: updatedApps };
    }

    case 'UPDATE_APPLICATION_STATUS': {
      const updatedApps = state.applications.map(app => {
        if (app.id !== action.id) return app;
        return {
          ...app,
          status: action.status,
          adminNotes: action.notes !== undefined ? action.notes : app.adminNotes,
        };
      });
      return {
        ...state,
        applications: updatedApps,
        toastMessage: `申請狀態已更新為【${action.status}】`,
      };
    }

    case 'ASSIGN_GROUP': {
      const targetGroup = state.groups.find(g => g.id === action.groupId);
      if (!targetGroup) return state;

      const applicant = state.applications.find(a => a.id === action.applicantId);
      if (!applicant) return state;

      // 更新申請者狀態為已入組
      const updatedApps = state.applications.map(a =>
        a.id === action.applicantId
          ? { ...a, status: '已入組' as ApplicationStatus, assignedGroupId: action.groupId }
          : a
      );

      // 更新小組成員清單
      const updatedGroups = state.groups.map(g => {
        if (g.id !== action.groupId) return g;
        const exists = g.members.some(m => m.applicantId === action.applicantId);
        if (exists) return g;
        return {
          ...g,
          members: [
            ...g.members,
            {
              applicantId: applicant.id,
              nickname: applicant.nickname,
              joinedAt: new Date().toISOString().split('T')[0],
              role: '成員' as const,
            }
          ]
        };
      });

      return {
        ...state,
        applications: updatedApps,
        groups: updatedGroups,
        toastMessage: `已將【${applicant.nickname}】安排至【${targetGroup.name}】並標記為已入組！`,
      };
    }

    case 'UPDATE_SESSION_STATUS': {
      const updatedSessions = state.sessions.map(s =>
        s.id === action.sessionId ? { ...s, status: action.status } : s
      );
      return {
        ...state,
        sessions: updatedSessions,
        toastMessage: `場次狀態已更新為【${action.status}】`,
      };
    }

    case 'RECORD_ATTENDANCE': {
      const updatedSessions = state.sessions.map(s => {
        if (s.id !== action.sessionId) return s;
        return {
          ...s,
          attendance: {
            ...s.attendance,
            [action.applicantId]: action.status,
          }
        };
      });
      return { ...state, sessions: updatedSessions };
    }

    case 'UPDATE_SESSION_NOTES': {
      const updatedSessions = state.sessions.map(s =>
        s.id === action.sessionId
          ? { ...s, summaryNotes: action.summaryNotes, hasCollaboration: action.hasCollaboration }
          : s
      );
      return {
        ...state,
        sessions: updatedSessions,
        toastMessage: '場次紀錄與協作摘要已保存',
      };
    }

    case 'SUBMIT_FEEDBACK': {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newFeedback: Feedback = {
        ...action.feedback,
        id: `fb-${Date.now().toString().slice(-4)}`,
        submittedAt: dateStr,
      };
      return {
        ...state,
        feedbacks: [newFeedback, ...state.feedbacks],
        toastMessage: '感謝您的回饋！活動紀錄已同步至服務後台。',
      };
    }

    case 'SUBMIT_ISSUE': {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newIssue: IssueReport = {
        ...action.issue,
        id: `iss-${Date.now().toString().slice(-4)}`,
        submittedAt: dateStr,
        status: '新案件',
      };
      return {
        ...state,
        issues: [newIssue, ...state.issues],
        toastMessage: '問題已收到！主持人與管理專員將依安全流程協助處理。',
      };
    }

    case 'UPDATE_ISSUE_STATUS': {
      const updatedIssues = state.issues.map(iss => {
        if (iss.id !== action.id) return iss;
        return {
          ...iss,
          status: action.status,
          adminResponse: action.adminResponse ?? iss.adminResponse,
          followUpPlan: action.followUpPlan ?? iss.followUpPlan,
          handledAt: action.status === '已處理' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : iss.handledAt,
        };
      });
      return {
        ...state,
        issues: updatedIssues,
        toastMessage: `問題單已更新為【${action.status}】`,
      };
    }

    case 'SUBMIT_FOLLOW_UP': {
      const existingIndex = state.followUps.findIndex(f => f.applicantId === action.record.applicantId);
      let updatedFollowUps: FollowUpRecord[];
      if (existingIndex >= 0) {
        updatedFollowUps = [...state.followUps];
        updatedFollowUps[existingIndex] = action.record;
      } else {
        updatedFollowUps = [action.record, ...state.followUps];
      }
      return {
        ...state,
        followUps: updatedFollowUps,
        toastMessage: '已完成結束後追蹤登記！感謝您的寶貴回覆。',
      };
    }

    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  // Toast 自動消失
  useEffect(() => {
    if (state.toastMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_TOAST', message: null });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.toastMessage]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export function useAppStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useAppStore must be used within StoreProvider');
  }
  return ctx;
}
