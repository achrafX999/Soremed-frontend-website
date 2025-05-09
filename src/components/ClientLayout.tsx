// src/components/ClientLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const ClientLayout: React.FC = () => {
  return (
    <>
      {/* Sidebar fixe à gauche */}
      <Sidebar />

      {/* Contenu client avec padding à gauche pour compenser le Sidebar */}
      <div className="pl-56 min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default ClientLayout;
