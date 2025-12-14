const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register New User
router.post('/register', async (req, res) => {
  try {
    // Ensure MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      const MONGODB_URI = process.env.MONGODB_URI;
      if (!MONGODB_URI) {
        return res.status(500).json({ error: 'Database configuration error' });
      }
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
    }

    const { name, email, password, address, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      address: address || '',
      phone: phone || ''
    });

    await user.save();

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Error registering user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    // Ensure MongoDB connection
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
      const MONGODB_URI = process.env.MONGODB_URI;
      if (!MONGODB_URI) {
        return res.status(500).json({ error: 'Database configuration error' });
      }
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
      });
    }

    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production';
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle MongoDB connection errors
    if (error.name === 'MongooseError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({ error: 'Database connection error. Please try again.' });
    }
    
    res.status(500).json({ 
      error: 'Error logging in',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

