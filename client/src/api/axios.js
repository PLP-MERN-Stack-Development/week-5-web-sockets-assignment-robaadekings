import axios from 'axios';

const api = axios.create({
  baseURL: '/api',              // Vite proxy rewrites to http://localhost:5000
  withCredentials: true,
});

//Attach JWT on every request 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;