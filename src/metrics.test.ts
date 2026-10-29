import { describe, it, expect } from 'vitest';
import { calculateMetrics, calculateGroupInteractionMetrics } from './metrics';
import {
  INITIAL_APPLICATIONS,
  INITIAL_SESSIONS,
  INITIAL_FEEDBACKS,
  INITIAL_ISSUES,
  INITIAL_FOLLOW_UPS,
  INITIAL_COOP_TASKS,
  INITIAL_HELP_REQUESTS,
  INITIAL_NEXT_PLAN_OPTIONS,
  INITIAL_OFFLINE_PROPOSALS
} from './seed';

describe('PRD Metrics & Business Rule Calculations', () => {
  it('correctly calculates baseline metrics with mock data', () => {
    const metrics = calculateMetrics(
      INITIAL_APPLICATIONS,
      INITIAL_SESSIONS,
      INITIAL_FEEDBACKS,
      INITIAL_ISSUES,
      INITIAL_FOLLOW_UPS
    );

    expect(metrics.totalApplications).toBe(7);
    expect(metrics.totalEnrolled).toBe(4);
    expect(metrics.pendingApplications).toBe(2);

    // ses-01: 3 attended, 1 leave -> 3/4
    // ses-02: 4 attended -> 4/4
    // ses-03: 4 attended -> 4/4
    // total: 11 attended out of 12 scheduled -> 92%
    expect(metrics.attendanceRate.attendedCount).toBe(11);
    expect(metrics.attendanceRate.scheduledCount).toBe(12);
    expect(metrics.attendanceRate.percentage).toBe(92);

    // Repeat participation:
    // app-01 attended 3, app-02 attended 3, app-03 attended 3, app-04 attended 2
    // 4 out of 4 attended >= 2 times -> 100%
    expect(metrics.repeatParticipationRate.eligibleMembersCount).toBe(4);
    expect(metrics.repeatParticipationRate.repeatMembersCount).toBe(4);
    expect(metrics.repeatParticipationRate.percentage).toBe(100);

    // Peer connection feeling average
    // fb-01: 4, fb-02: 5, fb-03: 5 -> (14 / 3) = 4.7
    expect(metrics.peerConnectionAverage.totalResponses).toBe(3);
    expect(metrics.peerConnectionAverage.average).toBe(4.7);

    // Follow up:
    // 1 answered (willing=true), 1 pending -> 100% of answered
    expect(metrics.postProgramWillingness.totalAnswered).toBe(1);
    expect(metrics.postProgramWillingness.willingCount).toBe(1);
    expect(metrics.postProgramWillingness.pendingCount).toBe(1);
    expect(metrics.postProgramWillingness.percentage).toBe(100);

    // Issues summary
    expect(metrics.issueSummary.total).toBe(3);
    expect(metrics.issueSummary.unresolved).toBe(2);
    expect(metrics.issueSummary.resolved).toBe(1);
  });

  it('guarantees unrecorded and cancelled sessions are not counted as absences', () => {
    const emptySessions = [
      {
        id: 's-empty',
        groupId: 'g-1',
        weekNumber: 1,
        scheduledAt: '2026-11-01',
        durationMinutes: 90,
        title: '未來場次',
        goal: '測試',
        hostName: '主持',
        backupContact: '00',
        joinGuide: { gamePlatform: '', serverAddress: '', voiceChannel: '', guideSteps: [] },
        status: '待發布' as const,
        attendance: { 'app-01': '未記錄' as const },
        hasCollaboration: false
      }
    ];

    const metrics = calculateMetrics([], emptySessions, [], [], []);
    expect(metrics.attendanceRate.scheduledCount).toBe(0);
    expect(metrics.attendanceRate.attendedCount).toBe(0);
    expect(metrics.attendanceRate.percentage).toBe(0);
  });

  it('correctly calculates group-level interaction metrics without individual rankings (PRD v2.0 FR-17)', () => {
    const groupMetrics = calculateGroupInteractionMetrics(
      INITIAL_COOP_TASKS,
      INITIAL_APPLICATIONS,
      INITIAL_HELP_REQUESTS,
      INITIAL_NEXT_PLAN_OPTIONS,
      INITIAL_OFFLINE_PROPOSALS
    );

    // 4 enrolled members in grp-01 (app-01, app-02, app-03, app-04)
    expect(groupMetrics.proposalVoteParticipationRate.activeMembersCount).toBe(4);
    expect(groupMetrics.proposalVoteParticipationRate.votedMembersCount).toBe(4);
    expect(groupMetrics.proposalVoteParticipationRate.percentage).toBe(100);

    // Diverse contribution modes: all 4 have active modes
    expect(groupMetrics.contributionModeDistribution.direct_build).toBe(1);
    expect(groupMetrics.contributionModeDistribution.design_choice).toBe(1);
    expect(groupMetrics.contributionModeDistribution.resource_sort).toBe(1);
    expect(groupMetrics.contributionModeDistribution.text_voice_coord).toBe(1);

    // Help request handling: 1 request, 1 handled
    expect(groupMetrics.helpRequestResponseRate.totalRequests).toBe(1);
    expect(groupMetrics.helpRequestResponseRate.handledCount).toBe(1);
    expect(groupMetrics.helpRequestResponseRate.percentage).toBe(100);

    // Next plan consensus
    expect(groupMetrics.nextPlanConsensus.leadingTarget).toContain('延伸水上無障礙高架');
    expect(groupMetrics.nextPlanConsensus.participationRate).toBe(100);

    // Offline exploration: interest breakdown without penalizing opt-outs
    expect(groupMetrics.offlineExploration.interestedCount).toBe(2);
    expect(groupMetrics.offlineExploration.continueOnlineCount).toBe(1);
    expect(groupMetrics.offlineExploration.notConsideringCount).toBe(1);
  });
});
