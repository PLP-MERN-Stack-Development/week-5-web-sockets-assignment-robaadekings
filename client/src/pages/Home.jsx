import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketProvider';

export default function Home() {
  const [username, setUsername] = useState('');
  const nav        = useNavigate();
  const { connect } = useSocketContext();

  /* redirect to /login if no JWT in localStorage */
  useEffect(() => {
    if (!localStorage.getItem('token')) nav('/login');
  }, [nav]);

  const join = () => {
    if (!username.trim()) return;
    connect(username, 'general');
    nav('/chat', { state: { username, roomName: 'general' } });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">Enter Chat</h1>
      <input
        className="border p-2 rounded w-64"
        placeholder="Set a display name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={join} className="bg-blue-600 text-white px-6 py-2 rounded">
        Join Room
      </button>
    </div>
  );
}