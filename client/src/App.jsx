import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ChatRoom from './pages/ChatRoom.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/chat"    element={<ChatRoom />} />
        <Route path="/register"element={<Register />} />
        <Route path="/login"   element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}