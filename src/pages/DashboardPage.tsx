import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package2, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  // Sample data for charts
  const orderData = [
    { month: 'Jan', orders: 65 },
    { month: 'Feb', orders: 59 },
    { month: 'Mar', orders: 80 },
    { month: 'Apr', orders: 81 },
    { month: 'May', orders: 56 },
    { month: 'Jun', orders: 55 },
  ];

  const statusData = [
    { name: 'Completed', value: 540, color: '#10B981' },
    { name: 'In Progress', value: 120, color: '#3B82F6' },
    { name: 'Cancelled', value: 40, color: '#EF4444' },
  ];

  const stats = [
    { title: 'Orders per Day', value: '700', icon: Package2, color: 'bg-blue-500' },
    { title: 'Cumulative Payments', value: 'DH12,500', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Orders in Progress', value: '23', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Completed Orders', value: '540', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Trends</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
