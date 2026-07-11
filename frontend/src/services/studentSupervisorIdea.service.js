import apiClient from '../api/apiClient';

export const getApprovedSupervisorIdeas = async () => {
  const res = await apiClient.get('/student/supervisor-ideas');
  return res.data;
};

export const requestSupervisorIdea = async (ideaId, message) => {
  const res = await apiClient.post('/student/supervisor-ideas/request', { ideaId, message });
  return res.data;
};
