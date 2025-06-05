// src/types/notification.ts
export interface NotificationSettings {
  id: number;                   // toujours présent, vaut 1 en général
  lowStock: boolean;
  newOrder: boolean;
  orderStatusChange: boolean;
  newUser: boolean;
  systemUpdates: boolean;
  lowStockThreshold: number;    // champ numérique
  orderDelayThreshold: number;  // champ numérique
}
