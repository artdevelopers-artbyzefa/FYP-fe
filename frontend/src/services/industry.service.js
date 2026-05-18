import apiClient from '../api/apiClient';
import {
  INDUSTRY_ASSIGNED_PROJECTS_URL,
  INDUSTRY_SUBMIT_SCORECARD_URL,
  INDUSTRY_SCORECARD_STATUS_URL,
  INDUSTRY_NOTIFICATIONS_URL,
} from '../utils/constants/api-url.constant';

// ============================================================================
// ⚠️ BACKEND DEVELOPER INSTRUCTIONS ⚠️
// ============================================================================
// Currently, these services use a "try/catch" fallback mechanism. 
// They attempt to hit the real API endpoint first. Because the backend is not 
// yet connected, the request fails, and the catch block returns the DEMO DATA.
// 
// WHEN BACKEND IS READY:
// 1. Ensure the API URLs in `api-url.constant.js` match your backend routes.
// 2. The `try` blocks will automatically succeed and use dynamic data.
// 3. You can then safely DELETE all the DEMO_ objects below and remove the 
//    `try/catch` wrappers to let errors propagate naturally.
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
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(INDUSTRY_ASSIGNED_PROJECTS_URL);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_ASSIGNED_PROJECTS;
};

/**
 * Submit rubric scorecard for a project group.
 * @param {{ groupId: string, scores: { criterion: string, weight: number, score: number }[], remarks: string }} payload
 */
export const submitScorecard = async (payload) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(INDUSTRY_SUBMIT_SCORECARD_URL, payload);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: 'Scorecard submitted (demo mode).' };
};

/**
 * Get notifications for the Industry Supervisor.
 */
export const getIndustryNotifications = async () => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(INDUSTRY_NOTIFICATIONS_URL);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_NOTIFICATIONS;
};
