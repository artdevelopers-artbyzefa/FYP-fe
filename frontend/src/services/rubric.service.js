import apiClient from '../api/apiClient';

export const getRubricByPhase = async (phase, type = 'supervisor') => {
  const res = await apiClient.get(`/rubrics/phase/${phase}?type=${type}`);
  return res.data;
};
