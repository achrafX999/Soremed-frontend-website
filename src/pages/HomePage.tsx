// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import MedicationCard from '../components/MedicationCard';
import api from '../api/axios';
import { Medication } from '../types';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuantity, setSearchQuantity] = useState('');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  const fetchMeds = () => {
    api.get<{
      content: Medication[];
      totalPages: number;
    }>('/medications', {
      params: {
        search: searchTerm,
        minQuantity: Number(searchQuantity) || 0,
        page,
        size: pageSize,
      }
    })
    .then(({ data }) => {
      setMedications(data.content);
      setTotalPages(data.totalPages);
    })
    .catch(console.error);
  };

  // recharge à chaque changement de filtre ou de page
  useEffect(fetchMeds, [searchTerm, searchQuantity, page]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Medications
        </h1>
        <div className="flex mb-4">
          <input
            type="number"
            placeholder="Quantity"
            value={searchQuantity}
            onChange={e => { setPage(0); setSearchQuantity(e.target.value); }}
            className="w-24 mr-4 pl-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by medication name..."
              value={searchTerm}
              onChange={e => { setPage(0); setSearchTerm(e.target.value); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map(med => (
          <MedicationCard
            key={med.id}
            medication={med}
            onOrder={(m) => console.log('Order medication:', m)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span>Page {page + 1} / {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default HomePage;
