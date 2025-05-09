// src/pages/admin/AdminCatalog.tsx
import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package2,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Medication, PageResponse } from '../../types';

const AdminCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm]             = useState<string>('');
  const [sortField, setSortField]               = useState<keyof Medication>('name');
  const [sortDirection, setSortDirection]       = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal]         = useState<boolean>(false);
  const [showEditModal, setShowEditModal]       = useState<boolean>(false);
  const [selectedMedication, setSelectedMedication] =
                                                useState<Medication | null>(null);
  const [medicationsList, setMedicationsList]   = useState<Medication[]>([]);
  const [loading, setLoading]                   = useState<boolean>(true);
  const [error, setError]                       = useState<string | null>(null);

  // newMedication sans 'id'
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id'>>({
    name: '',
    description: '',
    dosage: '',
    form: '',
    manufacturer: '',
    price: 0,
    quantity: 0,
  });

  // ── 1️⃣ Fonction de tri ───────────────────────────────────────────────────
  const handleSort = (field: keyof Medication) => {
    if (field === sortField) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // ── 2️⃣ Chargement du catalogue ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<PageResponse<Medication>>(
          '/medications',
          {
            params: {
              search: '',
              minQuantity: 0,
              page: 0,
              size: 1000
            }
          }
        );
        setMedicationsList(res.data.content);
      } catch (err: unknown) {
        console.error(err);
        setError('Impossible de charger le catalogue');
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  

  // ── 3️⃣ Actions CRUD via backend ────────────────────────────────────────
  const handleAddMedication = async () => {
    try {
      const res = await api.post<Medication>('/medications', newMedication);
      setMedicationsList(prev => [...prev, res.data]);
      toast.success('Médicament ajouté');
      setShowAddModal(false);
      setNewMedication({
        name: '',
        description: '',
        dosage: '',
        form: '',
        manufacturer: '',
        price: 0,
        quantity: 0,
      });
    } catch (err: unknown) {
      console.error(err);
      toast.error('Échec de l’ajout');
    }
  };

  const handleEditMedication = async () => {
    if (!selectedMedication) return;
    try {
      const res = await api.put<Medication>(
        `/medications/${selectedMedication.id}`,
        selectedMedication
      );
      setMedicationsList(prev =>
        prev.map(m => (m.id === res.data.id ? res.data : m))
      );
      toast.success('Médicament modifié');
      setShowEditModal(false);
    } catch {
      toast.error('Échec de la modification');
    }
  };
  

  const handleDeleteMedication = async (id: number) => {
    if (!confirm('Supprimer ce médicament ?')) return;
    try {
      await api.delete(`/medications/${id}`);
      setMedicationsList(prev => prev.filter(m => m.id !== id));
      toast.success('Médicament supprimé');
    } catch {
      toast.error('Échec de la suppression');
    }
  };
  

  // ── 4️⃣ Tri et Filtre ────────────────────────────────────────────────────
  const sortedMedications = [...medicationsList].sort((a, b) => {
    const aVal = String(a[sortField]);
    const bVal = String(b[sortField]);
    return sortDirection === 'asc'
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });
  const filteredMedications = sortedMedications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── 5️⃣ Gestion du chargement / erreur ──────────────────────────────────
  if (loading) return <div className="p-6 text-center">Chargement…</div>;
  if (error)   return <div className="p-6 text-red-600">{error}</div>;

  // ── 6️⃣ Modal de création / édition ─────────────────────────────────────
  const MedicationModal: React.FC<{
    isEdit?: boolean;
    onClose: () => void;
    onSave: () => void;
  }> = ({ isEdit = false, onClose, onSave }) => {
    const med = isEdit && selectedMedication
      ? selectedMedication
      : (newMedication as Medication);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-6">
            {isEdit ? 'Modifier le médicament' : 'Ajouter un médicament'}
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={med.name}
                onChange={e => {
                  const val = e.target.value;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, name: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, name: val }));
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {/* Dosage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input
                type="text"
                value={med.dosage}
                onChange={e => {
                  const val = e.target.value;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, dosage: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, dosage: val }));
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {/* Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Form</label>
              <select
                value={med.form}
                onChange={e => {
                  const val = e.target.value;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, form: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, form: val }));
                  }
                }}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={med.quantity}
                onChange={e => {
                  const val = parseInt(e.target.value, 10) || 0;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, quantity: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, quantity: val }));
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={med.price}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, price: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, price: val }));
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {/* Manufacturer */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                value={med.manufacturer}
                onChange={e => {
                  const val = e.target.value;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, manufacturer: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, manufacturer: val }));
                  }
                }}
                className="w-full p-2 border rounded-md"
              />
            </div>
            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={med.description}
                onChange={e => {
                  const val = e.target.value;
                  if (isEdit && selectedMedication) {
                    setSelectedMedication({ ...selectedMedication, description: val });
                  } else {
                    setNewMedication(prev => ({ ...prev, description: val }));
                  }
                }}
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

  // ── 7️⃣ Rendu principal ───────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Catalog Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medication
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name <ArrowUpDown className="h-4 w-4 ml-1" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('quantity')}
                >
                  Stock <ArrowUpDown className="h-4 w-4 ml-1" />
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  Price <ArrowUpDown className="h-4 w-4 ml-1" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map(med => (
                <tr key={med.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div className="text-sm font-medium text-gray-900">{med.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{med.dosage} • {med.form}</div>
                    <div className="text-sm text-gray-500">{med.manufacturer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      med.quantity > 50
                        ? 'bg-green-100 text-green-800'
                        : med.quantity > 20
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {med.quantity > 50
                        ? <CheckCircle className="h-4 w-4 mr-1" />
                        : med.quantity > 20
                        ? <AlertCircle className="h-4 w-4 mr-1" />
                        : <XCircle className="h-4 w-4 mr-1" />
                      }
                      {med.quantity} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {med.price.toFixed(2)}DH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedMedication(med);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMedication(med.id)}
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
      </div>

      {showAddModal && (
        <MedicationModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMedication}
        />
      )}
      {showEditModal && selectedMedication && (
        <MedicationModal
          isEdit
          onClose={() => {
            setShowEditModal(false);
            setSelectedMedication(null);
          }}
          onSave={handleEditMedication}
        />
      )}
    </div>
  );
};

export default AdminCatalog;
