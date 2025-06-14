// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pill, ClipboardList, Activity, LayoutDashboard, Newspaper, UserPlus } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="w-56 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <Pill className="h-8 w-8 text-green-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Soremed</span>
        </Link>
      </div>
      
      <nav className="mt-6">
      <Link
          to="/dashboard"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/dashboard') ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Tableau de bord
        </Link>
        <Link
          to="/"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/') ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Pill className="h-5 w-5 mr-3" />
          Recherche
        </Link>
        
        <Link
          to="/order"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/order') ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ClipboardList className="h-5 w-5 mr-3" />
          Commande
        </Link>
        
        <Link
          to="/tracking"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/tracking') ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Activity className="h-5 w-5 mr-3" />
          Suivi
        </Link>
        
        

        <Link
          to="/news"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/news') ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Newspaper className="h-5 w-5 mr-3" />
          Actualités & mises à jour
        </Link>

        <Link
          to="/register"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/register') ? 'bg-green-50 text-green-600 border-r-4 border-green-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <UserPlus className="h-5 w-5 mr-3" />
          Inscription
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
