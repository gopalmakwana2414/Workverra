const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/workers');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payment');

// Middleware
const { protect } = require('./middleware/authMiddleware');
const { getNotifications, markAllRead } = require('./controllers/notificationController');

// ── Connect DB ──
connectDB();

const app = express();
const server = http.createServer(app);

// ── Security ──
app.use(helmet());

// ✅ FIXED CORS (FINAL)
app.use(cors({
  origin: "https://workverra.vercel.app",
  credentials: true,
}));

// ── Body Parsers ──
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logger ──
app.use(morgan('dev'));

// ── Rate Limiter ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, try again later',
});
app.use('/api', limiter);

// ── SOCKET.IO ──
const io = new Server(server, {
  cors: {
    origin: "https://workverra.vercel.app",
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);

// ── Notifications ──
app.get('/api/notifications', protect, getNotifications);
app.put('/api/notifications/read-all', protect, markAllRead);

// ── Health Check ──
app.get('/', (req, res) => {
  res.json({
    message: '✅ Workverra API running',
    status: 'OK',
  });
});

// ── 404 ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});