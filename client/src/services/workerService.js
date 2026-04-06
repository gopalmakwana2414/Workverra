import API from "../api/axios";

export const searchWorkers = (params) => API.get("/workers/search", { params });
export const getWorkerById = (id) => API.get(`/workers/${id}`);
export const updateWorkerProfile = (data) => API.put("/workers/profile", data);
export const getWorkerBookings = () => API.get("/workers/bookings");
export const respondToBooking = (id, action) => API.put(`/bookings/${id}/status`, { action });
