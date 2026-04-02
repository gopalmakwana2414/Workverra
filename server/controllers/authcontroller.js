const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { generateOTP, sendOTP } = require('../utils/sendOTP')

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// ── POST /api/auth/send-otp ──
const sendOTPHandler = async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Enter valid 10-digit phone number' })
    }

    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    // Save OTP to user if exists, or create temp record
    let user = await User.findOne({ phone })
    if (user) {
      user.otp = otp
      user.otpExpiry = otpExpiry
      await user.save()
    } else {
      // Store OTP temporarily — user completes registration after verify
      await User.findOneAndUpdate(
        { phone },
        { phone, otp, otpExpiry, role: 'employer', name: 'Pending', city: 'Pending' },
        { upsert: true, new: true }
      )
    }

    // Send via MSG91
    const result = await sendOTP(phone, otp)

    if (!result.success) {
      return res.status(500).json({ message: 'Failed to send OTP. Try again.' })
    }

    const response = { message: 'OTP sent successfully' }
    // In dev mode, include OTP in response for easy testing
    if (result.devMode || process.env.NODE_ENV === 'development') {
      response.devOtp = otp
      response.note = 'Dev mode: OTP included in response'
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('sendOTP error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── POST /api/auth/verify-otp ──
const verifyOTPHandler = async (req, res) => {
  try {
    const { phone, otp } = req.body

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone and OTP are required' })
    }

    const user = await User.findOne({ phone })

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please request OTP first.' })
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' })
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' })
    }

    // OTP valid — clear it
    user.otp = undefined
    user.otpExpiry = undefined
    user.isPhoneVerified = true
    await user.save()

    const token = generateToken(user._id)
    const isNewUser = user.name === 'Pending'

    return res.status(200).json({
      message: 'OTP verified successfully',
      token,
      isNewUser,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        city: user.city,
        isVerified: user.isVerified,
        skill: user.skill,
        companyName: user.companyName,
      },
    })
  } catch (error) {
    console.error('verifyOTP error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── POST /api/auth/register ──
const registerHandler = async (req, res) => {
  try {
    const {
      phone, name, role, city,
      skill, skills, experience, hourlyRate, about,
      companyName, companyType,
    } = req.body

    if (!phone || !name || !role || !city) {
      return res.status(400).json({ message: 'Phone, name, role and city are required' })
    }

    let user = await User.findOne({ phone })

    if (!user) {
      return res.status(404).json({ message: 'Please verify your phone first' })
    }

    if (!user.isPhoneVerified) {
      return res.status(400).json({ message: 'Phone not verified. Complete OTP first.' })
    }

    // Update user with registration data
    user.name = name
    user.role = role
    user.city = city

    if (role === 'worker') {
      user.skill = skill
      user.skills = skills || [skill]
      user.experience = experience
      user.hourlyRate = hourlyRate
      user.about = about
    }

    if (role === 'employer') {
      user.companyName = companyName
      user.companyType = companyType
    }

    await user.save()

    const token = generateToken(user._id)

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        city: user.city,
        skill: user.skill,
        companyName: user.companyName,
      },
    })
  } catch (error) {
    console.error('register error:', error)
    return res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// ── GET /api/auth/me ──
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-otp -otpExpiry')
    return res.status(200).json({ user })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { sendOTPHandler, verifyOTPHandler, registerHandler, getMe }
