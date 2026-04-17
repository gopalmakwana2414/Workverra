import axios from "axios";

const BASE_URL = "https://workverra-production.up.railway.app/api";

// Attach token helper
const authHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create Razorpay order
export const createOrder = async (bookingId, token) => {
  const res = await axios.post(
    `${BASE_URL}/payment/create-order`,
    { bookingId },
    authHeaders(token)
  );

  return res.data;
};

// Verify payment
export const verifyPayment = async (data, token) => {
  const res = await axios.post(
    `${BASE_URL}/payment/verify-payment`,
    data,
    authHeaders(token)
  );

  return res.data;
};