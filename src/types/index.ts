// src/types/index.ts

export interface Medication {
  id: number;
  name: string;
  description: string;
  dosage?: string;
  form?: string;
  manufacturer?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number; // Changed from string to number to match backend
  orderDate: string;
  status: 'in_progress' | 'completed' | 'canceled';
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  medicationId: number;
  medicationName: string;  // ← ajouté
  quantity: number;
  price: number;           // prix unitaire
}

export type ChartData = {
  labels: string[];
  values: number[];
};
