import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pill, ClipboardList, Activity, LayoutDashboard } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <Pill className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MedTrack</span>
        </Link>
      </div>
      
      <nav className="mt-6">
        <Link
          to="/"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Pill className="h-5 w-5 mr-3" />
          Search
        </Link>
        
        <Link
          to="/order"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/order') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ClipboardList className="h-5 w-5 mr-3" />
          Order
        </Link>
        
        <Link
          to="/tracking"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/tracking') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Activity className="h-5 w-5 mr-3" />
          Tracking
        </Link>
        
        <Link
          to="/dashboard"
          className={`flex items-center px-6 py-3 text-sm font-medium ${
            isActive('/dashboard') ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Dashboard
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;