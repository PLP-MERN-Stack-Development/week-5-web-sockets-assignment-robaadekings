const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Room = require('../models/Room');

// GET /api/messages/:roomName - Get messages for a room
router.get('/:roomName', async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.params.roomName });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const messages = await Message.find({ room: room._id })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;  