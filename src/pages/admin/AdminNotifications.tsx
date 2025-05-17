"use client"

import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import {
  Bell,
  Package2,
  ClipboardList,
  Clock,
  Users,
  Settings,
  Save,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function AdminNotifications() {
  // États des paramètres et seuils
  const [notificationSettings, setNotificationSettings] = useState({
    lowStock: true,
    newOrder: true,
    orderStatusChange: false,
    newUser: true,
    systemUpdates: true,
  });
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [orderDelayThreshold, setOrderDelayThreshold] = useState<number>(48);

  // États de chargement et erreur
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Chargement initial des réglages
  useEffect(() => {
    api
      .get("/admin/notifications/settings")
      .then(({ data }) => {
        setNotificationSettings({
          lowStock: data.lowStock,
          newOrder: data.newOrder,
          orderStatusChange: data.orderStatusChange,
          newUser: data.newUser,
          systemUpdates: data.systemUpdates,
        });
        setLowStockThreshold(data.lowStockThreshold);
        setOrderDelayThreshold(data.orderDelayThreshold);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors du chargement des paramètres");
      })
      .finally(() => setLoading(false));
  }, []);

  // Toggle des switches
  const handleToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Sauvegarde des paramètres
  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.put("/admin/notifications/settings", {
        id: 1,
        ...notificationSettings,
        lowStockThreshold,
        orderDelayThreshold,
      });
      toast.success("Paramètres mis à jour !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white shadow rounded-lg">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications & Alertes</h1>
        </div>
        <button
          onClick={saveSettings}
          disabled={loading || saving}
          className={`flex items-center px-4 py-2 rounded-md text-white transition-colors 
            ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {saving ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          {saving ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>

      {/* Types de notifications */}
      <div className="space-y-4">
        {[
          { key: "lowStock", icon: <Package2 />, label: "Alerte de stock faible" },
          { key: "newOrder", icon: <ClipboardList />, label: "Nouvelle commande" },
          { key: "orderStatusChange", icon: <Clock />, label: "Changement statut commande" },
          { key: "newUser", icon: <Users />, label: "Nouvel utilisateur" },
          { key: "systemUpdates", icon: <Settings />, label: "Mises à jour système" },
        ].map(({ key, icon, label }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {React.cloneElement(icon as React.ReactElement, {
                className: "h-5 w-5 text-gray-500",
              })}
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notificationSettings[key as keyof typeof notificationSettings]}
                onChange={() => handleToggle(key as keyof typeof notificationSettings)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300
                                peer-checked:bg-blue-600 relative after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                peer-checked:after:translate-x-full peer-checked:after:border-white">
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* Seuils d'alerte */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200 flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Seuils d'alerte</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seuil de stock faible</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={lowStockThreshold}
                min={1}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
              />
              <span className="text-sm text-gray-500">unités</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Une alerte sera générée lorsque le stock descend en dessous de ce seuil
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Délai de traitement des commandes</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={orderDelayThreshold}
                min={1}
                onChange={(e) => setOrderDelayThreshold(Number(e.target.value))}
              />
              <span className="text-sm text-gray-500">heures</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Une alerte sera générée pour les commandes non traitées dans ce délai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNotifications;
