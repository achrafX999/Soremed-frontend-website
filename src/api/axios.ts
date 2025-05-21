// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex: "http://localhost:8080/api"
  headers: {}, // ne rien définir ici pour Content-Type
  transformRequest: [
    (data, headers) => {
      // Si c'est un FormData, on supprime le Content-Type pour laisser Axios gérer la boundary
      if (data instanceof FormData) {
        delete headers['Content-Type'];
        return data;
      }
      // Sinon on stringify en JSON
      headers['Content-Type'] = 'application/json';
      return JSON.stringify(data);
    }
  ],
});

// Avant chaque requête, injecte le header Basic stocké en localStorage
api.interceptors.request.use(config => {
  const auth = localStorage.getItem('auth');
  if (auth) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = auth;
  }
  return config;
});

export default api;
