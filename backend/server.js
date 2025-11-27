// Load environment variables from .env file
// Try backend/.env first, then root .env
const path = require('path');
const fs = require('fs');
const backendEnvPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '../.env');

if (fs.existsSync(backendEnvPath)) {
  require('dotenv').config({ path: backendEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  // Try default location (root)
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');

const invoiceRoutes = require('./routes/invoiceRoutes');
const couponRoutes = require('./routes/couponRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware - Allow requests from Vercel frontend
app.use((req, res, next) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173' // Vite default port
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins, or in development allow all
  if (process.env.NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else if (allowedOrigins.length > 0) {
    // In production, only allow specified origins
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/invoice', invoiceRoutes);
app.use('/coupon', couponRoutes);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/invoice')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Access invoice page at http://localhost:${PORT}/invoice/new`);
});

module.exports = app;

