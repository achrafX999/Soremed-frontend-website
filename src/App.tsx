// src/App.tsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage';
import TrackingPage from './pages/TrackingPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';           // à créer
import { AuthProvider, AuthContext } from './contexts/AuthContext';


// Composant pour protéger une route
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthContext non initialisé');
  return auth.user 
    ? <>{children}</> 
    : <Navigate to="/login" replace />;
}


export default function App() {
  return (
    <AuthProvider>                         {/* ❶ AuthProvider autour de tout */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <div className="pl-64">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                {/* ❷ Route publique de login */}
                <Route path="/login" element={<LoginPage />} />

                {/* ❸ Toutes les autres routes sont privées */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/order" 
                  element={
                    <PrivateRoute>
                      <OrderPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tracking" 
                  element={
                    <PrivateRoute>
                      <TrackingPage />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
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
