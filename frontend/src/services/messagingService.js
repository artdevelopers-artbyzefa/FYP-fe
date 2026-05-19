import api from "./api";

// ==========================================
// BACKEND CONFIGURATION IS ALREADY DONE
// The Axios instance handles base URL and headers.
// These reusable services map to our API endpoints.
// ==========================================

export const getMessagingGroups = () => api.get("/messages/groups");
export const getGroupMessages = (groupId) => api.get(`/messages/groups/${groupId}`);
export const sendMessage = (groupId, messageData) => api.post(`/messages/groups/${groupId}`, messageData);
