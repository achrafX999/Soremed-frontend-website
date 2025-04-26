// src/pages/OrderPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../components/OrderForm';

const OrderPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Passer une commande</h1>
      </div>

      {/* onSuccess est appelé après le POST réussi */}
      <OrderForm onSuccess={() => navigate('/tracking')} />
    </div>
  );
};

export default OrderPage;
