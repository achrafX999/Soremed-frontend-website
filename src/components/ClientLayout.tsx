// src/components/ClientLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const ClientLayout: React.FC = () => {
  return (
    <div className="flex">
      {/* Sidebar fixe à gauche */}
      <div className="fixed inset-y-0 left-0 w-56">
        <Sidebar />
      </div>

      {/* Contenu principal décalé de la largeur du sidebar */}
      <div className="flex flex-col flex-1 ml-56 min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Main : prend tout l’espace restant et scroll si besoin */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>

        {/* Footer collé en bas */}
        <Footer />
      </div>
    </div>
  );
};

export default ClientLayout;
