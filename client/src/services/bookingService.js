import API from "../api/axios";

export const createBooking = (data) => API.post("/bookings", data);
export const getEmployerBookings = () => API.get("/bookings/employer");
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);
