import API from "../api/axios";

export const sendOtp = (phone, role) => API.post("/auth/send-otp", { phone, role });
export const verifyOtp = (phone, otp, role) => API.post("/auth/verify-otp", { phone, otp, role });
export const registerUser = (data) => API.post("/auth/register", data);
