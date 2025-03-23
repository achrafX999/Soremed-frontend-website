import React from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md pl-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">Welcome to MedTrack</h2>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;