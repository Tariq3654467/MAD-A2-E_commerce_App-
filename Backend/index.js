const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
// Use default database (no /ecommerce) to match where data was seeded
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://janjuatariq7614_db_user:tyfrkGJP0uB9oaOz@coffee-shop.3xuvmty.mongodb.net/?appName=coffee-shop';

// MongoDB Connection Function - Optimized for serverless
const connectDB = async () => {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      return true; // Already connected
    }

    // Check if connection is in progress
    if (mongoose.connection.readyState === 2) {
      // Wait for connection to complete
      return new Promise((resolve, reject) => {
        mongoose.connection.once('connected', () => resolve(true));
        mongoose.connection.once('error', reject);
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });
    }

    // Connect if not connected
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 1,
      });
      console.log('✅ MongoDB Connected Successfully');
      return true;
    }

    return false;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    // Don't throw in serverless - let routes handle it
    return false;
  }
};

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const chatbotRoutes = require('./routes/chatbot');
const seedRoutes = require('./routes/seed');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api', seedRoutes); // Seed endpoint (protected)

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API Server is running!' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
module.exports = app;
module.exports.connectDB = connectDB;


