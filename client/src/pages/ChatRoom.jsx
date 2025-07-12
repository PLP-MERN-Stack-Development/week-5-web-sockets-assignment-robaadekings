import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketProvider';
import api from '../api/axios';
import ChatWindow from '../components/ChatWindow.jsx';
import TypingIndicator from '../components/TypingIndicator.jsx';
import MessageInput from '../components/MessageInput.jsx';

export default function ChatRoom() {
  const { state } = useLocation();   // { username, roomName }
  const navigate = useNavigate();
  const username = state?.username;
  const roomName = state?.roomName || 'general';

  const { isConnected, messages, typingUsers, sendMessage, setTyping, disconnect } =
    useSocketContext();

  /* guard: if page refreshes without state OR without token, send to login */
  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login');
    if (!username) return navigate('/');
  }, [username, navigate]);

  /* load message history */
  const [loadedHistory, setLoadedHistory] = useState(false);
  useEffect(() => {
    if (loadedHistory) return;
    api
      .get(`/messages/${roomName}`)
      .then(({ data }) => {
        if (Array.isArray(data))
          data.forEach((m) =>
            messages.push({
              id: m._id,
              sender: m.sender.username,
              message: m.content,
              timestamp: m.createdAt,
            })
          );
        setLoadedHistory(true);
      })
      .catch(console.error);
  }, [loadedHistory, messages, roomName]);

  /* cleanup on unmount */
  useEffect(() => () => disconnect(), [disconnect]);

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-screen">
      <header className="p-4 bg-gray-800 text-white flex justify-between">
        <span>{roomName}</span>
        <span className="text-sm">
          {username} {isConnected ? '🟢' : '🔴'}
        </span>
      </header>

      <ChatWindow messages={messages} />
      <TypingIndicator typingUsers={typingUsers} />
      <MessageInput onSend={sendMessage} onTyping={setTyping} />
    </div>
  );
}