// src/pages/DashboardPage.tsx
"use client"

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Clock, CheckCircle } from 'lucide-react';
import api from '../api/axios';

// Types pour ce composant
interface ClientTopProduct {
  productName: string;
  totalQuantity: number;
}
interface OrderStatusDTO {
  status: string;
  count: number;
}

const DashboardPage: React.FC = () => {
  const [topProducts, setTopProducts]   = useState<ClientTopProduct[]>([]);
  const [statusData, setStatusData]     = useState<OrderStatusDTO[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ClientTopProduct[]>('/client/dashboard/top-products'),
      api.get<OrderStatusDTO[]>('/client/dashboard/status-distribution'),
    ])
      .then(([topRes, statusRes]) => {
        setTopProducts(topRes.data);
        setStatusData(statusRes.data);
      })
      .catch(err => {
        console.error(err);
        setError("Impossible de charger les données du dashboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement du dashboard…</div>;
  if (error)   return <div className="text-red-600">{error}</div>;

  // Calcul des KPI à partir de statusData
  const processingCount = statusData
    .find(s => s.status.toUpperCase() === 'PROCESSING' || s.status.toUpperCase() === 'IN_PROGRESS')
    ?.count ?? 0;
  const completedCount = statusData
    .find(s => s.status.toUpperCase() === 'COMPLETED')
    ?.count ?? 0;

  const statsKpi = [
    { title: 'Orders in Progress', value: processingCount, icon: Clock,       color: 'bg-yellow-500' },
    { title: 'Completed Orders',   value: completedCount,  icon: CheckCircle, color: 'bg-green-500' },
  ];

  // Préparation des données pour les graphiques
  const barData = topProducts.map(p => ({
    name: p.productName,
    volume: p.totalQuantity
  }));
  const pieData = statusData.map(s => ({
    name: s.status,
    value: s.count,
    color:
      s.status.toUpperCase() === 'COMPLETED'   ? '#10B981' :
      s.status.toUpperCase() === 'PROCESSING'   ? '#3B82F6' :
      s.status.toUpperCase() === 'CANCELLED'    ? '#EF4444' :
      '#9CA3AF'
  }));

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsKpi.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* BarChart Top 5 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 produits (volume)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 10, right: 20, bottom: 10, left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="volume" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PieChart Statuts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {pieData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color}
                      stroke={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  formatter={(value, entry) => {
                    const payload = entry.payload as { color?: string };
                    const color = payload.color ?? '#000';
                    return <span style={{ color }}>{value}</span>;
                  }}
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
