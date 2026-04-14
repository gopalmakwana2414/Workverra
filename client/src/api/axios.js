import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("sb_token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sb_token");
      localStorage.removeItem("sb_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
