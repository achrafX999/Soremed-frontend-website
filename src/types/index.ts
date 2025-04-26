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
  date: string;
  status: 'in_progress' | 'completed' | 'canceled';
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  medicationId: number; // Changed from string to number to match backend IDs
  quantity: number;
  price: number;
}

export type ChartData = {
  labels: string[];
  values: number[];
};
