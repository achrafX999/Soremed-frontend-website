// src/components/NewsModal.tsx
import React from 'react';
import { XCircle, CheckCircle } from 'lucide-react';
import { News } from '../types/News';

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
  const handleInputChange = <K extends keyof News>(field: K, value: News[K]) => {
    onChange({ ...newsItem, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Modifier l’actualité' : 'Ajouter une actualité'}
          </h2>
          <button onClick={onClose}>
            <XCircle className="h-6 w-6 text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
            <input
              type="text"
              value={newsItem.title}
              onChange={e => handleInputChange('title', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Category */}
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
          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de l’image</label>
            <input
              type="text"
              value={newsItem.imageUrl}
              onChange={e => handleInputChange('imageUrl', e.target.value)}
              className="w-full p-2 border rounded-md"
            />
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
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
