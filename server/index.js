const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
require('dotenv').config()

const connectDB = require('./config/db')

// Routes
const authRoutes = require('./routes/auth')
const workerRoutes = require('./routes/workers')
const bookingRoutes = require('./routes/bookings')
const reviewRoutes = require('./routes/reviews')
const paymentRoutes = require('./routes/payment') // ✅ ADDED

// Middleware
const { protect } = require('./middleware/authMiddleware')
const { getNotifications, markAllRead } = require('./controllers/notificationController')

// ── Connect DB ──
connectDB()

const app = express()
const server = http.createServer(app)

// ── Security Middleware ──
app.use(helmet())

// ── Socket.io Setup ──
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

app.set('io', io)

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`)

  socket.on('join', (userId) => {
    socket.join(userId)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`)
  })
})

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later',
})

app.use('/api', limiter)

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// ── Routes ──
app.use('/api/auth', authRoutes)
app.use('/api/workers', workerRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/payments', paymentRoutes) // ✅ ADDED

// ── Notifications ──
app.get('/api/notifications', protect, getNotifications)
app.put('/api/notifications/read-all', protect, markAllRead)

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({
    message: '✅ Workverra API running',
    version: '1.0.0',
    status: 'OK',
  })
})

// ── 404 Handler ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
})

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// ── Start Server ──
const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})