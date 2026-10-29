import {
  Application,
  Session,
  Feedback,
  IssueReport,
  FollowUpRecord,
  CoopTask,
  HelpRequestRecord,
  NextPlanOption,
  OfflineActivityProposal
} from './types';

export interface ServiceMetrics {
  totalApplications: number;
  totalEnrolled: number;
  pendingApplications: number;
  
  attendanceRate: {
    percentage: number;
    attendedCount: number;
    scheduledCount: number;
    cancelledSessionsExcluded: number;
    formula: string;
  };

  repeatParticipationRate: {
    percentage: number;
    repeatMembersCount: number;
    eligibleMembersCount: number;
    formula: string;
  };

  peerConnectionAverage: {
    average: number;
    totalResponses: number;
    formula: string;
  };

  postProgramWillingness: {
    percentage: number;
    willingCount: number;
    totalAnswered: number;
    pendingCount: number;
    formula: string;
  };

  issueSummary: {
    total: number;
    unresolved: number;
    resolved: number;
    technical: number;
    safety: number;
    other: number;
  };
}

export interface GroupInteractionMetrics {
  totalTasksWithDecisions: number;
  totalProposalsSubmitted: number;
  proposalVoteParticipationRate: {
    percentage: number;
    votedMembersCount: number;
    activeMembersCount: number;
    formula: string;
  };
  contributionModeDistribution: {
    direct_build: number;
    design_choice: number;
    resource_sort: number;
    text_voice_coord: number;
  };
  helpRequestResponseRate: {
    percentage: number;
    handledCount: number;
    totalRequests: number;
    formula: string;
  };
  nextPlanConsensus: {
    leadingTarget: string;
    totalVotes: number;
    participationRate: number;
    formula: string;
  };
  offlineExploration: {
    interestedCount: number;
    continueOnlineCount: number;
    notConsideringCount: number;
    note: string;
  };
}

/**
 * 計算 PRD 第 8 章與第 9 章定義的所有指標
 * 嚴格遵循口徑：
 * - 示範資料標註（非實際服務成效）
 * - 缺席不等於不感興趣
 * - 未回覆與負面回饋分開
 * - 取消場次排除
 * - 絕不輸出個人友誼分數與社交排名
 */
export function calculateMetrics(
  applications: Application[],
  sessions: Session[],
  feedbacks: Feedback[],
  issues: IssueReport[],
  followUps: FollowUpRecord[]
): ServiceMetrics {
  const totalApplications = applications.length;
  const totalEnrolled = applications.filter(a => a.status === '已入組').length;
  const pendingApplications = applications.filter(a => a.status === '待確認' || a.status === '需後續聯繫').length;

  // 出席率計算：實際出席人次 ÷ 已安排參與人次（排除取消場次與未開場次）
  let attendedCount = 0;
  let scheduledCount = 0;
  let cancelledSessionsExcluded = 0;

  for (const session of sessions) {
    const attendanceEntries = Object.values(session.attendance);
    for (const status of attendanceEntries) {
      if (status === '出席') {
        attendedCount++;
        scheduledCount++;
      } else if (status === '缺席' || status === '事先請假') {
        scheduledCount++;
      }
    }
  }

  const attendancePercentage = scheduledCount > 0
    ? Math.round((attendedCount / scheduledCount) * 100)
    : 0;

  // 重複參與率：至少參與兩場成員數 ÷ 至少被安排一場成員數
  const memberAttendanceMap: Record<string, number> = {};
  const memberScheduledMap: Record<string, number> = {};

  for (const session of sessions) {
    for (const [applicantId, status] of Object.entries(session.attendance)) {
      if (status === '出席' || status === '缺席' || status === '事先請假') {
        memberScheduledMap[applicantId] = (memberScheduledMap[applicantId] || 0) + 1;
      }
      if (status === '出席') {
        memberAttendanceMap[applicantId] = (memberAttendanceMap[applicantId] || 0) + 1;
      }
    }
  }

  const eligibleMembers = Object.keys(memberScheduledMap).filter(id => memberScheduledMap[id] >= 1);
  const repeatMembers = eligibleMembers.filter(id => (memberAttendanceMap[id] || 0) >= 2);

  const repeatPercentage = eligibleMembers.length > 0
    ? Math.round((repeatMembers.length / eligibleMembers.length) * 100)
    : 0;

  // 歸屬感／同儕連結感平均分 (1-5 分自評)
  const totalFeedbackCount = feedbacks.length;
  const connectionSum = feedbacks.reduce((acc, cur) => acc + cur.peerConnectionFeeling, 0);
  const peerConnectionAvg = totalFeedbackCount > 0
    ? Number((connectionSum / totalFeedbackCount).toFixed(1))
    : 0;

  // 結束後仍有聯繫意願
  const answeredFollowUps = followUps.filter(f => f.willingToStayInTouch !== null);
  const willingCount = answeredFollowUps.filter(f => f.willingToStayInTouch === true).length;
  const pendingFollowUpCount = followUps.filter(f => f.status === '追蹤待回覆').length;
  const postWillingnessPercentage = answeredFollowUps.length > 0
    ? Math.round((willingCount / answeredFollowUps.length) * 100)
    : 0;

  // 事件彙總
  const unresolvedIssues = issues.filter(i => i.status !== '已處理').length;
  const resolvedIssues = issues.filter(i => i.status === '已處理').length;
  const technicalIssues = issues.filter(i => i.category === '技術問題').length;
  const safetyIssues = issues.filter(i => i.category === '互動與安全').length;
  const otherIssues = issues.filter(i => i.category === '其他問題').length;

  return {
    totalApplications,
    totalEnrolled,
    pendingApplications,
    attendanceRate: {
      percentage: attendancePercentage,
      attendedCount,
      scheduledCount,
      cancelledSessionsExcluded,
      formula: '實際出席人次 (出席) ÷ 已安排人次 (出席 + 缺席 + 請假)'
    },
    repeatParticipationRate: {
      percentage: repeatPercentage,
      repeatMembersCount: repeatMembers.length,
      eligibleMembersCount: eligibleMembers.length,
      formula: '至少出席 2 場成員數 ÷ 至少被安排 1 場成員數'
    },
    peerConnectionAverage: {
      average: peerConnectionAvg,
      totalResponses: totalFeedbackCount,
      formula: '參與者回饋之同儕連結感評分 (1-5分) 加總 ÷ 總回饋份數'
    },
    postProgramWillingness: {
      percentage: postWillingnessPercentage,
      willingCount,
      totalAnswered: answeredFollowUps.length,
      pendingCount: pendingFollowUpCount,
      formula: '願意維持聯繫人數 ÷ 已回覆追蹤人數（未回覆分開列示，不計入負面）'
    },
    issueSummary: {
      total: issues.length,
      unresolved: unresolvedIssues,
      resolved: resolvedIssues,
      technical: technicalIssues,
      safety: safetyIssues,
      other: otherIssues
    }
  };
}

/**
 * PRD v2.0 FR-17: 小組層級互動摘要計算
 * 專注於小組協作、決策、多元參與方式與求助處理，嚴禁個人排行
 */
export function calculateGroupInteractionMetrics(
  tasks: CoopTask[],
  applications: Application[],
  helpRequests: HelpRequestRecord[],
  nextPlanOptions: NextPlanOption[],
  offlineProposals: OfflineActivityProposal[]
): GroupInteractionMetrics {
  const activeMembers = applications.filter(a => a.status === '已入組');
  const activeMemberCount = activeMembers.length;

  let totalTasksWithDecisions = 0;
  let totalProposalsSubmitted = 0;
  const uniqueVoterSet = new Set<string>();

  for (const task of tasks) {
    totalProposalsSubmitted += task.proposals.length;
    let taskHasVotes = false;
    for (const proposal of task.proposals) {
      if (proposal.votes.length > 0) {
        taskHasVotes = true;
        proposal.votes.forEach(voterId => uniqueVoterSet.add(voterId));
      }
    }
    if (taskHasVotes || task.activeProposalId) {
      totalTasksWithDecisions++;
    }
  }

  const proposalVoteParticipationRate = activeMemberCount > 0
    ? Math.round((uniqueVoterSet.size / activeMemberCount) * 100)
    : 0;

  // 貢獻方式分佈
  const contributionModeDistribution = {
    direct_build: 0,
    design_choice: 0,
    resource_sort: 0,
    text_voice_coord: 0
  };

  for (const member of activeMembers) {
    const mode = member.currentContributionMode || 'direct_build';
    if (mode in contributionModeDistribution) {
      contributionModeDistribution[mode]++;
    }
  }

  // 求助與暫停回應率
  const totalHelpRequests = helpRequests.length;
  const handledHelpRequests = helpRequests.filter(r => r.status === '已由主持人支援').length;
  const helpResponsePercentage = totalHelpRequests > 0
    ? Math.round((handledHelpRequests / totalHelpRequests) * 100)
    : 100;

  // 下次活動計畫共識
  let leadingTarget = '尚無提案';
  let maxVotes = -1;
  const planVoterSet = new Set<string>();

  for (const opt of nextPlanOptions) {
    opt.votes.forEach(id => planVoterSet.add(id));
    if (opt.votes.length > maxVotes) {
      maxVotes = opt.votes.length;
      leadingTarget = opt.targetTitle;
    }
  }

  const nextPlanParticipation = activeMemberCount > 0
    ? Math.round((planVoterSet.size / activeMemberCount) * 100)
    : 0;

  // 線下活動自願探索（尊重成員意願，拒絕與暫不考慮不扣分）
  let interestedCount = 0;
  let continueOnlineCount = 0;
  let notConsideringCount = 0;

  if (offlineProposals.length > 0) {
    const latestProposal = offlineProposals[0];
    for (const res of Object.values(latestProposal.responses)) {
      if (res === '有興趣') interestedCount++;
      else if (res === '想先繼續線上活動') continueOnlineCount++;
      else if (res === '暫不考慮') notConsideringCount++;
    }
  }

  return {
    totalTasksWithDecisions,
    totalProposalsSubmitted,
    proposalVoteParticipationRate: {
      percentage: proposalVoteParticipationRate,
      votedMembersCount: uniqueVoterSet.size,
      activeMembersCount: activeMemberCount,
      formula: '參與提案投票成員數 ÷ 小組已入組總成員數'
    },
    contributionModeDistribution,
    helpRequestResponseRate: {
      percentage: helpResponsePercentage,
      handledCount: handledHelpRequests,
      totalRequests: totalHelpRequests,
      formula: '主持人已支援求助數 ÷ 總求助提出數'
    },
    nextPlanConsensus: {
      leadingTarget,
      totalVotes: planVoterSet.size,
      participationRate: nextPlanParticipation,
      formula: '參與下次計畫投票人數 ÷ 小組已入組總成員數'
    },
    offlineExploration: {
      interestedCount,
      continueOnlineCount,
      notConsideringCount,
      note: '所有線下探索均標記為待確認；拒絕或暫不考慮絕不視為負面指標'
    }
  };
}
