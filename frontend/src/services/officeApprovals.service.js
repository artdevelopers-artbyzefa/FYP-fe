import apiClient from '../api/apiClient';
import { getCurrentUser } from './auth.service';

export const getPendingOfficeApprovals = async () => {
  const res = await apiClient.get('/office-approvals/pending');
  return res.data;
};

export const getOfficeApprovalHistory = async () => {
  const res = await apiClient.get('/office-approvals/history');
  return res.data;
};

export const approveOfficeApproval = async (id, feedback) => {
  const res = await apiClient.post(`/office-approvals/${id}/approve`, { feedback });
  return res.data;
};

export const rejectOfficeApproval = async (id, feedback) => {
  const user = getCurrentUser();
  const res = await apiClient.post(`/office-approvals/${id}/reject`, { feedback, role: user?.role || 'FYP Office' });
  return res.data;
};