import { describe, it, expect } from 'vitest';
import { calculateMetrics } from './metrics';
import { INITIAL_APPLICATIONS, INITIAL_SESSIONS, INITIAL_FEEDBACKS, INITIAL_ISSUES, INITIAL_FOLLOW_UPS } from './seed';

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
    // total: 7 attended out of 8 scheduled -> 88%
    expect(metrics.attendanceRate.attendedCount).toBe(7);
    expect(metrics.attendanceRate.scheduledCount).toBe(8);
    expect(metrics.attendanceRate.percentage).toBe(88);

    // Repeat participation:
    // app-01 attended 2, app-02 attended 2, app-03 attended 2, app-04 attended 1
    // 3 out of 4 attended >= 2 times -> 75%
    expect(metrics.repeatParticipationRate.eligibleMembersCount).toBe(4);
    expect(metrics.repeatParticipationRate.repeatMembersCount).toBe(3);
    expect(metrics.repeatParticipationRate.percentage).toBe(75);

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
    // Empty sessions with '未記錄'
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
});
