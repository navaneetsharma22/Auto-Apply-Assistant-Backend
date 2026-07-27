const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

// Security Headers
app.use(helmet());

// Strict CORS Configuration (Only allowed client origin)
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);

// Body Parsing & Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/sessions', sessionRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
