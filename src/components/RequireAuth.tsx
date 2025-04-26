import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    throw new Error('AuthContext non initialisé');
  }

  // tant que l’API /users/me est en cours
  if (auth.loading) {
    return <div>Chargement…</div>;
  }

  // une fois le chargement terminé, si pas d’utilisateur → login
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // sinon, on rend la route protégée
  return children;
};
