const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger'); // Import the logger

// --- INITIALIZE APP ---
const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://my-project-7so6.onrender.com'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Parser for cookies

// --- RATE LIMITING ---
// Apply to all auth routes
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per windowMs (e.g., 100 login attempts)
	message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// --- MOUNT ROUTES ---
app.use('/api/auth', authLimiter, authRoutes); // Apply limiter to auth routes
app.use('/api/posts', postRoutes);
app.use('/api/meetings', meetingRoutes); // Mount new meeting routes
app.use('/api/admin', adminRoutes);

// --- HEALTH CHECK ROUTE ---
app.get('/', (req, res) => {
    res.send('RBAC API is running...');
});

// --- ERROR HANDLING (Simple) ---
// Add more robust error handling middleware as needed
app.use((err, req, res, next) => {
    logger.error(err.message, { stack: err.stack, url: req.originalUrl, method: req.method });
    res.status(500).send('Something broke!');
});

module.exports = app;


