import apiClient from '../api/apiClient';
import {
  PHASE3_SUPERVISOR_GROUPS_URL,
  PHASE3_SUPERVISOR_EVALUATE_URL
} from '../utils/constants/api-url.constant';

export const getSupervisorPhase3Groups = async () => {
  const res = await apiClient.get(PHASE3_SUPERVISOR_GROUPS_URL);
  return res.data;
};

export const submitSupervisorPhase3Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE3_SUPERVISOR_EVALUATE_URL, payload);
  return res.data;
};
