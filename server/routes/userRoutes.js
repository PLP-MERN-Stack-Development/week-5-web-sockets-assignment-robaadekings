const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users/online - Get online users
router.get('/online', async (req, res) => {
  try {
    const users = await User.find({ online: true }).select('username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;