const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// Update User Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, address, phone, profileImage } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, address, phone, profileImage },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

module.exports = router;

