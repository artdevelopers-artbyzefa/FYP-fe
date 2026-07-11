import apiClient from '../api/apiClient';
import {
  PHASE4_SUPERVISOR_GROUPS_URL,
  PHASE4_SUPERVISOR_EVALUATE_URL,
  PHASE4_COMMITTEE_EVALUATIONS_URL,
  PHASE4_COMMITTEE_EVALUATE_URL,
  PHASE4_STUDENT_REMARKS_URL,
  PHASE4_MARKS_URL
} from '../utils/constants/api-url.constant';

export const getSupervisorPhase4Groups = async () => {
  const res = await apiClient.get(PHASE4_SUPERVISOR_GROUPS_URL);
  return res.data;
};

export const submitSupervisorPhase4Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE4_SUPERVISOR_EVALUATE_URL, payload);
  return res.data;
};

export const getCommitteePhase4Evaluations = async () => {
  const res = await apiClient.get(PHASE4_COMMITTEE_EVALUATIONS_URL);
  return res.data;
};

export const submitCommitteePhase4Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE4_COMMITTEE_EVALUATE_URL, payload);
  return res.data;
};

export const getStudentPhase4Remarks = async () => {
  const res = await apiClient.get(PHASE4_STUDENT_REMARKS_URL);
  return res.data;
};

export const getPhase4Marks = async () => {
  const res = await apiClient.get(PHASE4_MARKS_URL);
  return res.data;
};
