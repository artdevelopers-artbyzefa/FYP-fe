import apiClient from '../api/apiClient';
import {
  ADMIN_DASHBOARD_STATS_URL,
  ADMIN_GET_USERS_URL,
  ADMIN_CREATE_USER_URL,
  ADMIN_RESET_PASSWORD_URL,
  ADMIN_TOGGLE_USER_STATUS_URL,
  ADMIN_GET_RBAC_URL,
  ADMIN_GET_AUDIT_LOGS_URL,
  ADMIN_SYSTEM_HEALTH_URL,
  ADMIN_TRIGGER_BACKUP_URL,
  ADMIN_CLEAR_CACHE_URL,
  ADMIN_NOTIFICATIONS_URL,
} from '../utils/constants/api-url.constant';

export const getAdminStats = async () => {
  const res = await apiClient.get(ADMIN_DASHBOARD_STATS_URL);
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await apiClient.get(ADMIN_GET_USERS_URL);
  return res.data;
};

export const createAdminUser = async (payload) => {
  const res = await apiClient.post(ADMIN_CREATE_USER_URL, payload);
  return res.data;
};

export const resetUserPassword = async (userId) => {
  const res = await apiClient.post(ADMIN_RESET_PASSWORD_URL.replace(':id', userId));
  return res.data;
};

export const toggleUserStatus = async (userId) => {
  const res = await apiClient.post(ADMIN_TOGGLE_USER_STATUS_URL.replace(':id', userId));
  return res.data;
};

export const getRbacMatrix = async () => {
  const res = await apiClient.get(ADMIN_GET_RBAC_URL);
  return res.data;
};

export const getAuditLogs = async () => {
  const res = await apiClient.get(ADMIN_GET_AUDIT_LOGS_URL);
  return res.data;
};

export const getSystemHealth = async () => {
  const res = await apiClient.get(ADMIN_SYSTEM_HEALTH_URL);
  return res.data;
};

export const triggerDatabaseBackup = async () => {
  const res = await apiClient.post(ADMIN_TRIGGER_BACKUP_URL);
  return res.data;
};

export const clearApplicationCache = async () => {
  const res = await apiClient.post(ADMIN_CLEAR_CACHE_URL);
  return res.data;
};

export const getAdminNotifications = async () => {
  const res = await apiClient.get(ADMIN_NOTIFICATIONS_URL);
  return res.data;
};