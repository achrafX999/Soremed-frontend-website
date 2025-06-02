// src/components/Header.tsx

import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, User, Bell, Loader2, Check, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  severity: string;
  read: boolean;
}

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) {
    throw new Error('AuthContext non initialisé');
  }
  const { user, logout } = auth;

  // --- États pour le panneau de notifications ---
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Récupérer les notifications pour le client connecté
  const fetchOrderNotifications = async () => {
    setLoadingNotif(true);
    try {
      const { data } = await api.get<Notification[]>('/notifications/orders');
      setNotifications(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les notifications de commandes");
    } finally {
      setLoadingNotif(false);
    }
  };

  // Ouvre/ferme le panneau et déclenche le fetch quand on ouvre
  const toggleNotifications = () => {
    setShowNotif(prev => {
      if (!prev) {
        fetchOrderNotifications();
      }
      return !prev;
    });
  };

  // Fermer le panneau si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marquer comme lu
  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/orders/${id}/read`);
      setNotifications(notifs =>
        notifs.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du marquage comme lu");
    }
  };

  // Supprimer la notification
  const deleteNotif = async (id: number) => {
    try {
      await api.delete(`/notifications/orders/${id}`);
      setNotifications(notifs => notifs.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Formater la date
  const formatDate = (iso: string) =>
    format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: fr });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Erreur lors de la déconnexion', err);
    }
  };

  return (
    <header className="bg-white shadow-md pl-64 flex justify-between items-center h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center w-full">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900">Welcome to Soremed</h2>
        </div>

        {/* Bloc des actions utilisateur */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Icône de notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div
                ref={panelRef}
                className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50"
              >
                {loadingNotif ? (
                  <div className="p-4 flex justify-center">
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-4 border-b last:border-b-0 ${n.read ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-800">{n.message}</p>
                        <div className="flex space-x-2">
                          {!n.read && (
                            <button onClick={() => markAsRead(n.id)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </button>
                          )}
                          <button onClick={() => deleteNotif(n.id)}>
                            <Trash className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(n.timestamp)}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">Aucune notification</div>
                )}
              </div>
            )}
          </div>

          {/* Icône utilisateur + déconnexion */}
          {user && (
            <>
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700">{user.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
