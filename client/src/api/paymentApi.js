import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const authHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

export const createOrder = async (bookingId, token) => {
  const res = await axios.post(`${API}/payments/create-order`, { bookingId }, authHeaders(token))
  return res.data
}

export const verifyPayment = async (data, token) => {
  const res = await axios.post(`${API}/payments/verify-payment`, data, authHeaders(token))
  return res.data
}
