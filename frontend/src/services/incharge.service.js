import { getRequest, postRequest, putRequest } from '../api/apiClient';
import {
  INCHARGE_DASHBOARD_STATS_URL,
  INCHARGE_RUBRICS_URL,
  INCHARGE_SESSIONS_URL,
  INCHARGE_SUPERVISION_REQUESTS_URL,
  INCHARGE_COMMITTEES_URL,
  INCHARGE_GRIEVANCES_URL,
  INCHARGE_FACULTY_REPORTS_URL,
  INCHARGE_STUDENT_REPORTS_URL,
  INCHARGE_AUDIT_LOGS_URL
} from '../utils/constants/api-url.constant';

/**
 * FYP Office In-charge Service
 */

// 1. Dashboard
export const getInchargeDashboardStats = async () => {
  return await getRequest(INCHARGE_DASHBOARD_STATS_URL);
};

// 2. Rubrics
export const getRubrics = async () => {
  return await getRequest(INCHARGE_RUBRICS_URL);
};
export const saveRubric = async (data) => {
  return await postRequest(INCHARGE_RUBRICS_URL, data);
};

// 3. Academic Sessions
export const getSessions = async () => {
  return await getRequest(INCHARGE_SESSIONS_URL);
};
export const saveSession = async (data) => {
  return await postRequest(INCHARGE_SESSIONS_URL, data);
};

// 4. Supervision Requests
export const getSupervisionRequests = async () => {
  return await getRequest(INCHARGE_SUPERVISION_REQUESTS_URL);
};
export const processSupervisionRequest = async (requestId, status) => {
  return await putRequest(`${INCHARGE_SUPERVISION_REQUESTS_URL}/${requestId}`, { status });
};

// 5. Committees
export const getCommittees = async () => {
  return await getRequest(INCHARGE_COMMITTEES_URL);
};
export const processCommitteeRequest = async (committeeId, status) => {
  return await putRequest(`${INCHARGE_COMMITTEES_URL}/${committeeId}`, { status });
};

// 6. Grievances
export const getGrievances = async () => {
  return await getRequest(INCHARGE_GRIEVANCES_URL);
};
export const processGrievance = async (grievanceId, actionData) => {
  return await putRequest(`${INCHARGE_GRIEVANCES_URL}/${grievanceId}`, actionData);
};

// 7. Reports & Logs
export const getFacultyReports = async (params = {}) => {
  return await getRequest(INCHARGE_FACULTY_REPORTS_URL, { params });
};
export const getStudentReports = async (params = {}) => {
  return await getRequest(INCHARGE_STUDENT_REPORTS_URL, { params });
};
export const getAuditLogs = async (params = {}) => {
  return await getRequest(INCHARGE_AUDIT_LOGS_URL, { params });
};
