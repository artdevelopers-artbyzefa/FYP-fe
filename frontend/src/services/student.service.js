import apiClient from '../api/apiClient';
import {
  STUDENT_GET_PROFILE_URL,
  STUDENT_UPDATE_PROFILE_URL,
  STUDENT_SEARCH_PARTNERS_URL,
  STUDENT_SEND_REQUEST_URL,
  STUDENT_GET_INCOMING_REQUESTS_URL,
  STUDENT_RESPOND_REQUEST_URL,
  STUDENT_GET_SUPERVISORS_URL,
  STUDENT_REQUEST_SUPERVISOR_URL,
  STUDENT_SUBMIT_IDEA_URL,
  STUDENT_GET_APPROVED_IDEAS_URL,
  STUDENT_SELECT_IDEA_URL
} from '../utils/constants/api-url.constant';

// ============================================================================
// ⚠️ BACKEND DEVELOPER INSTRUCTIONS ⚠️
// ============================================================================
// The functions below simulate API calls and return hardcoded DEMO data.
// 
// WHEN YOUR APIs ARE READY:
// 1. Uncomment the `await apiClient.get(...)` lines.
// 2. Delete the `return DEMO_...` lines below them.
// ============================================================================

const DEMO_STUDENT_PROFILE = {
  name: 'Ahmed Farooq',
  email: 'student@cuiatd.edu.pk',
  regNo: 'SP21-BCS-001',
  semester: '8th',
  section: 'A',
  cgpa: '3.45',
  fatherName: 'Farooq Ahmed',
  profileCompleted: true
};

const DEMO_PARTNERS = [
  { id: 'S005', name: 'Zain Ali', email: 'zain@cuiatd.edu.pk', regNo: 'SP21-BCS-005', cgpa: '3.45', semester: '8', section: 'A' }
];

const DEMO_INCOMING_REQUESTS = [
  { id: 'R001', fromId: 'S008', name: 'Fatima Khan', regNo: 'SP21-BCS-008', cgpa: '3.72', program: 'BS SE' }
];

const DEMO_SUPERVISORS = [
  { id: 'F001', name: 'Dr. Ali Hassan', designation: 'Associate Professor', tags: ['AI', 'Machine Learning', 'Computer Vision'], avatar: 'AH' },
  { id: 'F002', name: 'Dr. Sana Asif', designation: 'Assistant Professor', tags: ['Blockchain', 'Cybersecurity', 'IoT'], avatar: 'SA' }
];

const DEMO_APPROVED_IDEAS = [
  { id: 'I001', title: 'Blockchain Voting System', desc: 'A secure e-voting system using smart contracts to ensure data immutability and transparency.', tags: ['Cybersecurity'], supervisor: 'Dr. Zeeshan' },
  { id: 'I002', title: 'AI Recommendation Engine', desc: 'Personalized course recommendation system for university students based on past performance.', tags: ['AI', 'Data Science'], supervisor: 'Dr. Ali Hassan' }
];

export const getStudentProfile = async () => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(STUDENT_GET_PROFILE_URL);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_STUDENT_PROFILE;
};

export const updateStudentProfile = async (payload) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(STUDENT_UPDATE_PROFILE_URL, payload);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: 'Profile updated successfully (demo mode).' };
};

export const searchPartners = async (query) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(`${STUDENT_SEARCH_PARTNERS_URL}?q=${query}`);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_PARTNERS.filter(p => p.regNo.toLowerCase().includes(query.toLowerCase()) || p.email.toLowerCase().includes(query.toLowerCase()));
};

export const sendPartnerRequest = async (studentId) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(STUDENT_SEND_REQUEST_URL, { studentId });
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: 'Request sent successfully (demo mode).' };
};

export const getIncomingRequests = async () => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(STUDENT_GET_INCOMING_REQUESTS_URL);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_INCOMING_REQUESTS;
};

export const respondPartnerRequest = async (requestId, status) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(STUDENT_RESPOND_REQUEST_URL, { requestId, status });
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: `Request ${status} successfully (demo mode).` };
};

export const getAvailableSupervisors = async () => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(STUDENT_GET_SUPERVISORS_URL);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_SUPERVISORS;
};

export const requestSupervisor = async (supervisorId) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(STUDENT_REQUEST_SUPERVISOR_URL, { supervisorId });
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: 'Supervisor requested successfully (demo mode).' };
};

export const submitIdea = async (payload) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(STUDENT_SUBMIT_IDEA_URL, payload);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: 'Idea submitted successfully (demo mode).' };
};

export const getApprovedIdeas = async () => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.get(STUDENT_GET_APPROVED_IDEAS_URL);
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return DEMO_APPROVED_IDEAS;
};

export const selectApprovedIdea = async (ideaId) => {
  // ─── UNCOMMENT WHEN API IS READY ──────────────────────────────
  // const res = await apiClient.post(STUDENT_SELECT_IDEA_URL, { ideaId });
  // return res.data;

  // ─── DELETE WHEN API IS READY ─────────────────────────────────
  return { success: true, message: 'Idea selected successfully (demo mode).' };
};
