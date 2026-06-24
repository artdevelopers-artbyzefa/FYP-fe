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
  STUDENT_SUBMIT_GROUP_IDEA_URL,
  STUDENT_GET_GROUP_IDEAS_URL,
  STUDENT_VOTE_GROUP_IDEA_URL
} from '../utils/constants/api-url.constant';

export const getStudentProfile = async () => {
  const res = await apiClient.get(STUDENT_GET_PROFILE_URL);
  return res.data;
};

export const updateStudentProfile = async (payload) => {
  const res = await apiClient.post(STUDENT_UPDATE_PROFILE_URL, payload);
  return res.data;
};

export const searchPartners = async (query) => {
  const res = await apiClient.get(`${STUDENT_SEARCH_PARTNERS_URL}?q=${query}`);
  return res.data;
};

export const sendPartnerRequest = async (studentId) => {
  const res = await apiClient.post(STUDENT_SEND_REQUEST_URL, { studentId });
  return res.data;
};

export const getIncomingRequests = async () => {
  const res = await apiClient.get(STUDENT_GET_INCOMING_REQUESTS_URL);
  return res.data;
};

export const getSentRequests = async () => {
  const res = await apiClient.get('/student/partners/sent');
  return res.data;
};

export const respondPartnerRequest = async (requestId, status) => {
  const res = await apiClient.post(STUDENT_RESPOND_REQUEST_URL, { requestId, status });
  return res.data;
};

export const getAvailableSupervisors = async () => {
  const res = await apiClient.get(STUDENT_GET_SUPERVISORS_URL);
  return res.data;
};

export const requestSupervisor = async (supervisorId) => {
  const res = await apiClient.post(STUDENT_REQUEST_SUPERVISOR_URL, { supervisorId });
  return res.data;
};

export const submitIdea = async (payload) => {
  const res = await apiClient.post(STUDENT_SUBMIT_IDEA_URL, payload);
  return res.data;
};

export const cancelSupervisorRequest = async () => {
  const res = await apiClient.post('/student/supervisors/cancel');
  return res.data;
};

export const getStudentGroup = async () => {
  const res = await apiClient.get('/student/group');
  return res.data;
};

export const submitGroupIdea = async (payload) => {
  const res = await apiClient.post(STUDENT_SUBMIT_GROUP_IDEA_URL, payload);
  return res.data;
};

export const getGroupIdeas = async () => {
  const res = await apiClient.get(STUDENT_GET_GROUP_IDEAS_URL);
  return res.data;
};

export const getGroupIdeaById = async (id) => {
  const res = await apiClient.get(`${STUDENT_VOTE_GROUP_IDEA_URL}/${id}`);
  return res.data;
};

export const saveStudentGroupPreferences = async (preferences) => {
  const res = await apiClient.post('/student/group/preferences', { preferences });
  return res.data;
};

export const voteOnGroupIdea = async (id, decision) => {
  const res = await apiClient.post(`${STUDENT_VOTE_GROUP_IDEA_URL}/${id}/vote`, { decision });
  return res.data;
};