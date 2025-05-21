// src/components/NewsModal.tsx
import React, { useState } from 'react';
import { XCircle, CheckCircle, Loader2 } from 'lucide-react';
import { News } from '../types/News';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export interface NewsModalProps {
  isEdit?: boolean;
  newsItem: News;
  onChange: (news: News) => void;
  onClose: () => void;
  onSave: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({
  isEdit = false,
  newsItem,
  onChange,
  onClose,
  onSave
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);

      // On n'envoie PAS d'en-tête Content-Type ici :
      const res = await api.post<{ imageUrl: string }>(
        '/news/upload',
        form
      );

      onChange({ ...newsItem, imageUrl: res.data.imageUrl });
      toast.success('Image uploadée');
    } catch (err) {
      console.error(err);
      toast.error('Échec de l’upload');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = <K extends keyof News>(field: K, value: News[K]) => {
    onChange({ ...newsItem, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Modifier l’actualité' : 'Ajouter une actualité'}
          </h2>
          <button onClick={onClose}>
            <XCircle className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={newsItem.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <input
              type="text"
              value={newsItem.category}
              onChange={e => handleInputChange('category', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newsItem.date.split('T')[0] || ''}
              onChange={e => handleInputChange('date', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
              ) : (
                newsItem.imageUrl && (
                  <img
                    src={newsItem.imageUrl}
                    alt="Aperçu"
                    className="h-12 w-12 object-cover rounded"
                  />
                )
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={newsItem.description}
              onChange={e => handleInputChange('description', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={uploading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
