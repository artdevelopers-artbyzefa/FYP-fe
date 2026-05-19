import api from "./api";

export const getProposals = () => api.get("/proposals");
export const getProposalById = (id) => api.get(`/proposals/${id}`);
export const acceptProposal = (id) => api.post(`/proposals/${id}/accept`);
export const requestRevisions = (id, comments) => api.post(`/proposals/${id}/revisions`, { comments });
export const rejectProposal = (id, justification) => api.post(`/proposals/${id}/reject`, { justification });
