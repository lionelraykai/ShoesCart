import { Shoe } from '@/types';

export const seedShoes: Shoe[] = [
  {
    id: 'seed_air_runner',
    brand: 'Nike',
    name: 'Air Runner 90',
    price: 129.99,
    sizes: [7, 8, 9, 10, 11],
    createdAt: Date.UTC(2026, 0, 1),
  },
  {
    id: 'seed_ultraboost',
    brand: 'Adidas',
    name: 'Ultraboost Light',
    price: 189.99,
    sizes: [6, 7, 8, 9, 10, 12],
    createdAt: Date.UTC(2026, 0, 2),
  },
  {
    id: 'seed_classic_leather',
    brand: 'Reebok',
    name: 'Classic Leather',
    price: 84.5,
    sizes: [8, 9, 10, 11],
    createdAt: Date.UTC(2026, 0, 3),
  },
  {
    id: 'seed_old_skool',
    brand: 'Vans',
    name: 'Old Skool',
    price: 64.99,
    sizes: [6, 7, 8, 9, 10, 11, 12],
    createdAt: Date.UTC(2026, 0, 4),
  },
  {
    id: 'seed_574',
    brand: 'New Balance',
    name: '574 Core',
    price: 94.99,
    sizes: [7, 8, 9, 11, 13],
    createdAt: Date.UTC(2026, 0, 5),
  },
];
