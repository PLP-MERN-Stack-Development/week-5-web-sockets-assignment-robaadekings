// server.js – entry point with auth routes & modular socket

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── REST routes ──────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/rooms',   require('./routes/roomRoutes'));
app.use('/api/users',   require('./routes/userRoutes'));
app.use('/api/messages',require('./routes/messageRoutes'));

app.get('/', (_, res) => res.send('Chat server with JWT auth running'));

// ── Socket.io ────────────────────────────────────────────────────────
require('./socket')(io);

// ── Start server ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('🚀  Server on', PORT));

module.exports = { app, server, io };