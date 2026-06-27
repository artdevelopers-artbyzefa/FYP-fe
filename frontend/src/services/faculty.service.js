import apiClient from '../api/apiClient';
import {
  FACULTY_DASHBOARD_API_URL,
  FACULTY_PROFILE_API_URL,
  FACULTY_AVAILABILITY_API_URL,
  FACULTY_PROPOSALS_API_URL,
  FACULTY_SUPERVISION_API_URL,
  FACULTY_MESSAGING_API_URL,
  FACULTY_EVALUATIONS_API_URL,
  FACULTY_HEAD_DUTIES_API_URL,
  FACULTY_SUPERVISOR_REQUESTS_API_URL
} from '../utils/constants/api-url.constant';

export const getFacultyDashboardStats = async () => {
  const res = await apiClient.get(FACULTY_DASHBOARD_API_URL);
  return res.data;
};

export const getFacultyProfile = async () => {
  const res = await apiClient.get(FACULTY_PROFILE_API_URL);
  return res.data;
};

export const getFacultyAvailability = async () => {
  const res = await apiClient.get(FACULTY_AVAILABILITY_API_URL);
  return res.data;
};

export const getFacultyProposals = async () => {
  const res = await apiClient.get(FACULTY_PROPOSALS_API_URL);
  return res.data;
};

export const getFacultySupervisedGroups = async () => {
  const res = await apiClient.get(FACULTY_SUPERVISION_API_URL);
  return res.data;
};

export const getFacultyMessages = async () => {
  const res = await apiClient.get(FACULTY_MESSAGING_API_URL);
  return res.data;
};

export const getFacultyEvaluations = async () => {
  const res = await apiClient.get(FACULTY_EVALUATIONS_API_URL);
  return res.data;
};

export const getFacultyHeadDuties = async () => {
  const res = await apiClient.get(FACULTY_HEAD_DUTIES_API_URL);
  return res.data;
};

export const getSupervisorRequests = async () => {
  const res = await apiClient.get(FACULTY_SUPERVISOR_REQUESTS_API_URL);
  return res.data;
};

export const approveSupervisorRequest = async (groupId) => {
  const res = await apiClient.post(`/faculty/supervisor-requests/${groupId}/approve`);
  return res.data;
};

export const saveGroupPreferences = async (groupId, preferences) => {
  const res = await apiClient.put( FACULTY_SUPERVISION_API_URL + "/" + groupId + "/preferences", { preferences });
  return res.data;
};

export const suggestIdeaToGroup = async (payload) => {
  const res = await apiClient.post('/faculty/suggest-idea', payload);
  return res.data;
};

export const getFacultySuggestions = async () => {
  const res = await apiClient.get('/faculty/suggestions');
  return res.data;
};

export const rejectSupervisorRequest = async (groupId) => {
  const res = await apiClient.post(`/faculty/supervisor-requests/${groupId}/reject`);
  return res.data;
};

export const getPendingGroupIdeas = async () => {
  const res = await apiClient.get('/faculty/proposals/pending');
  return res.data;
};

export const approveGroupIdea = async (ideaId, feedback) => {
  const res = await apiClient.post(`/faculty/group-ideas/${ideaId}/review`, { decision: 'supervisor_approved', feedback });
  return res.data;
};

export const resetGroupIdea = async (ideaId) => {
  const res = await apiClient.post(`/faculty/group-ideas/${ideaId}/reset`);
  return res.data;
};

export const rejectGroupIdea = async (ideaId, feedback) => {
  const res = await apiClient.post(`/faculty/group-ideas/${ideaId}/review`, { decision: 'supervisor_rejected', feedback });
  return res.data;
};

export const forwardGroupIdea = async (groupId) => {
  const res = await apiClient.post(`/faculty/supervisor-requests/${groupId}/forward`);
  return res.data;
};

export const saveFacultyPreferences = async (preferences) => {
  const res = await apiClient.post('/faculty/profile/preferences', { preferences });
  return res.data;
};