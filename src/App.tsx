// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RequireAuth } from './components/RequireAuth';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import TrackingPage from './pages/TrackingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

// Nouvelles pages :
import RegistrationPage from './pages/RegistrationPage';
import NewsPage from './pages/NewsPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <div className="pl-64">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* Pages publiques */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />

                {/* Pages protégées (nécessitent d'être connecté) */}
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <HomePage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/order"
                  element={
                    <RequireAuth>
                      <OrderPage />
                    </RequireAuth>
                  }
                />
                <Route path="/tracking" element={
                <RequireAuth><TrackingPage/></RequireAuth>
              } />
              <Route path="/tracking/:orderId" element={
                <RequireAuth><TrackingPage/></RequireAuth>
              } />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <DashboardPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/news"
                  element={
                    <RequireAuth>
                      <NewsPage />
                    </RequireAuth>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
