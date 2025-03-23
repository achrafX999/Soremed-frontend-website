import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import { OrderItem } from '../types';

const OrderPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmitOrder = (items: OrderItem[]) => {
    // In a real application, this would make an API call to create the order
    console.log('Order submitted:', items);
    // Navigate to tracking page after order is placed
    navigate('/tracking');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Place Order</h1>
      </div>
      
      <OrderForm onSubmit={handleSubmitOrder} />
    </div>
  );
};

export default OrderPage;