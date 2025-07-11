const { findOrCreateUser, setUserOffline } = require('../controllers/userController');
const { findOrCreateRoom } = require('../controllers/roomController');
const { createRoomMessage } = require('../controllers/messageController');
const User = require('../models/User');
const Room = require('../models/Room');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', async ({ username, roomName }) => {
      try {
        const user = await findOrCreateUser(username, socket.id);
        const room = await findOrCreateRoom(roomName, user._id);

        socket.join(room.name);

        io.to(room.name).emit('user_joined_room', {
          user: { id: user._id, username: user.username },
          room: room.name,
        });

        console.log(`${user.username} joined room: ${room.name}`);
      } catch (err) {
        console.error('join_room error:', err.message);
      }
    });

    socket.on('send_message_to_room', async ({ roomName, content, senderName }) => {
      try {
        const sender = await User.findOne({ username: senderName });
        const room = await Room.findOne({ name: roomName });

        if (!sender || !room) return;

        const message = await createRoomMessage(content, sender._id, room._id);

        io.to(room.name).emit('receive_message', {
          content,
          sender: sender.username,
          room: room.name,
          timestamp: message.timestamp,
        });
      } catch (err) {
        console.error('send_message_to_room error:', err.message);
      }
    });

    socket.on('disconnect', async () => {
      try {
        const user = await setUserOffline(socket.id);
        if (user) {
          console.log(`${user.username} disconnected`);
        }
      } catch (err) {
        console.error('disconnect error:', err.message);
      }
    });
  });
};

module.exports = socketHandler;