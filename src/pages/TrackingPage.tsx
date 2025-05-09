// src/pages/TrackingPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderList from '../components/OrderList';
import api from '../api/axios';
import { Order } from '../types';

const TrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (orderId) {
      api
        .get<Order>(`/orders/${orderId}`)
        .then(({ data }) => setOrders([data]))
        .catch(console.error);
    } else {
      api
        .get<Order[]>('/orders')
        .then(({ data }) => setOrders(data))
        .catch(console.error);
    }
  }, [orderId]);

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toString().includes(searchTerm);
    const orderDate = new Date(o.orderDate);

    const matchesStart = !startDate || orderDate >= new Date(startDate);
    const matchesEnd = !endDate || orderDate <= new Date(endDate);

    return matchesSearch && matchesStart && matchesEnd;
  });

  return (
    <div className="p-6">
      {/* Barre de recherche par ID + filtres date */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Rechercher par ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[150px] pl-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="pl-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="pl-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <OrderList orders={filtered} onStatusChange={undefined} />
    </div>
  );
};

export default TrackingPage;
