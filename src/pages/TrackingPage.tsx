import React, { useState } from 'react';
import { Search } from 'lucide-react';
import OrderList from '../components/OrderList';
import { Order } from '../types';

const TrackingPage: React.FC = () => {
  // Sample orders data - in a real application, this would come from an API
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-03-15T10:30:00Z',
      status: 'in_progress',
      items: [
        { medicationId: 'med1', quantity: 2, price: 15.99 },
        { medicationId: 'med2', quantity: 1, price: 12.50 }
      ],
      total: 44.48
    },
    {
      id: 'ORD-002',
      date: '2024-03-14T15:45:00Z',
      status: 'completed',
      items: [
        { medicationId: 'med2', quantity: 3, price: 12.50 }
      ],
      total: 37.50
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search orders by ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <OrderList
        orders={filteredOrders}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default TrackingPage;