import API from "../api/axios";

export const submitReview = (data) => API.post("/reviews", data);
export const getWorkerReviews = (workerId) => API.get(`/reviews/worker/${workerId}`);
