// src/pages/NewsPage.tsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { News } from '../types/News';
import { MedStats } from '../types/Stats';
import { StatCard } from '../types/StateCard';
import { Bell, Package2, TrendingUp } from 'lucide-react';

const NewsPage: React.FC = () => {
  // état pour les news
  const [news, setNews] = useState<News[]>([]);
  // états pour les stats
  const [stats, setStats] = useState<StatCard[]>([
    { title: "New Products This Month", value: "…", icon: Package2, color: "bg-blue-500" },
    { title: "Inventory Updates",      value: "…", icon: Bell,     color: "bg-green-500" },
    { title: "Price Changes",           value: "…", icon: TrendingUp, color: "bg-purple-500" }
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1️⃣ Chargement simultané des news et des stats
        const [newsRes, statsRes] = await Promise.all([
          api.get<News[]>('/news'),
          api.get<MedStats>('/medications/stats')
        ]);

        // on met à jour les news
        setNews(newsRes.data);

        // on met à jour les stats avec les vraies valeurs
        const s = statsRes.data;
        setStats([
          {
            title: "New Products This Month",
            value: s.newProductsThisMonth.toString(),
            icon: Package2,
            color: "bg-blue-500"
          },
          {
            title: "Inventory Updates",
            value: s.inventoryUpdatesThisMonth.toString(),
            icon: Bell,
            color: "bg-green-500"
          },
          {
            title: "Price Changes",
            value: s.priceChangesThisMonth.toString(),
            icon: TrendingUp,
            color: "bg-purple-500"
          }
        ]);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les actualités ou les statistiques");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-center">Chargement…</div>;
  if (error)   return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">News & Updates</h1>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 flex">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white"/>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actualités */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {news.map(item => (
          <div key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
              <button className="mt-4 text-green-600 hover:text-green-800 font-medium">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
