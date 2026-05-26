import apiClient from '../api/apiClient';
import {
  FACULTY_DASHBOARD_API_URL,
  FACULTY_PROFILE_API_URL,
  FACULTY_AVAILABILITY_API_URL,
  FACULTY_PROPOSALS_API_URL,
  FACULTY_SUPERVISION_API_URL,
  FACULTY_MESSAGING_API_URL,
  FACULTY_EVALUATIONS_API_URL,
  FACULTY_HEAD_DUTIES_API_URL
} from '../utils/constants/api-url.constant';

const DEMO_DASHBOARD_STATS = {
  supervisedGroups: 4,
  supervisedCap: 4,
  pendingProposals: 1,
  weeklyLogs: '100%',
  committeeHead: 'PEC-1'
};

const DEMO_PROFILE = {
  tags: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'Deep Learning', 'Natural Language Processing']
};

const DEMO_AVAILABILITY = [
  { day: 'Monday', slots: ['09:00-10:00', '10:00-11:00'] },
  { day: 'Tuesday', slots: ['14:00-15:00', '15:00-16:00'] },
  { day: 'Wednesday', slots: ['11:00-12:00'] }
];

const DEMO_PROPOSALS = [
  { id: 'PROP-042', title: 'AI-Powered Traffic Management System', students: ['Ahmed Farooq', 'Sana Mehmood'], status: 'Pending Review' },
  { id: 'PROP-019', title: 'Federated Learning for Medical Diagnosis', students: ['Aima Khalid'], status: 'Approved' }
];

const DEMO_SUPERVISION_GROUPS = [
  { groupId: 'G-042', title: 'AI-Powered Traffic Management', members: ['Ahmed Farooq', 'Sana'], progress: '25%', logStatus: 'Pending Review' },
  { groupId: 'G-019', title: 'Federated Learning for Medical', members: ['Aima Khalid'], progress: '75%', logStatus: 'Up to Date' }
];

const DEMO_MESSAGES = [
  { sender: 'Ahmed Farooq (G-042)', text: 'Sir, we have uploaded the revised dataset for YOLOv8 training. Please review.', time: '10:30 AM' },
  { sender: 'Dr. Ali Hassan (You)', text: 'The dataset looks good. Ensure class imbalance is handled.', time: '11:00 AM' }
];

const DEMO_EVALUATIONS = [
  { id: 'EVAL-001', student: 'Ahmed Farooq', committee: 'PEC-1', type: 'Proposal Defense', status: 'Pending' },
  { id: 'EVAL-002', student: 'Aima Khalid', committee: 'FEC-1', type: 'Mid-Term Defense', status: 'Completed' }
];

const DEMO_HEAD_DUTIES = [
  { committeeId: 'PEC-1', activeMembers: 3, pendingConsolidations: 2, nextMeeting: 'May 20, 2026' }
];

export const getFacultyDashboardStats = async () => {
  try {
    const res = await apiClient.get(FACULTY_DASHBOARD_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_DASHBOARD_STATS };
  }
};

export const getFacultyProfile = async () => {
  try {
    const res = await apiClient.get(FACULTY_PROFILE_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_PROFILE };
  }
};

export const getFacultyAvailability = async () => {
  try {
    const res = await apiClient.get(FACULTY_AVAILABILITY_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_AVAILABILITY };
  }
};

export const getFacultyProposals = async () => {
  try {
    const res = await apiClient.get(FACULTY_PROPOSALS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_PROPOSALS };
  }
};

export const getFacultySupervisedGroups = async () => {
  try {
    const res = await apiClient.get(FACULTY_SUPERVISION_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_SUPERVISION_GROUPS };
  }
};

export const getFacultyMessages = async () => {
  try {
    const res = await apiClient.get(FACULTY_MESSAGING_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_MESSAGES };
  }
};

export const getFacultyEvaluations = async () => {
  try {
    const res = await apiClient.get(FACULTY_EVALUATIONS_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_EVALUATIONS };
  }
};

export const getFacultyHeadDuties = async () => {
  try {
    const res = await apiClient.get(FACULTY_HEAD_DUTIES_API_URL);
    return res.data;
  } catch (error) {
    return { data: DEMO_HEAD_DUTIES };
  }
};

