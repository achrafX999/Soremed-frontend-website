import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // ex: "http://localhost:8080/api"
  headers: { 'Content-Type': 'application/json' },
});

// Avant chaque requête, injecte le header Basic stocké en localStorage
api.interceptors.request.use(config => {
  const auth = localStorage.getItem('auth');
  if (auth) config.headers.Authorization = auth;
  return config;
});

export default api;
