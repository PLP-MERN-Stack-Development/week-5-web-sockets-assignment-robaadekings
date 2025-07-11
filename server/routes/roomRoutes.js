const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// GET /api/rooms - Get all rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find().select('name createdAt');
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;