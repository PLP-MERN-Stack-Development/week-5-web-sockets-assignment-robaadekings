// server.js - Main server file for Socket.io chat application with Rooms and MongoDB

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Mongoose models
const User = require('./models/User');
const Room = require('./models/Room');
const Message = require('./models/Message');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io logic
io.on('connection', (socket) => {
  console.log(` User connected: ${socket.id}`);

  // Handle joining a room
  socket.on('join_room', async ({ username, roomName }) => {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = await User.create({ username, socketId: socket.id });
      } else {
        user.socketId = socket.id;
        user.online = true;
        await user.save();
      }

      let room = await Room.findOne({ name: roomName });
      if (!room) {
        room = await Room.create({ name: roomName, users: [user._id] });
      } else if (!room.users.includes(user._id)) {
        room.users.push(user._id);
        await room.save();
      }

      socket.join(room.name);

      io.to(room.name).emit('user_joined_room', {
        user: { id: user._id, username: user.username },
        room: room.name,
      });

      console.log(` ${user.username} joined room: ${room.name}`);
    } catch (err) {
      console.error('join_room error:', err.message);
    }
  });

  // Handle room message
  socket.on('send_message_to_room', async ({ roomName, content, senderName }) => {
    try {
      const sender = await User.findOne({ username: senderName });
      const room = await Room.findOne({ name: roomName });

      if (!sender || !room) return;

      const newMessage = await Message.create({
        sender: sender._id,
        content,
        room: room._id,
      });

      io.to(room.name).emit('receive_message', {
        content,
        sender: sender.username,
        room: room.name,
        timestamp: newMessage.timestamp,
      });
    } catch (err) {
      console.error('send_message_to_room error:', err.message);
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    try {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        user.online = false;
        await user.save();
        console.log(`${user.username} disconnected`);
      }
    } catch (err) {
      console.error('disconnect error:', err.message);
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running with Room support');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };