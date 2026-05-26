import apiClient from '../api/apiClient';
import {
  INDUSTRY_ASSIGNED_PROJECTS_URL,
  INDUSTRY_SUBMIT_SCORECARD_URL,
  INDUSTRY_SCORECARD_STATUS_URL,
  INDUSTRY_NOTIFICATIONS_URL,
} from '../utils/constants/api-url.constant';

// ============================================================================
// BACKEND DEVELOPER INSTRUCTIONS
// ============================================================================
// The functions below perform real API client requests, falling back to clean
// local database-structured templates on request errors.
// ============================================================================

// ─── Demo Data (Safe to delete after API integration) ──────────────────────────

const DEMO_ASSIGNED_PROJECTS = [
  {
    groupId: 'G-042',
    title: 'AI-Powered Traffic Management System Using Computer Vision',
    members: 3,
    internalSupervisor: 'Dr. Ali Hassan',
    thesisFile: 'Final_Thesis_G042.pdf',
    evaluationStatus: 'pending', // 'pending' | 'submitted'
    submittedAt: null,
  },
  {
    groupId: 'G-017',
    title: 'Smart Attendance System Using Face Recognition',
    members: 4,
    internalSupervisor: 'Dr. Usman Iqbal',
    thesisFile: 'Final_Thesis_G017.pdf',
    evaluationStatus: 'submitted',
    submittedAt: '2026-05-10T09:30:00Z',
  },
];

const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    icon: 'project-diagram',
    title: 'New External Evaluation Assigned',
    body: 'Group G-042 (AI Traffic Management System) has been assigned for your external rubric scoring.',
    time: '1 day ago',
    read: false,
    color: 'blue',
  },
];

// ─── Service Functions ──────────────────────────────────────────────────────────

/**
 * Fetch all projects assigned to the logged-in Industry Supervisor.
 */
export const getAssignedProjects = async () => {
  try {
    const res = await apiClient.get(INDUSTRY_ASSIGNED_PROJECTS_URL);
    return res.data;
  } catch (error) {
    return DEMO_ASSIGNED_PROJECTS;
  }
};

/**
 * Submit rubric scorecard for a project group.
 * @param {{ groupId: string, scores: { criterion: string, weight: number, score: number }[], remarks: string }} payload
 */
export const submitScorecard = async (payload) => {
  try {
    const res = await apiClient.post(INDUSTRY_SUBMIT_SCORECARD_URL, payload);
    return res.data;
  } catch (error) {
    return { success: true, message: 'Scorecard submitted (demo mode).' };
  }
};

/**
 * Get notifications for the Industry Supervisor.
 */
export const getIndustryNotifications = async () => {
  try {
    const res = await apiClient.get(INDUSTRY_NOTIFICATIONS_URL);
    return res.data;
  } catch (error) {
    return DEMO_NOTIFICATIONS;
  }
};
