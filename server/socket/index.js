const jwt   = require('jsonwebtoken');
const User  = require('../models/User');
const { findOrCreateRoom }  = require('../controllers/roomController');
const { createRoomMessage } = require('../controllers/messageController');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

module.exports = (io) => {
  // ── JWT handshake guard ────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error('Auth token missing');

      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);
      if (!user) throw new Error('User not found');

      socket.data.user = user;      // attach to socket
      next();
    } catch (err) {
      next(err);
    }
  });

  // ── Per‑connection handlers ────────────────────────────────────────
  io.on('connection', (socket) => {
    console.log('🟢', socket.id, 'connected');

    // join a room
    socket.on('join_room', async ({ roomName }) => {
      try {
        const user = socket.data.user;
        user.socketId = socket.id;
        user.online   = true;
        await user.save();

        const room = await findOrCreateRoom(roomName, user._id);
        socket.join(room.name);

        io.to(room.name).emit('user_joined_room', {
          user: { id: user._id, username: user.username },
        });
      } catch (err) {
        console.error('join_room error:', err.message);
      }
    });

    // send message
    socket.on('send_message_to_room', async ({ roomName, content }) => {
      try {
        const user = socket.data.user;
        const room = await findOrCreateRoom(roomName, user._id);
        const msg  = await createRoomMessage(content, user._id, room._id);

        io.to(room.name).emit('receive_message', {
          id: msg._id,
          sender: user.username,
          message: content,
          timestamp: msg.createdAt,
        });
      } catch (err) {
        console.error('send_message_to_room error:', err.message);
      }
    });

    // typing
    socket.on('typing', (isTyping) => {
      const user = socket.data.user;
      if (isTyping) socket.to(socket.rooms).emit('typing_users', [user.username]);
      else socket.to(socket.rooms).emit('typing_users', []);
    });

    // disconnect
    socket.on('disconnect', async () => {
      const user = socket.data.user;
      if (user) {
        user.online = false;
        await user.save();
      }
      console.log('🔴', socket.id, 'disconnected');
    });
  });
};