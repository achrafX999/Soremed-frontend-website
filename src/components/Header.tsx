// src/components/Header.tsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error('AuthContext non initialisé');
  }

  const { user, logout } = auth;

  const handleLogout = async () => {
    try {
      await logout();          // appelle POST /api/logout et vide localStorage
      navigate('/login');      // redirige vers la page de connexion
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    }
  };

  return (
    <header className="bg-white shadow-md pl-64 flex justify-between items-center h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center w-full">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900">Welcome to Soremed</h2>
        </div>

        {/* Si l'utilisateur est connecté, on affiche son nom et un bouton logout */}
        {user && (
          <div className="flex items-center space-x-4 ml-auto">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-gray-700">{user.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
