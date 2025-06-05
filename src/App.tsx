// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { RequireAdmin } from './components/RequireAdmin';
import { RequireServiceAchat } from './components/ServiceAchat/RequireServiceAchat';

// Layouts
import ClientLayout from './components/ClientLayout';
import AdminLayout from './components/AdminLayout';
import ServiceAchatLayout from './components/ServiceAchat/ServiceAchatLayout';

// Pages client
import HomePage        from './pages/HomePage';
import OrderPage       from './pages/OrderPage';
import TrackingPage    from './pages/TrackingPage';
import DashboardPage   from './pages/DashboardPage';
import NewsPage        from './pages/NewsPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage        from './pages/LoginPage';

// Pages admin
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminUsers      from './pages/admin/AdminUsers';
import AdminCatalog    from './pages/admin/AdminCatalog';
import AdminOrders     from './pages/admin/AdminOrders';
import AdminNews       from './pages/admin/AdminNews';
import AdminNotifications from './pages/admin/AdminNotifications';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index               element={<AdminDashboard />} />
            <Route path="dashboard"  element={<AdminDashboard />} />
            <Route path="users"      element={<AdminUsers />} />
            <Route path="catalog"    element={<AdminCatalog />} />
            <Route path="orders"     element={<AdminOrders />} />
            <Route path="news"       element={<AdminNews />} />
            <Route path="notifications" element={<AdminNotifications />} />
          </Route>

          {/* Service Achat */}
          <Route
            path="/achat/*"
            element={
              <RequireServiceAchat>
                <ServiceAchatLayout />
              </RequireServiceAchat>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="catalog" element={<AdminCatalog />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="news" element={<AdminNews />} />
          </Route>

          {/* Client */}
          <Route
            path="/*"
            element={
              <RequireAuth>
                <ClientLayout />
              </RequireAuth>
            }
          >
            <Route index               element={<HomePage />} />
            <Route path="order"       element={<OrderPage />} />
            <Route path="tracking"    element={<TrackingPage />} />
            <Route path="tracking/:orderId" element={<TrackingPage />} />
            <Route path="dashboard"    element={<DashboardPage />} />
            <Route path="news"         element={<NewsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}