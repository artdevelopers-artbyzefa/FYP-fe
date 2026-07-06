import apiClient from '../api/apiClient';
import {
  PHASE1_SUPERVISOR_GROUPS_URL,
  PHASE1_SUPERVISOR_EVALUATE_URL,
  PHASE1_COMMITTEE_EVALUATIONS_URL,
  PHASE1_COMMITTEE_EVALUATE_URL,
  PHASE1_STUDENT_REMARKS_URL,
  PHASE1_MARKS_URL
} from '../utils/constants/api-url.constant';

export const getSupervisorPhase1Groups = async () => {
  const res = await apiClient.get(PHASE1_SUPERVISOR_GROUPS_URL);
  return res.data;
};

export const submitSupervisorPhase1Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE1_SUPERVISOR_EVALUATE_URL, payload);
  return res.data;
};

export const getCommitteePhase1Evaluations = async () => {
  const res = await apiClient.get(PHASE1_COMMITTEE_EVALUATIONS_URL);
  return res.data;
};

export const submitCommitteePhase1Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE1_COMMITTEE_EVALUATE_URL, payload);
  return res.data;
};

export const getStudentPhase1Remarks = async () => {
  const res = await apiClient.get(PHASE1_STUDENT_REMARKS_URL);
  return res.data;
};

export const getPhase1Marks = async () => {
  const res = await apiClient.get(PHASE1_MARKS_URL);
  return res.data;
};
