// src/components/OrderList.tsx
import React from 'react';
import { Package2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onStatusChange?: (orderId: number, status: Order['status']) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onStatusChange }) => {
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {orders.map(order => {
        // Calcul du total à partir des items
        const total = order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            {/* En-tête */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <Package2 className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Commande n°{order.id}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Passée le {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Liste des items */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Médicaments commandés:
              </h4>
              <div className="space-y-2">
              {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.medicationName} × {item.quantity}
                </span>
                <span className="font-medium">
                  {(item.price * item.quantity).toFixed(2)} DH
                </span>
              </div>
            ))}

              </div>
            </div>

            {/* Total calculé */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">Montant total:</span>
                <span className="text-lg font-bold text-green-600">
                  {total.toFixed(2)} DH
                </span>
              </div>
            </div>

            {/* Actions de statut */}
            {onStatusChange && order.status === 'in_progress' && (
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => onStatusChange(order.id, 'completed')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Mark as Completed
                </button>
                <button
                  onClick={() => onStatusChange(order.id, 'canceled')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderList;
