// src/components/OrderForm.tsx
import { useState, useContext, useEffect } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Medication, OrderItem } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface OrderFormProps {
  onSuccess?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthContext non initialisé');
  const { user } = auth;

  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [selectedMedId, setSelectedMedId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(1);

  // 1. Charger tous les médicaments (grand pageSize)
  useEffect(() => {
    api
      .get<{ content: Medication[] }>('/medications', { params: { page: 0, size: 1000 } })
      .then(({ data }) => setMedications(data.content))
      .catch(() => toast.error('Impossible de charger les médicaments'));
  }, []);

  const handleAddItem = () => {
    if (selectedMedId === '' || quantity <= 0) return;
    const med = medications.find(m => m.id === selectedMedId);
    if (!med) return;

    setSelectedItems(items => {
      const exist = items.find(i => i.medicationId === selectedMedId);
      if (exist) {
        return items.map(i =>
          i.medicationId === selectedMedId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...items,
        {
          medicationId: med.id,
          medicationName: med.name,   // ← nouveau
          quantity,
          price:       med.price
        }
      ];
      
    });

    setSelectedMedId('');
    setQuantity(1);
  };

  const handleRemoveItem = (medicationId: number) => {
    setSelectedItems(items => items.filter(i => i.medicationId !== medicationId));
  };

  const handleQuantityChange = (medicationId: number, newQty: number) => {
    setSelectedItems(items =>
      items.map(i =>
        i.medicationId === medicationId
          ? { ...i, quantity: newQty }
          : i
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vous devez être connecté pour passer commande');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('Veuillez ajouter au moins un médicament');
      return;
    }
    try {
      // 2. Appel POST /api/orders?userId=...
      const res = await api.post(
        '/orders',
        selectedItems,
        { params: { userId: user.id } }
      );
      const created = res.data as { id: number };
      toast.success('Commande passée avec succès');
      // 3. Redirige vers /tracking/:orderId
      navigate(`/tracking/${created.id}`);
      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la création de la commande');
    }
  };

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection du médicament */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Médicament</label>
            <select
              value={selectedMedId}
              onChange={e => {
                const id = parseInt(e.target.value, 10);
                setSelectedMedId(isNaN(id) ? '' : id);
              }}
              className="w-full rounded-md border-gray-300"
            >
              <option value="">Choisissez...</option>
              {medications.map(med => (
                <option key={med.id} value={med.id}>
                  {med.name} – {med.quantity} en stock
                </option>
              ))}
            </select>
          </div>

          {/* Quantité */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantité</label>
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Diminuer quantité"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-2 bg-gray-100 rounded-l-md hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  setQuantity(isNaN(v) ? 1 : v);
                }}
                className="w-20 text-center border-y border-gray-300"
              />
              <button
                type="button"
                aria-label="Augmenter quantité"
                onClick={() => setQuantity(q => q + 1)}
                className="px-2 bg-gray-100 rounded-r-md hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bouton Ajouter */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Récapitulatif de la commande */}
        {selectedItems.length > 0 && (
          <>
            <table className="w-full mt-6 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Produit</th>
                  <th className="p-2 text-center">Quantité</th>
                  <th className="p-2 text-right">Prix</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(item => {
                  const med = medications.find(m => m.id === item.medicationId)!;
                  return (
                    <tr key={item.medicationId}>
                      <td className="p-2">{med.name}</td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e =>
                            handleQuantityChange(
                              item.medicationId,
                              Math.max(1, parseInt(e.target.value, 10) || 1)
                            )
                          }
                          className="w-16 text-center border rounded"
                        />
                      </td>
                      <td className="p-2 text-right">
                        {(item.price * item.quantity).toFixed(2)}DH
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          aria-label="Supprimer article"
                          onClick={() => handleRemoveItem(item.medicationId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <span className="font-medium">Total :</span>
              <span className="font-bold text-lg">
                {total.toFixed(2)}DH
              </span>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-md flex justify-center items-center hover:bg-green-700"
            >
              <ShoppingCart className="mr-2" /> Passer la commande
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default OrderForm;
