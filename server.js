'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const pageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

// Security & logging middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'blob:'],
      connectSrc: ["'self'", 'https://nominatim.openstreetmap.org', 'https://translation.googleapis.com'],
    },
  },
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes (rate-limited)
app.use('/api/complaints', apiLimiter, require('./routes/complaints'));
app.use('/api/upload', apiLimiter, require('./routes/upload'));
app.use('/api/translate', apiLimiter, require('./routes/translate'));
app.use('/api/admin', apiLimiter, require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// SPA page routes (rate-limited)
app.get('/submit',    pageLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'submit.html')));
app.get('/track',     pageLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'track.html')));
app.get('/admin',     pageLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/analytics', pageLimiter, (req, res) => res.sendFile(path.join(__dirname, 'public', 'analytics.html')));

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CivicVoice AI server running on http://localhost:${PORT}`);
});

module.exports = app;
