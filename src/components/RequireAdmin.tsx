// src/components/RequireAdmin.tsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth) {
    throw new Error('AuthContext non initialisé');
  }
  const { user, loading } = auth;

  if (loading) {
    return <div>Chargement…</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
