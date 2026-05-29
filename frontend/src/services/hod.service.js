import apiClient from '../api/apiClient';
import {
  HOD_DASHBOARD_API_URL,
  HOD_ESCALATIONS_API_URL,
  HOD_FACULTY_API_URL,
  HOD_GOVERNANCE_API_URL,
  HOD_ANALYTICS_API_URL
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