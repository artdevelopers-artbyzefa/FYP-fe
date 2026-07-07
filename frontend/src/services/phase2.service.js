import apiClient from '../api/apiClient';
import {
  PHASE2_SUPERVISOR_GROUPS_URL,
  PHASE2_SUPERVISOR_EVALUATE_URL,
  PHASE2_COMMITTEE_EVALUATIONS_URL,
  PHASE2_COMMITTEE_EVALUATE_URL,
  PHASE2_STUDENT_REMARKS_URL,
  PHASE2_MARKS_URL
} from '../utils/constants/api-url.constant';

export const getSupervisorPhase2Groups = async () => {
  const res = await apiClient.get(PHASE2_SUPERVISOR_GROUPS_URL);
  return res.data;
};

export const submitSupervisorPhase2Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE2_SUPERVISOR_EVALUATE_URL, payload);
  return res.data;
};

export const getCommitteePhase2Evaluations = async () => {
  const res = await apiClient.get(PHASE2_COMMITTEE_EVALUATIONS_URL);
  return res.data;
};

export const submitCommitteePhase2Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE2_COMMITTEE_EVALUATE_URL, payload);
  return res.data;
};

export const getStudentPhase2Remarks = async () => {
  const res = await apiClient.get(PHASE2_STUDENT_REMARKS_URL);
  return res.data;
};

export const getPhase2Marks = async () => {
  const res = await apiClient.get(PHASE2_MARKS_URL);
  return res.data;
};
