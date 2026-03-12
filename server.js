require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const complaintRoutes = require('./routes/complaints');
const uploadRoutes = require('./routes/upload');
const translateRoutes = require('./routes/translate');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/complaints', complaintRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'CivicVoice AI' });
});

const pages = ['submit', 'track', 'admin', 'analytics', 'login', 'register'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n  CivicVoice AI running at http://localhost:${PORT}`);
  console.log(`  Landing:    http://localhost:${PORT}`);
  console.log(`  Login:      http://localhost:${PORT}/login`);
  console.log(`  Register:   http://localhost:${PORT}/register`);
  console.log(`  Submit:     http://localhost:${PORT}/submit`);
  console.log(`  Track:      http://localhost:${PORT}/track`);
  console.log(`  Admin:      http://localhost:${PORT}/admin`);
  console.log(`  Analytics:  http://localhost:${PORT}/analytics\n`);
});
