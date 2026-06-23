import apiClient from '../api/apiClient';
import {
  HOD_DASHBOARD_API_URL,
  HOD_ESCALATIONS_API_URL,
  HOD_FACULTY_API_URL,
  HOD_GOVERNANCE_API_URL,
  HOD_ANALYTICS_API_URL,
  HOD_STUDENTS_API_URL,
  HOD_COMMITTEES_API_URL,
  HOD_FACULTY_LIST_API_URL
} from '../utils/constants/api-url.constant';

export const getHodDashboardStats = async () => {
  const res = await apiClient.get(HOD_DASHBOARD_API_URL);
  return res.data;
};

export const getEscalations = async () => {
  const res = await apiClient.get(HOD_ESCALATIONS_API_URL);
  return res.data;
};

export const getFacultyWorkload = async () => {
  const res = await apiClient.get(HOD_FACULTY_API_URL);
  return res.data;
};

export const getGovernanceData = async () => {
  const res = await apiClient.get(HOD_GOVERNANCE_API_URL);
  return res.data;
};

export const getAnalyticsData = async () => {
  const res = await apiClient.get(HOD_ANALYTICS_API_URL);
  return res.data;
};

export const getHodStudents = async (page = 1, limit = 20) => {
  const res = await apiClient.get(HOD_STUDENTS_API_URL, { params: { page, limit } });
  return res.data;
};

export const getHodCommittees = async (page = 1, limit = 20) => {
  const res = await apiClient.get(HOD_COMMITTEES_API_URL, { params: { page, limit } });
  return res.data;
};

export const getHodFacultyList = async (page = 1, limit = 20) => {
  const res = await apiClient.get(HOD_FACULTY_LIST_API_URL, { params: { page, limit } });
  return res.data;
};

export const resolveEscalation = async (id, action, reason) => {
  const res = await apiClient.put(`/hod/escalations/${id}/resolve`, { action, reason });
  return res.data;
};