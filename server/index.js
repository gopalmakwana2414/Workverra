const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const workerRoutes = require('./routes/workers')
const bookingRoutes = require('./routes/bookings')
const reviewRoutes = require('./routes/reviews')
const { protect } = require('./middleware/authMiddleware')
const { getNotifications, markAllRead } = require('./controllers/notificationController')

// Connect to MongoDB
connectDB()

const app = express()
const server = http.createServer(app)

// ── Socket.io setup ──
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

// Make io accessible in controllers
app.set('io', io)

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`)

  // Worker/Employer joins their own room for targeted notifications
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

// ── Rate limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later',
})

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: 'Too many OTP requests, please wait a minute',
})

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/api', limiter)

// ── Routes ──
app.use('/api/auth',       authRoutes)
app.use('/api/workers',    workerRoutes)
app.use('/api/bookings',   bookingRoutes)
app.use('/api/reviews',    reviewRoutes)
app.get('/api/notifications',          protect, getNotifications)
app.put('/api/notifications/read-all', protect, markAllRead)

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ message: '✅ Workverra API is running', version: '1.0.0' })
})

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  })
})

// ── Start server ──
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`\n🚀 Workverra server running on port ${PORT}`)
  console.log(`📡 API: http://localhost:${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`)
})
