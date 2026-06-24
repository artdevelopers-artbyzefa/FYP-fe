import apiClient from '../api/apiClient';
import {
  INCHARGE_DASHBOARD_API_URL,
  INCHARGE_RUBRICS_API_URL,
  INCHARGE_SESSIONS_API_URL,
  INCHARGE_SUPERVISION_REQS_API_URL,
  INCHARGE_COMMITTEE_OVERSIGHT_API_URL,
  INCHARGE_GRIEVANCES_API_URL,
  INCHARGE_FACULTY_REPORTS_API_URL,
  INCHARGE_STUDENT_REPORTS_API_URL,
  INCHARGE_AUDIT_LOG_API_URL
} from '../utils/constants/api-url.constant';

export const getInchargeDashboardStats = async () => {
  const res = await apiClient.get(INCHARGE_DASHBOARD_API_URL);
  return res.data;
};

export const getInchargeRubrics = async () => {
  const res = await apiClient.get(INCHARGE_RUBRICS_API_URL);
  return res.data;
};

export const saveRubric = async (data) => {
  const res = await apiClient.post(INCHARGE_RUBRICS_API_URL, data);
  return res.data;
};

export const updateRubric = async (id, data) => {
  const res = await apiClient.put(INCHARGE_RUBRICS_API_URL + '/' + id, data);
  return res.data;
};

export const deleteRubric = async (id) => {
  const res = await apiClient.delete(INCHARGE_RUBRICS_API_URL + '/' + id);
  return res.data;
};

export const getInchargeSessions = async () => {
  const res = await apiClient.get(INCHARGE_SESSIONS_API_URL);
  return res.data;
};

export const createInchargeSession = async (payload) => {
  const res = await apiClient.post(INCHARGE_SESSIONS_API_URL, payload);
  return res.data;
};

export const deleteInchargeSession = async (id) => {
  const res = await apiClient.delete(INCHARGE_SESSIONS_API_URL + '/' + id);
  return res.data;
};

export const activateInchargeSession = async (id) => {
  const res = await apiClient.post(INCHARGE_SESSIONS_API_URL + '/' + id + '/activate');
  return res.data;
};

export const getInchargeSupervisionReqs = async () => {
  const res = await apiClient.get(INCHARGE_SUPERVISION_REQS_API_URL);
  return res.data;
};

export const getInchargeCommitteeOversight = async () => {
  const res = await apiClient.get(INCHARGE_COMMITTEE_OVERSIGHT_API_URL);
  return res.data;
};

export const getInchargeGrievances = async () => {
  const res = await apiClient.get(INCHARGE_GRIEVANCES_API_URL);
  return res.data;
};

export const getInchargeFacultyReports = async () => {
  const res = await apiClient.get(INCHARGE_FACULTY_REPORTS_API_URL);
  return res.data;
};

export const getInchargeStudentReports = async () => {
  const res = await apiClient.get(INCHARGE_STUDENT_REPORTS_API_URL);
  return res.data;
};

export const getInchargeAuditLogs = async () => {
  const res = await apiClient.get(INCHARGE_AUDIT_LOG_API_URL);
  return res.data;
};

export const getPhases = async () => {
  return await apiClient.get('/phases');
};

export const updateActivePhase = async (key) => {
  return await apiClient.put('/phases/active', { key });
};