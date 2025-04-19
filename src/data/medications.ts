import { Medication } from '../types';

export const medications: Medication[] = [
  {
    id: "med1",
    name: "Amoxicillin",
    dosage: "500mg",
    form: "Capsule",
    quantity: 100,
    manufacturer: "PharmaCorp",
    price: 15.99,
    description: "Antibiotic used to treat bacterial infections"
  },
  {
    id: "med2",
    name: "Lisinopril",
    dosage: "10mg",
    form: "Tablet",
    quantity: 75,
    manufacturer: "HealthPharm",
    price: 12.50,
    description: "ACE inhibitor for treating high blood pressure"
  },
  // Add more medications to reach 25 items...
];