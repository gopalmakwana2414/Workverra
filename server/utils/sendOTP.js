// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP (Dummy for now)
const sendOTP = async (phone, otp) => {
  try {
    console.log(`📱 OTP for ${phone}: ${otp}`)

    // In development → simulate success
    return {
      success: true,
      devMode: true,
    }
  } catch (error) {
    return {
      success: false,
    }
  }
}

module.exports = {
  generateOTP,
  sendOTP,
}