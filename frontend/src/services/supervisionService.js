import api from "./api";

// ==========================================
// BACKEND CONFIGURATION IS ALREADY DONE
// The Axios instance handles base URL and headers.
// These reusable services map to our API endpoints.
// ==========================================

export const getSupervisedGroups = () => api.get("/supervision/groups");
export const approveWeeklyLog = (groupId, logId) => api.post(`/supervision/groups/${groupId}/logs/${logId}/approve`);
export const rejectWeeklyLog = (groupId, logId, feedback) => api.post(`/supervision/groups/${groupId}/logs/${logId}/reject`, { feedback });
