import api from "./api";

// ==========================================
// BACKEND CONFIGURATION IS ALREADY DONE
// The Axios instance handles base URL and headers.
// These reusable services map to our API endpoints.
// ==========================================

export const getEvaluationData = (groupId) => api.get(`/evaluations/groups/${groupId}`);
export const submitScorecard = (payload) => api.post("/v1/evaluations/submit", payload);
