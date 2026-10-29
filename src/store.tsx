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
  AccessibilityChecklist,
  GroupBaseWorld,
  CoopTask,
  TaskProposal,
  ContributionModeId,
  HelpRequestRecord,
  ReflectionQuestion,
  NextPlanOption,
  OfflineActivityProposal,
  ScenarioStepNumber
} from './types';
import {
  INITIAL_APPLICATIONS,
  INITIAL_GROUPS,
  INITIAL_SESSIONS,
  INITIAL_FEEDBACKS,
  INITIAL_ISSUES,
  INITIAL_FOLLOW_UPS,
  INITIAL_BASE_WORLDS,
  INITIAL_COOP_TASKS,
  INITIAL_HELP_REQUESTS,
  INITIAL_REFLECTIONS,
  INITIAL_NEXT_PLAN_OPTIONS,
  INITIAL_OFFLINE_PROPOSALS
} from './seed';

interface AppState {
  currentRole: CurrentRole;
  currentParticipantId: string; // 預設主角 'app-01' (小禾)
  currentScenarioStep: ScenarioStepNumber; // PRD 第 9 節情境步數 (1-9)
  isScenarioGuideOpen: boolean;
  baseWorlds: GroupBaseWorld[];
  coopTasks: CoopTask[];
  helpRequests: HelpRequestRecord[];
  reflections: ReflectionQuestion[];
  nextPlanOptions: NextPlanOption[];
  offlineProposals: OfflineActivityProposal[];
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
  | { type: 'SET_SCENARIO_STEP'; step: ScenarioStepNumber }
  | { type: 'TOGGLE_SCENARIO_GUIDE' }
  | { type: 'TOGGLE_DEMO_GUIDE' }
  | { type: 'SET_DEMO_GUIDE_OPEN'; open: boolean }
  | { type: 'SET_TOAST'; message: string | null }
  | { type: 'RESET_DATA' }
  // PRD v2.0 友誼支持與合作任務 Actions
  | { type: 'VOTE_PROPOSAL'; taskId: string; proposalId: string; applicantId: string }
  | { type: 'SUBMIT_PROPOSAL'; taskId: string; proposal: Omit<TaskProposal, 'id' | 'votes'> }
  | { type: 'CHANGE_CONTRIBUTION_MODE'; applicantId: string; mode: ContributionModeId }
  | { type: 'SUBMIT_HELP_REQUEST'; applicantId: string; sessionId: string; requestType: HelpRequestRecord['requestType']; note: string }
  | { type: 'RESPOND_HELP_REQUEST'; id: string; hostReply: string }
  | { type: 'SUBMIT_REFLECTION_ANSWER'; questionId: string; applicantId: string; text: string }
  | { type: 'VOTE_NEXT_PLAN'; optionId: string; applicantId: string }
  | { type: 'VOTE_OFFLINE_PROPOSAL'; proposalId: string; applicantId: string; choice: '有興趣' | '暫不考慮' | '想先繼續線上活動' }
  | { type: 'UPDATE_TASK_PROGRESS'; taskId: string; progress: number; status?: CoopTask['status'] }
  // 原有行政與服務管理 Actions
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

const STORAGE_KEY = 'hand_in_hand_state_v2';

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // 確保 PRD v2.0 欄位存在
      if (parsed.baseWorlds && parsed.coopTasks && parsed.currentScenarioStep) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return {
    currentRole: 'participant',
    currentParticipantId: 'app-01',
    currentScenarioStep: 1,
    isScenarioGuideOpen: true,
    baseWorlds: INITIAL_BASE_WORLDS,
    coopTasks: INITIAL_COOP_TASKS,
    helpRequests: INITIAL_HELP_REQUESTS,
    reflections: INITIAL_REFLECTIONS,
    nextPlanOptions: INITIAL_NEXT_PLAN_OPTIONS,
    offlineProposals: INITIAL_OFFLINE_PROPOSALS,
    applications: INITIAL_APPLICATIONS,
    groups: INITIAL_GROUPS,
    sessions: INITIAL_SESSIONS,
    feedbacks: INITIAL_FEEDBACKS,
    issues: INITIAL_ISSUES,
    followUps: INITIAL_FOLLOW_UPS,
    isDemoGuideOpen: false,
    toastMessage: null,
  };
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.role };

    case 'SET_PARTICIPANT_ID':
      return { ...state, currentParticipantId: action.id };

    case 'SET_SCENARIO_STEP':
      return { ...state, currentScenarioStep: action.step };

    case 'TOGGLE_SCENARIO_GUIDE':
      return { ...state, isScenarioGuideOpen: !state.isScenarioGuideOpen };

    case 'SET_DEMO_GUIDE_OPEN':
      return { ...state, isDemoGuideOpen: action.open };

    case 'TOGGLE_DEMO_GUIDE':
      return { ...state, isDemoGuideOpen: !state.isDemoGuideOpen };

    case 'SET_TOAST':
      return { ...state, toastMessage: action.message };

    case 'RESET_DATA': {
      localStorage.removeItem(STORAGE_KEY);
      return {
        currentRole: 'participant',
        currentParticipantId: 'app-01',
        currentScenarioStep: 1,
        isScenarioGuideOpen: true,
        baseWorlds: INITIAL_BASE_WORLDS,
        coopTasks: INITIAL_COOP_TASKS,
        helpRequests: INITIAL_HELP_REQUESTS,
        reflections: INITIAL_REFLECTIONS,
        nextPlanOptions: INITIAL_NEXT_PLAN_OPTIONS,
        offlineProposals: INITIAL_OFFLINE_PROPOSALS,
        applications: INITIAL_APPLICATIONS,
        groups: INITIAL_GROUPS,
        sessions: INITIAL_SESSIONS,
        feedbacks: INITIAL_FEEDBACKS,
        issues: INITIAL_ISSUES,
        followUps: INITIAL_FOLLOW_UPS,
        isDemoGuideOpen: false,
        toastMessage: '已重置為 PRD v2.0 初始示範資料！',
      };
    }

    // 提案投票 (FR-04)
    case 'VOTE_PROPOSAL': {
      const updatedTasks = state.coopTasks.map(task => {
        if (task.id !== action.taskId) return task;
        const updatedProposals = task.proposals.map(prop => {
          const hasVoted = prop.votes.includes(action.applicantId);
          if (prop.id === action.proposalId) {
            // 切換投票狀態
            const newVotes = hasVoted
              ? prop.votes.filter(id => id !== action.applicantId)
              : [...prop.votes, action.applicantId];
            return { ...prop, votes: newVotes };
          } else {
            // 單選投票：移除其他提案的票
            return {
              ...prop,
              votes: prop.votes.filter(id => id !== action.applicantId)
            };
          }
        });

        // 重新計算最高票提案
        let leadingPropId = task.activeProposalId;
        let highestVotes = -1;
        for (const p of updatedProposals) {
          if (p.votes.length > highestVotes) {
            highestVotes = p.votes.length;
            leadingPropId = p.id;
          }
        }

        return {
          ...task,
          proposals: updatedProposals,
          activeProposalId: leadingPropId
        };
      });

      return {
        ...state,
        coopTasks: updatedTasks,
        toastMessage: '已登記投票！小組共同決策狀態已即時更新。'
      };
    }

    // 新增提案 (FR-04)
    case 'SUBMIT_PROPOSAL': {
      const newProposal: TaskProposal = {
        ...action.proposal,
        id: `prop-${Date.now().toString().slice(-4)}`,
        votes: [action.proposal.applicantId]
      };
      const updatedTasks = state.coopTasks.map(task => {
        if (task.id !== action.taskId) return task;
        return {
          ...task,
          proposals: [newProposal, ...task.proposals],
          activeProposalId: newProposal.id
        };
      });
      return {
        ...state,
        coopTasks: updatedTasks,
        toastMessage: `提案【${newProposal.title}】已提交並加入小組討論！`
      };
    }

    // 切換貢獻方式 (FR-05: 不按診斷分派，參與者自主切換)
    case 'CHANGE_CONTRIBUTION_MODE': {
      const updatedApps = state.applications.map(app => {
        if (app.id !== action.applicantId) return app;
        return { ...app, currentContributionMode: action.mode };
      });
      return {
        ...state,
        applications: updatedApps,
        toastMessage: '已自主切換參與方式！共同成果將如實記錄您的協作貢獻。'
      };
    }

    // 求助與暫停 (FR-06)
    case 'SUBMIT_HELP_REQUEST': {
      const applicant = state.applications.find(a => a.id === action.applicantId);
      const nickname = applicant ? applicant.nickname : '成員';
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newHelp: HelpRequestRecord = {
        id: `help-${Date.now().toString().slice(-4)}`,
        applicantId: action.applicantId,
        nickname,
        sessionId: action.sessionId,
        requestType: action.requestType,
        note: action.note,
        submittedAt: `2026-10-28 ${timeStr}`,
        status: '待回應'
      };
      return {
        ...state,
        helpRequests: [newHelp, ...state.helpRequests],
        toastMessage: '已向主持人發出求助訊號！主持人控制台將即時接收與支援。'
      };
    }

    // 主持人回應求助 (FR-06, FR-12)
    case 'RESPOND_HELP_REQUEST': {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const updatedRequests = state.helpRequests.map(r => {
        if (r.id !== action.id) return r;
        return {
          ...r,
          status: '已由主持人支援' as const,
          hostReply: action.hostReply,
          handledAt: `2026-10-28 ${timeStr}`
        };
      });
      return {
        ...state,
        helpRequests: updatedRequests,
        toastMessage: '已完成求助支援！參與者端已收到確認通知。'
      };
    }

    // 回顧與共同記憶 (FR-07, FR-08)
    case 'SUBMIT_REFLECTION_ANSWER': {
      const applicant = state.applications.find(a => a.id === action.applicantId);
      const nickname = applicant ? applicant.nickname : '成員';
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const updatedReflections = state.reflections.map(r => {
        if (r.id !== action.questionId) return r;
        const exists = r.answers.some(ans => ans.applicantId === action.applicantId);
        const filtered = r.answers.filter(ans => ans.applicantId !== action.applicantId);
        return {
          ...r,
          answers: [
            ...filtered,
            {
              applicantId: action.applicantId,
              nickname,
              text: action.text,
              submittedAt: `2026-10-28 ${timeStr}`
            }
          ]
        };
      });
      return {
        ...state,
        reflections: updatedReflections,
        toastMessage: '感謝您的回顧想法！已收錄於小組共同記憶冊。'
      };
    }

    // 下次活動目標共同計畫 (FR-09)
    case 'VOTE_NEXT_PLAN': {
      const updatedOptions = state.nextPlanOptions.map(opt => {
        const hasVoted = opt.votes.includes(action.applicantId);
        if (opt.id === action.optionId) {
          const newVotes = hasVoted
            ? opt.votes.filter(id => id !== action.applicantId)
            : [...opt.votes, action.applicantId];
          return { ...opt, votes: newVotes };
        } else {
          return {
            ...opt,
            votes: opt.votes.filter(id => id !== action.applicantId)
          };
        }
      });
      return {
        ...state,
        nextPlanOptions: updatedOptions,
        toastMessage: '已為下次小組目標投票！共同計畫將接續下週活動。'
      };
    }

    // 自願線下／活動外探索提案 (FR-15: 尊重自主意願)
    case 'VOTE_OFFLINE_PROPOSAL': {
      const updatedProposals = state.offlineProposals.map(prop => {
        if (prop.id !== action.proposalId) return prop;
        return {
          ...prop,
          responses: {
            ...prop.responses,
            [action.applicantId]: action.choice
          }
        };
      });
      return {
        ...state,
        offlineProposals: updatedProposals,
        toastMessage: `已登記您的意願【${action.choice}】。選擇暫不考慮絕不影響線上活動參與權！`
      };
    }

    // 任務進度模擬更新
    case 'UPDATE_TASK_PROGRESS': {
      const updatedTasks = state.coopTasks.map(t => {
        if (t.id !== action.taskId) return t;
        return {
          ...t,
          stepProgress: action.progress,
          status: action.status || t.status
        };
      });
      return { ...state, coopTasks: updatedTasks };
    }

    // 原有報名提交
    case 'SUBMIT_APPLICATION': {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newId = `app-${Date.now().toString().slice(-4)}`;
      const newApp: Application = {
        ...action.application,
        id: newId,
        submittedAt: dateStr,
        status: '待確認',
        currentContributionMode: 'direct_build',
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

      const updatedApps = state.applications.map(a =>
        a.id === action.applicantId
          ? { ...a, status: '已入組' as ApplicationStatus, assignedGroupId: action.groupId }
          : a
      );

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
