const razorpay = require('../config/razorpay')
const Payment = require('../models/Payment')
const Booking = require('../models/Booking')
const crypto = require('crypto')

// ───────────── CREATE ORDER ─────────────
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' })
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    // ❗ Prevent duplicate payment
    const existingPayment = await Payment.findOne({
      booking: bookingId,
      status: 'paid'
    })

    if (existingPayment) {
      return res.status(400).json({ message: 'Booking already paid' })
    }

    const options = {
      amount: booking.amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${booking._id}`,
    }

    const order = await razorpay.orders.create(options)

    const payment = await Payment.create({
      booking: booking._id,
      razorpayOrderId: order.id,
      amount: booking.amount,
    })

    res.json({
      success: true,
      order,
      paymentId: payment._id,
    })

  } catch (error) {
    console.error('createOrder error:', error)
    res.status(500).json({ message: error.message })
  }
}


// ───────────── VERIFY PAYMENT ─────────────
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId
    } = req.body

    if (!paymentId) {
      return res.status(400).json({ message: 'Payment ID missing' })
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex")

    // ❌ If signature mismatch → fake payment
    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const payment = await Payment.findById(paymentId)

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    // ✅ Update payment
    payment.status = 'paid'
    payment.razorpayPaymentId = razorpay_payment_id
    payment.razorpaySignature = razorpay_signature

    await payment.save()

    // ✅ Update booking
    await Booking.findByIdAndUpdate(payment.booking, {
      status: 'completed',
    })

    res.json({
      success: true,
      message: 'Payment successful',
    })

  } catch (error) {
    console.error('verifyPayment error:', error)
    res.status(500).json({ message: error.message })
  }
}