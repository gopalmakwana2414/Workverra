import API from "../api/axios";

export const createOrder = (bookingId) => API.post("/payments/create-order", { bookingId });
export const verifyPayment = (data) => API.post("/payments/verify-payment", data);
