import React from 'react';
import { Bell, User } from 'lucide-react';

const AdminHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Admin User</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;