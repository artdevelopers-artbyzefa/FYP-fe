import apiClient from '../api/apiClient';
import {
  OFFICE_DASHBOARD_API_URL,
  OFFICE_USERS_API_URL,
  OFFICE_STUDENTS_API_URL,
  OFFICE_FACULTY_API_URL,
  OFFICE_PROJECTS_API_URL,
  OFFICE_CONTENT_API_URL,
  OFFICE_EXTERNAL_API_URL,
  OFFICE_RESULTS_API_URL,
  OFFICE_CREATE_STUDENT_API_URL,
  OFFICE_CREATE_FACULTY_API_URL
} from '../utils/constants/api-url.constant';

export const getOfficeDashboardStats = async () => {
  const res = await apiClient.get(OFFICE_DASHBOARD_API_URL);
  return res.data;
};

export const getOfficeUsers = async (page = 1, limit = 20, search = '', status = '') => {
  const res = await apiClient.get(OFFICE_USERS_API_URL, { params: { page, limit, search, status } });
  return res.data;
};

export const getOfficeStudents = async (page = 1, limit = 20) => {
  const res = await apiClient.get(OFFICE_STUDENTS_API_URL, { params: { page, limit } });
  return res.data;
};

export const getOfficeFaculty = async (page = 1, limit = 20, search = '', type = '', status = '') => {
  const res = await apiClient.get(OFFICE_FACULTY_API_URL, { params: { page, limit, search, type, status } });
  return res.data;
};

export const getOfficeProjects = async () => {
  const res = await apiClient.get(OFFICE_PROJECTS_API_URL);
  return res.data;
};

export const getOfficeContent = async () => {
  const res = await apiClient.get(OFFICE_CONTENT_API_URL);
  return res.data;
};

export const getOfficeExternal = async () => {
  const res = await apiClient.get(OFFICE_EXTERNAL_API_URL);
  return res.data;
};

export const getOfficeResults = async () => {
  const res = await apiClient.get(OFFICE_RESULTS_API_URL);
  return res.data;
};

export const createOfficeStudent = async (payload) => {
  const res = await apiClient.post(OFFICE_CREATE_STUDENT_API_URL, payload);
  return res.data;
};

export const deleteOfficeUser = async (id) => {
  const res = await apiClient.delete(OFFICE_USERS_API_URL + '/' + id);
  return res.data;
};

export const updateOfficeUser = async (id, payload) => {
  const res = await apiClient.put(OFFICE_USERS_API_URL + '/' + id, payload);
  return res.data;
};

export const deleteOfficeStudent = async (id) => {
  const res = await apiClient.delete(OFFICE_STUDENTS_API_URL + '/' + id);
  return res.data;
};

export const updateOfficeStudent = async (id, payload) => {
  const res = await apiClient.put(OFFICE_STUDENTS_API_URL + '/' + id, payload);
  return res.data;
};

export const createOfficeFaculty = async (payload) => {
  const res = await apiClient.post(OFFICE_CREATE_FACULTY_API_URL, payload);
  return res.data;
};

export const updateOfficeFaculty = async (id, payload) => {
  const res = await apiClient.put(OFFICE_FACULTY_API_URL + '/' + id, payload);
  return res.data;
};

export const sendFacultyInvite = async (id) => {
  const res = await apiClient.post(OFFICE_FACULTY_API_URL + '/' + id + '/invite');
  return res.data;
};

export const deleteOfficeFaculty = async (id) => {
  const res = await apiClient.delete(OFFICE_FACULTY_API_URL + '/' + id);
  return res.data;
};