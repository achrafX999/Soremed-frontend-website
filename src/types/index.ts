export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: string;
  quantity: number;
  manufacturer: string;
  price: number;
  description: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'in_progress' | 'completed' | 'canceled';
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  medicationId: string;
  quantity: number;
  price: number;
}

export type ChartData = {
  labels: string[];
  values: number[];
}