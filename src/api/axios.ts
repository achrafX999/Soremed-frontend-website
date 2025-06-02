// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ex: "http://localhost:8080/api"
  transformRequest: [
    (data, headers) => {
      // Si c'est un FormData, on supprime le Content-Type pour qu'Axios gère la boundary
      if (data instanceof FormData) {
        delete headers['Content-Type'];
        return data;
      }
      // Sinon, on force le JSON
      headers['Content-Type'] = 'application/json';
      return JSON.stringify(data);
    }
  ],
});

// Interceptor pour ajouter automatiquement le header Authorization avant chaque requête
api.interceptors.request.use(config => {
  // 1) Récupérer la valeur “auth” ou “token” dans le localStorage
  //    - Si vous stockez un token JWT sous la clé 'token', utilisez cette ligne :
  const jwt = localStorage.getItem('token');
  if (jwt && config.headers) {
    // Supply `Bearer <token>`
    config.headers.Authorization = `Bearer ${jwt}`;
    return config;
  }

  // 2) Ou, si vous aviez stocké un header “Basic <credentials>” sous la clé 'auth', utilisez ceci :
  const basic = localStorage.getItem('auth');
  if (basic && config.headers) {
    // On suppose que 'basic' contient déjà “Basic <…>”
    config.headers.Authorization = basic;
    return config;
  }

  return config;
});

export default api;
