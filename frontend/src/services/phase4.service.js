import apiClient from '../api/apiClient';
import {
  PHASE4_SUPERVISOR_GROUPS_URL,
  PHASE4_SUPERVISOR_EVALUATE_URL
} from '../utils/constants/api-url.constant';

export const getSupervisorPhase4Groups = async () => {
  const res = await apiClient.get(PHASE4_SUPERVISOR_GROUPS_URL);
  return res.data;
};

export const submitSupervisorPhase4Evaluation = async (payload) => {
  const res = await apiClient.post(PHASE4_SUPERVISOR_EVALUATE_URL, payload);
  return res.data;
};
