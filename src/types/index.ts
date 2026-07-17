import type { ImageSourcePropType } from 'react-native';

export type Role = 'user' | 'admin';

export interface Shoe {
  id: string;
  brand: string;
  name: string;
  price: number;
  sizes: number[];
  image?: ImageSourcePropType;
  createdAt: number;
}

export interface CartItem {
  id: string;
  shoeId: string;
  size: number;
  quantity: number;
}

export interface OrderItem {
  shoeId: string;
  brand: string;
  name: string;
  price: number;
  size: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  placedAt: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}
