import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const nav = useNavigate();

  const submit = async () => {
    try {
      const { data } = await api.post('auth/login', { email, password: pass });
      localStorage.setItem('token', data.token);
      nav('/');
    } catch (e) {
      alert(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-20">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="border p-2 rounded w-72" placeholder="Email"
             value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input className="border p-2 rounded w-72" type="password" placeholder="Password"
             value={pass}  onChange={(e)=>setPass(e.target.value)} />
      <button onClick={submit} className="bg-blue-600 text-white px-6 py-2 rounded">Login</button>
      
      <p className="text-sm mt-4">
        Don’t have an account? <Link to="/register" className="text-blue-600 underline">Register here</Link>
      </p>
    </div>
  );
}