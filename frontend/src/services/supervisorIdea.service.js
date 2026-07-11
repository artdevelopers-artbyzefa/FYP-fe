export const submitSupervisorIdea = async (payload) => {
  const res = await apiClient.post('/faculty/supervisor-ideas', payload);
  return res.data;
};

export const getSupervisorIdeas = async () => {
  const res = await apiClient.get('/faculty/supervisor-ideas');
  return res.data;
};

export const getSupervisorIdeaRequests = async () => {
  const res = await apiClient.get('/faculty/supervisor-ideas/requests');
  return res.data;
};

export const respondToSupervisorIdeaRequest = async (requestId, action) => {
  const res = await apiClient.post('/faculty/supervisor-ideas/respond', { requestId, action });
  return res.data;
};
