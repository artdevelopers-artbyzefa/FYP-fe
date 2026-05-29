import apiClient from '../api/apiClient';
import {
  INDUSTRY_ASSIGNED_PROJECTS_URL,
  INDUSTRY_SUBMIT_SCORECARD_URL,
  INDUSTRY_SCORECARD_STATUS_URL,
  INDUSTRY_NOTIFICATIONS_URL,
} from '../utils/constants/api-url.constant';

export const getAssignedProjects = async () => {
  const res = await apiClient.get(INDUSTRY_ASSIGNED_PROJECTS_URL);
  return res.data;
};

export const submitScorecard = async (payload) => {
  const res = await apiClient.post(INDUSTRY_SUBMIT_SCORECARD_URL, payload);
  return res.data;
};

export const getIndustryNotifications = async () => {
  const res = await apiClient.get(INDUSTRY_NOTIFICATIONS_URL);
  return res.data;
};