// src/components/MedicationModal.tsx
import React from 'react';
import { Medication } from '../types';

export interface MedicationModalProps {
  isEdit?: boolean;
  medication: Medication;
  onChange: (med: Medication) => void;
  onClose: () => void;
  onSave: () => void;
}

const MedicationModal: React.FC<MedicationModalProps> = ({
  isEdit = false,
  medication,
  onChange,
  onClose,
  onSave
}) => {
  const med = medication;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? 'Modifier le médicament' : 'Ajouter un médicament'}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={med.name}
              onChange={e => onChange({ ...med, name: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage
            </label>
            <input
              type="text"
              value={med.dosage}
              onChange={e => onChange({ ...med, dosage: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Form
            </label>
            <select
              value={med.form}
              onChange={e => onChange({ ...med, form: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Form</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Liquid">Liquid</option>
              <option value="Injection">Injection</option>
              <option value="Cream">Cream</option>
            </select>
          </div>
          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={med.quantity}
              onChange={e =>
                onChange({ ...med, quantity: parseInt(e.target.value, 10) || 0 })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={med.price}
              onChange={e =>
                onChange({ ...med, price: parseFloat(e.target.value) || 0 })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Manufacturer */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacturer
            </label>
            <input
              type="text"
              value={med.manufacturer}
              onChange={e =>
                onChange({ ...med, manufacturer: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={med.description}
              onChange={e =>
                onChange({ ...med, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEdit ? 'Save Changes' : 'Add Medication'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationModal;
