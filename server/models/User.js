const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      unique: true,
      match: [/^\d{10}$/, 'Enter valid 10-digit phone number'],
    },
    role: {
      type: String,
      enum: ['worker', 'employer', 'admin'],
      required: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      default: 'MP',
    },
    profilePhoto: {
      type: String,
      default: '',
    },

    // ── WORKER FIELDS ──
    skill: { type: String },           // primary skill
    skills: [{ type: String }],        // all skills
    experience: { type: Number },      // years
    hourlyRate: { type: Number },
    about: { type: String },
    certifications: [{ type: String }],
    languages: [{ type: String, default: ['Hindi'] }],
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    verificationBadge: { type: String, default: null }, // 'Top Rated Pro', 'Expert Pro', etc.
    totalJobs: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // ── EMPLOYER FIELDS ──
    companyName: { type: String },
    companyType: { type: String },

    // ── AUTH ──
    otp: { type: String },
    otpExpiry: { type: Date },
    isPhoneVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Index for geolocation search (future upgrade)
userSchema.index({ city: 1, skill: 1 })
userSchema.index({ phone: 1 })

module.exports = mongoose.model('User', userSchema)
