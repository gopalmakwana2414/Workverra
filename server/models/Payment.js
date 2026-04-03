const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: Number,
  status: {
    type: String,
    enum: ['created', 'paid', 'failed'],
    default: 'created',
  },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)