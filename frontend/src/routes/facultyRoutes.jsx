import React from 'react';
import { Route } from 'react-router-dom';
import FacultyDashboardLayout from '../layouts/FacultyDashboardLayout';
import FacultyDashboard from '../pages/facultySupervisor/Dashboard';
import ResearchTags from '../pages/facultySupervisor/ResearchTags';
import AvailabilityGrid from '../pages/facultySupervisor/AvailabilityGrid';
import StudentProposals from '../pages/facultySupervisor/StudentProposals';
import SupervisedGroups from '../pages/facultySupervisor/SupervisedGroups';
import StudentMessaging from '../pages/facultySupervisor/StudentMessaging';
import CommitteeEvaluations from '../pages/facultySupervisor/CommitteeEvaluations';
import HeadManagement from '../pages/facultySupervisor/HeadManagement';

export const facultyRoutes = (
  <Route element={<FacultyDashboardLayout />}>
    <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
    <Route path="/faculty/research-tags" element={<ResearchTags />} />
    <Route path="/faculty/availability" element={<AvailabilityGrid />} />
    <Route path="/faculty/proposals" element={<StudentProposals />} />
    <Route path="/faculty/groups" element={<SupervisedGroups />} />
    <Route path="/faculty/messages" element={<StudentMessaging />} />
    <Route path="/faculty/evaluations" element={<CommitteeEvaluations />} />
    <Route path="/faculty/head-management" element={<HeadManagement />} />
  </Route>
);
