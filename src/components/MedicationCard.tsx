import React from 'react';
import { Package2, Pill as Pills } from 'lucide-react';
import { Medication } from '../types';

interface MedicationCardProps {
  medication: Medication;
  onOrder?: (medication: Medication) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, onOrder }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{medication.name}</h3>
          <p className="text-sm text-gray-500">{medication.genericName}</p>
        </div>
        <Pills className="h-6 w-6 text-blue-600" />
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Package2 className="h-4 w-4 mr-2" />
          <span>{medication.dosage} • {medication.form}</span>
        </div>
        
        
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Stock: <span className={medication.quantity > 20 ? 'text-green-600' : 'text-red-600'}>
                {medication.quantity} units
              </span>
            </p>
            <p className="text-lg font-bold text-blue-600">
              ${medication.price.toFixed(2)}
            </p>
          </div>
          
          {onOrder && (
            <button
              onClick={() => onOrder(medication)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationCard;