import API from "../api/axios";

// Create Razorpay order
export const createOrder = (bookingId) =>
  API.post("/payment/create-order", { bookingId });

// Verify payment
export const verifyPayment = (data) =>
  API.post("/payment/verify", data);
