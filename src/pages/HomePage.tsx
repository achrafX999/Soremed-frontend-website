import React, { useState, useEffect } from 'react';//useState pour gérer l'état local (ici, le terme de recherche et la liste filtrée).useEffect pour mettre à jour la liste des médicaments filtrés à chaque changement de terme de recherche.
import { Search } from 'lucide-react';
import MedicationCard from '../components/MedicationCard'; //Un composant qui sera utilisé pour afficher les informations de chaque médicament dans un format de carte.
import { medications } from '../data/medications';
import { Medication } from '../types';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuantity, setSearchQuantity] = useState('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(medications);

  useEffect(() => {
    const filtered = medications.filter(med => {
      // Convertir le terme de recherche et le nom du médicament en minuscules pour une comparaison insensible à la casse
      const termMatch = 
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Si une quantité est saisie, vérifie que le médicament possède au moins cette quantité disponible
      const quantityMatch = searchQuantity
        ? med.quantity >= Number(searchQuantity)
        : true;
      
      return termMatch && quantityMatch;
    });
    setFilteredMedications(filtered);
  }, [searchTerm, searchQuantity]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Medications</h1>
        <div className="flex mb-4">
          {/* Champ de saisie pour la quantité */}
          <input
            type="number"
            placeholder="Quantity"
            value={searchQuantity}
            onChange={(e) => setSearchQuantity(e.target.value)}
            className="w-24 mr-4 pl-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {/* Barre de recherche */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by medication name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedications.map(medication => (
          <MedicationCard 
            key={medication.id}
            medication={medication}
            onOrder={(med) => {
              // Handle order action
              console.log('Order medication:', med);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
