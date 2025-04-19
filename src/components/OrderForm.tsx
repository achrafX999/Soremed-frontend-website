import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { medications } from '../data/medications';
import { OrderItem } from '../types';

interface OrderFormProps {
  onSubmit: (items: OrderItem[]) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddItem = () => {
    if (!selectedMedId || quantity <= 0) return;

    const medication = medications.find(med => med.id === selectedMedId);
    if (!medication) return;

    const existingItem = selectedItems.find(item => item.medicationId === selectedMedId);
    if (existingItem) {
      setSelectedItems(items =>
        items.map(item =>
          item.medicationId === selectedMedId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setSelectedItems(items => [
        ...items,
        {
          medicationId: selectedMedId,
          quantity,
          price: medication.price
        }
      ]);
    }

    setSelectedMedId('');
    setQuantity(1);
  };

  const handleRemoveItem = (medicationId: string) => {
    setSelectedItems(items => items.filter(item => item.medicationId !== medicationId));
  };

  const handleQuantityChange = (medicationId: string, newQuantity: number) => {
    setSelectedItems(items =>
      items.map(item =>
        item.medicationId === medicationId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedItems);
    setSelectedItems([]);
  };

  const total = selectedItems.reduce((sum, item) => {
    const medication = medications.find(med => med.id === item.medicationId);
    return sum + (medication?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section de sélection du médicament et de la quantité */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Medication
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choose a medication</option>
              {medications.map(med => (
                <option key={med.id} value={med.id}>
                  {med.name} - ${med.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="p-2 bg-gray-100 rounded-l-md hover:bg-gray-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border-y border-gray-300"
              />
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="p-2 bg-gray-100 rounded-r-md hover:bg-gray-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAddItem}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add to Order
            </button>
          </div>
        </div>

        {/* Récapitulatif de la commande sous forme de tableau */}
        {selectedItems.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Product</th>
                  <th className="px-4 py-2 border">Quantity Wanted</th>
                  <th className="px-4 py-2 border">Quantity Delivered</th>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(item => {
                  const medication = medications.find(med => med.id === item.medicationId);
                  return (
                    <tr key={item.medicationId}>
                      <td className="px-4 py-2 border">{medication?.name}</td>
                      <td className="px-4 py-2 border">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.medicationId, Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {/* Pour une démonstration, la quantité livrée est initialisée à 0 */}
                        0
                      </td>
                      <td className="px-4 py-2 border">
                        ${((medication?.price || 0) * item.quantity).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.medicationId)}
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-6 flex justify-between items-center">
              <p className="text-lg font-medium">Total:</p>
              <p className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</p>
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Place Order
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderForm;
