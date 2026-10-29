import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './components/Shell';

// 參與者頁面 (PRD v2.0: / 即為小組基地)
import { BaseHome } from './pages/participant/BaseHome';
import { Rules } from './pages/participant/Rules';
import { Register } from './pages/participant/Register';
import { MyStatus } from './pages/participant/MyStatus';
import { ReportIssue } from './pages/participant/ReportIssue';
import { ParticipantFeedback } from './pages/participant/Feedback';

// 主持人頁面 (PRD v2.0 新增)
import { HostConsole } from './pages/host/HostConsole';
import { TaskOrchestrator } from './pages/host/TaskOrchestrator';

// 管理者頁面
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminApplications } from './pages/admin/Applications';
import { AdminGroups } from './pages/admin/Groups';
import { AdminSessions } from './pages/admin/Sessions';
import { AdminIssues } from './pages/admin/Issues';
import { AdminFollowUp } from './pages/admin/FollowUp';

// 需求驗收頁面
import { Acceptance } from './pages/Acceptance';

export const App: React.FC = () => {
  return (
    <Shell>
      <Routes>
        {/* 參與者端核心路由 */}
        <Route path="/" element={<BaseHome />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-status" element={<MyStatus />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/feedback" element={<ParticipantFeedback />} />

        {/* 主持人端路由 (PRD v2.0) */}
        <Route path="/host/console" element={<HostConsole />} />
        <Route path="/host/tasks" element={<TaskOrchestrator />} />

        {/* 管理者端路由 */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/applications" element={<AdminApplications />} />
        <Route path="/admin/groups" element={<AdminGroups />} />
        <Route path="/admin/sessions" element={<AdminSessions />} />
        <Route path="/admin/issues" element={<AdminIssues />} />
        <Route path="/admin/follow-up" element={<AdminFollowUp />} />

        {/* 驗收清單 */}
        <Route path="/acceptance" element={<Acceptance />} />

        {/* 預設導向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
};
