import api from "./api";

// ==========================================
// BACKEND CONFIGURATION IS ALREADY DONE
// The Axios instance handles base URL and headers.
// These reusable services map to our API endpoints.
// ==========================================

export const getConsensusGroups = () => api.get("/head/consensus-groups");
export const publishConsensusScore = (payload) => api.post("/v1/committee/publish", payload);
export const requestHeadReassignment = (groupId) => api.post(`/head/consensus-groups/${groupId}/reassign`);
