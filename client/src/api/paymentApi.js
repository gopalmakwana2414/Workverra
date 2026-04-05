import axios from 'axios'

const API = 'http://localhost:5000/api'

// Create order
export const createOrder = async (bookingId, token) => {
  const res = await axios.post(
    `${API}/payments/create-order`,
    { bookingId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}

// Verify payment
export const verifyPayment = async (data, token) => {
  const res = await axios.post(
    `${API}/payments/verify-payment`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}