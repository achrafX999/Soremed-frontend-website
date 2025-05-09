import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  //"http://localhost:8080/api" le Url du serveur backend est pris dans le fichier .env
  headers: { 'Content-Type': 'application/json' },
});

// Avant chaque requête, injecte le header Basic stocké en localStorage
api.interceptors.request.use(config => {
  const auth = localStorage.getItem('auth');
  if (auth) config.headers.Authorization = auth;
  return config;
});



export default api;
