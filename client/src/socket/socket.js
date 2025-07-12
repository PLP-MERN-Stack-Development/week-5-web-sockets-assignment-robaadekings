// socket.js – client singleton + React hook (JWT‑aware)

import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/* ── Singleton ───────────────────────────────────────────────────── */
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

/* ── Hook ─────────────────────────────────────────────────────────── */
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages,    setMessages]    = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [users,       setUsers]       = useState([]);

  const usernameRef = useRef('');
  const roomRef     = useRef('general');

  /* connect + join room (sends JWT via socket.auth) */
  const connect = (username, roomName = 'general') => {
    usernameRef.current = username;
    roomRef.current     = roomName;

    // add JWT to handshake payload
    const token = localStorage.getItem('token');
    socket.auth = { token };
    socket.connect();

    socket.emit('join_room', { roomName });
  };

  const disconnect        = () => socket.disconnect();
  const setTyping         = (is) => socket.emit('typing', is);
  const sendPrivate       = (to, msg) => socket.emit('private_message', { to, message: msg });
  const sendMessage       = (content) =>
    socket.emit('send_message_to_room', {
      roomName: roomRef.current,
      content,
    });

  /* register listeners once */
  useEffect(() => {
    socket.on('connect',    () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.on('receive_message', (m) => setMessages((p) => [...p, m]));
    socket.on('private_message', (m) => setMessages((p) => [...p, m]));

    socket.on('user_joined_room', ({ user }) =>
      setMessages((p) => [
        ...p,
        { id: Date.now(), system: true, message: `${user.username} joined`, timestamp: new Date().toISOString() },
      ])
    );

    socket.on('user_list',      setUsers);
    socket.on('typing_users',   setTypingUsers);

    return () => socket.off();
  }, []);

  return {
    isConnected,
    messages,
    typingUsers,
    users,
    connect,
    disconnect,
    setTyping,
    sendMessage,
    sendPrivateMessage: sendPrivate,
  };
};

export default socket;