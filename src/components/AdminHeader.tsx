"use client"

import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { Bell, User, Loader2, Trash, Check } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  severity: string;
  read: boolean;
}

export default function AdminHeader() {
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Charger les notifications récentes
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Notification[]>("/admin/notifications/recent");
      setNotifications(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les notifications");
    } finally {
      setLoading(false);
    }
  };

  // Toggle panneau
  const toggleNotifications = () => {
    setShowNotif(prev => {
      if (!prev) fetchNotifications();
      return !prev;
    });
  };

  // Clic extérieur pour fermer
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Marquer comme lu
  const markAsRead = async (id: number) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      setNotifications(notifs =>
        notifs.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du marquage comme lu");
    }
  };

  // Supprimer notification
  const deleteNotif = async (id: number) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(notifs => notifs.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (iso: string) =>
    format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: fr });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h2 className="text-xl font-semibold text-gray-900">Welcome to Soremed</h2>

          <div className="flex items-center space-x-4">
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
                  {loading ? (
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

            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Admin User</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
