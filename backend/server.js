const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests for beginner-friendly debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request to: ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the One Spyde Food Ordering API!',
    status: 'Healthy',
    docs: 'Endpoints available at /api/auth, /api/foods, /api/cart, /api/orders'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` One Spyde Server running on port ${PORT}`);
  console.log(` Database: ${process.env.DB_NAME || 'one_spyde'}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});
