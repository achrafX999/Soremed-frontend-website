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
import { NotificationSettings } from "types/notification";

function AdminNotifications() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Chargement initial
  useEffect(() => {
    api
      .get<NotificationSettings>("/admin/notifications/settings")
      .then(({ data }) => {
        setSettings(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erreur lors du chargement des paramètres");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Toggle des switches
  const handleToggle = (key: keyof Omit<NotificationSettings, "id" | "lowStockThreshold" | "orderDelayThreshold">) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: !settings[key],
    } as NotificationSettings);
  };

  // Mise à jour côté backend
  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const { data } = await api.put<NotificationSettings>("/admin/notifications/settings", settings);
      setSettings(data);
      toast.success("Paramètres mis à jour !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-700">Chargement des paramètres…</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 text-center text-red-600">
        Impossible de charger les paramètres d’alerte.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white shadow rounded-lg">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications &amp; Alertes</h1>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`flex items-center px-4 py-2 rounded-md text-white transition-colors 
            ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {saving ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
          {saving ? "Enregistrement..." : "Sauvegarder"}
        </button>
      </div>

      {/* Switches pour chaque type de notification */}
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
              {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-gray-500" })}
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings[key as keyof NotificationSettings] as boolean}
                onChange={() => handleToggle(key as keyof Omit<NotificationSettings, "id" | "lowStockThreshold" | "orderDelayThreshold">)}
                disabled={saving}
              />
              <div
                className="w-11 h-6 bg-gray-200 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300
                           peer-checked:bg-blue-600 relative after:absolute after:top-[2px] after:left-[2px]
                           after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                           peer-checked:after:translate-x-full peer-checked:after:border-white"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Seuils d'alerte (stock & délai) */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200 flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-medium text-gray-900">Seuils d'alerte</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Seuil de stock faible */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seuil de stock faible
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={settings.lowStockThreshold}
                min={1}
                onChange={(e) =>
                  setSettings({ ...settings, lowStockThreshold: Number(e.target.value) })
                }
                disabled={saving}
              />
              <span className="text-sm text-gray-500">unités</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Une alerte sera générée lorsque le stock descend en dessous de ce seuil.
            </p>
          </div>

          {/* Délai de traitement des commandes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai de traitement des commandes
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={settings.orderDelayThreshold}
                min={1}
                onChange={(e) =>
                  setSettings({ ...settings, orderDelayThreshold: Number(e.target.value) })
                }
                disabled={saving}
              />
              <span className="text-sm text-gray-500">heures</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Une alerte sera générée pour les commandes non traitées dans ce délai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNotifications;
