// src/components/MedicationCard.tsx
import React from 'react';
import { Package2, Pill as Pills } from 'lucide-react';
import { Medication } from '../types';

interface MedicationCardProps {
  medication: Medication;
  onOrder?: (medication: Medication) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* En-tête: nom & sous-titre */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {medication.name}
          </h3>
          {/* Si tu as genericName dans ton type, sinon supprime cette ligne */}
          
        </div>
        <Pills className="h-6 w-6 text-blue-600" />
      </div>
      
      <div className="mt-4 space-y-3">
        {/* Dosage & forme */}
        <div className="flex items-center text-sm">
          <Package2 className="h-4 w-4 mr-2 text-gray-500" />
          <span className="font-medium text-gray-700">
            {medication.dosage} • {medication.form}
          </span>
        </div>
        
        {/* Manufacturer et description */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium text-gray-700">Manufacturer:</span> {medication.manufacturer}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium text-gray-700">Description:</span> {medication.description}
          </p>
        </div>
        
        {/* Stock & prix */}
        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              Stock:{' '}
              <span className={medication.quantity > 20 ? 'text-green-600' : 'text-red-600'}>
                {medication.quantity} units
              </span>
            </p>
            <p className="text-lg font-bold text-blue-600">
              {medication.price.toFixed(2)}DH
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;
