import { createOrder, verifyPayment } from '../../api/paymentApi'

const handlePayment = async (booking) => {
  try {
    const token = localStorage.getItem('token')

    // 1. Create order
    const data = await createOrder(booking._id || booking.id, token)

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // 👈 replace
      amount: data.order.amount,
      currency: "INR",
      name: "Workverra",
      description: "Job Payment",
      order_id: data.order.id,

      handler: async function (response) {
        // 2. Verify payment
        await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          paymentId: data.paymentId
        }, token)

        alert("✅ Payment Successful")
      },

      theme: {
        color: "#6366F1"
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    console.error(err)
    alert("Payment failed")
  }
}