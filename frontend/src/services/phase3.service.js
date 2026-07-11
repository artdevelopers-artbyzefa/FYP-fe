import apiClient from '../api/apiClient';
import {
  PHASE3_SUPERVISOR_GROUPS_URL,
  PHASE3_SUPERVISOR_EVALUATE_URL,
  PHASE3_COMMITTEE_EVALUATIONS_URL,
  PHASE3_COMMITTEE_EVALUATE_URL,
  PHASE3_STUDENT_REMARKS_URL,
  PHASE3_MARKS_URL
} from '../utils/constants/api-url.constant';

export const getSupervisorPhase3Groups = async () => {
  const res = await apiClient.get(PHASE3_SUPERVISOR_GROUPS_URL);
  return res.data;
};

export const submitSupervisorPhase3Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE3_SUPERVISOR_EVALUATE_URL, payload);
  return res.data;
};

export const getCommitteePhase3Evaluations = async () => {
  const res = await apiClient.get(PHASE3_COMMITTEE_EVALUATIONS_URL);
  return res.data;
};

export const submitCommitteePhase3Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE3_COMMITTEE_EVALUATE_URL, payload);
  return res.data;
};

export const getStudentPhase3Remarks = async () => {
  const res = await apiClient.get(PHASE3_STUDENT_REMARKS_URL);
  return res.data;
};

export const getPhase3Marks = async () => {
  const res = await apiClient.get(PHASE3_MARKS_URL);
  return res.data;
};
