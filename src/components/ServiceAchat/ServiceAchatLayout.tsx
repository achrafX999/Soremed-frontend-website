import React from 'react';
import { Outlet } from 'react-router-dom';
import ServiceAchatSidebar from './ServiceAchatSidebar';
import AdminHeader from '../AdminHeader';

const ServiceAchatLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <ServiceAchatSidebar />
      <div className="pl-64">
        <AdminHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ServiceAchatLayout;