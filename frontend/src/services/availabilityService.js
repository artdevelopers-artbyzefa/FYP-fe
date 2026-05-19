import api from "./api";

export const getAvailability = () => api.get("/availability");
export const saveAvailability = (data) => api.post("/availability", data);
export const updateAvailability = (id, data) => api.put(`/availability/${id}`, data);
export const deleteAvailability = (id) => api.delete(`/availability/${id}`);
