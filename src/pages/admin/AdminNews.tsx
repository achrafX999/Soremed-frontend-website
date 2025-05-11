// src/pages/admin/AdminNews.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { News } from '../../types/News';
import NewsModal from '../../components/NewsModal';

const AdminNews: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // newNews without id
  const [newNewsItem, setNewNewsItem] = useState<Omit<News, 'id'>>({
    title: '',
    description: '',
    category: '',
    date: '',
    imageUrl: ''
  });

  // Fetch news items
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<News[]>('/news');
        setNewsList(res.data);
      } catch (err: unknown) {
        console.error(err);
        setError('Impossible de charger les actualités');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Create
  const handleAdd = async () => {
    try {
      const res = await api.post<News>('/news', newNewsItem);
      setNewsList(prev => [...prev, res.data]);
      toast.success('Actualité ajoutée');
      setShowAddModal(false);
      setNewNewsItem({ title: '', description: '', category: '', date: '', imageUrl: '' });
    } catch {
      toast.error('Échec de l’ajout');
    }
  };

  // Update
  const handleEdit = async () => {
    if (!selectedNews) return;
    try {
      const res = await api.put<News>(`/news/${selectedNews.id}`, selectedNews);
      setNewsList(prev => prev.map(n => n.id === res.data.id ? res.data : n));
      toast.success('Actualité modifiée');
      setShowEditModal(false);
      setSelectedNews(null);
    } catch {
      toast.error('Échec de la modification');
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette actualité ?')) return;
    try {
      await api.delete(`/news/${id}`);
      setNewsList(prev => prev.filter(n => n.id !== id));
      toast.success('Actualité supprimée');
    } catch {
      toast.error('Échec de la suppression');
    }
  };

  if (loading) return <div className="p-6 text-center">Chargement…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">News Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add News
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {newsList.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => { setSelectedNews(item); setShowEditModal(true); }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <NewsModal
          newsItem={{ id: 0, ...newNewsItem }}
          onChange={n => setNewNewsItem({
            title: n.title,
            description: n.description,
            category: n.category,
            date: n.date,
            imageUrl: n.imageUrl
          })}
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}

      {showEditModal && selectedNews && (
        <NewsModal
          isEdit
          newsItem={selectedNews}
          onChange={n => setSelectedNews(n)}
          onClose={() => { setShowEditModal(false); setSelectedNews(null); }}
          onSave={handleEdit}
        />
      )}
    </div>
  );
};

export default AdminNews;