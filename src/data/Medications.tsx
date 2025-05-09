// src/data/medications.ts
import { Medication } from '../types';

export const medications: Medication[] = [
  {
    id: 1,
    name: 'Paracétamol',
    // genericName: 'Acétaminophène',  <-- supprimé
    description: 'Antalgique et antipyrétique',
    dosage: '500 mg',
    form: 'Comprimé',
    manufacturer: 'Laboratoires XYZ',
    price: 10.0,
    quantity: 200,
  },
  {
    id: 2,
    name: 'Ibuprofène',
    // genericName: 'Ibuprofenum',      <-- supprimé
    description: 'Anti-inflammatoire non stéroïdien',
    dosage: '400 mg',
    form: 'Gélule',
    manufacturer: 'Pharma ABC',
    price: 12.5,
    quantity: 150,
  },
  // … autres médicaments
];
