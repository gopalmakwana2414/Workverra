import API from "../api/axios";

export const createOrder = (bookingId) =>
  API.post("/payment/create-order", { bookingId });

export const verifyPayment = (data) =>
  API.post("/payment/verify", data);
