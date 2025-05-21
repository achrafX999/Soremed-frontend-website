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
import MedicationModal from '../../components/MedicationModal';
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
          '/medications/search',              // ← ici
          {
            params: {
              name       : searchTerm,        // paramètre “name” côté back
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
  const filteredMedications = sortedMedications.filter(med => {
    const nm = med.name ?? '';                  // si name est undefined, on met ''
    return nm.toLowerCase().includes(
      searchTerm.toLowerCase()
    );
  });

  // ── 5️⃣ Gestion du chargement / erreur ──────────────────────────────────
  if (loading) return <div className="p-6 text-center">Chargement…</div>;
  if (error)   return <div className="p-6 text-red-600">{error}</div>;

  // ── 6️⃣ Rendu principal ───────────────────────────────────────────────────
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
                    {(med.price ?? 0).toFixed(2)}DH
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
          medication={{ id: 0, ...newMedication }}
          onChange={(med: Medication) => {
            setNewMedication({
              name: med.name,
              description: med.description,
              dosage: med.dosage,
              form: med.form,
              manufacturer: med.manufacturer,
              price: med.price,
              quantity: med.quantity,
            });
          }}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddMedication}
        />
      )}
      {showEditModal && selectedMedication && (
        <MedicationModal
          isEdit
          medication={selectedMedication}
          onChange={(med: Medication) => setSelectedMedication(med)}
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
