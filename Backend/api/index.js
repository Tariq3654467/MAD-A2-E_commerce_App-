const app = require('../index.js');
const { connectDB } = require('../index.js');

// For Vercel serverless functions, ensure DB connection on each invocation
let isConnecting = false;

const ensureConnection = async () => {
  if (isConnecting) {
    // Wait for existing connection attempt
    return new Promise((resolve) => {
      const checkConnection = setInterval(() => {
        if (!isConnecting) {
          clearInterval(checkConnection);
          resolve();
        }
      }, 100);
    });
  }

  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    isConnecting = true;
    try {
      await connectDB();
    } finally {
      isConnecting = false;
    }
  }
};

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await ensureConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(503).json({ error: 'Database connection failed. Please try again.' });
  }
});

module.exports = app;
