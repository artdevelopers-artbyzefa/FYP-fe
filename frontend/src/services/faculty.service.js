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

export const rejectSupervisorRequest = async (groupId) => {
  const res = await apiClient.post(`/faculty/supervisor-requests/${groupId}/reject`);
  return res.data;
};