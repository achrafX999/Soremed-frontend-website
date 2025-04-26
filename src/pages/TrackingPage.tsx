// src/pages/TrackingPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderList from '../components/OrderList';
import api from '../api/axios';
import { Order } from '../types';
import { Search } from 'lucide-react';

const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Si un orderId est passé, on ne charge que cette commande
  useEffect(() => {
    if (orderId) {
      api.get<Order>(`/orders/${orderId}`)
        .then(({ data }) => setOrders([data]))
        .catch(console.error);
    } else {
      api.get<Order[]>('/orders')
        .then(({ data }) => setOrders(data))
        .catch(console.error);
    }
  }, [orderId]);

  const filtered = orders.filter(o =>
    o.id.toString().includes(searchTerm)
  );

  return (
    <div>
      {/* Recherche par ID */}
      {!orderId && (
        <div className="flex mb-4">
          <Search className="text-gray-400 h-5 w-5 mr-2" />
          <input
            type="text"
            placeholder="Rechercher par ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <OrderList orders={filtered} onStatusChange={undefined /* ou ta fonction si besoin */} />
    </div>
  );
};

export default TrackingPage;
