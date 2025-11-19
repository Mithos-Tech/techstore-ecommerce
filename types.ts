// Fix: Add React import to resolve 'Cannot find namespace' error.
import React from 'react';

export interface Product {
  id: string; // Changed to string for Firestore compatibility
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  imageUrl: string;
  description?: string;
  inStock?: boolean;
  rating?: number;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
}

export interface TrustBadge {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle: string;
}

export interface OrderProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

export interface Order {
  id?: string; // Firestore document ID
  orderId: string;
  products: OrderProduct[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    method: 'delivery' | 'pickup';
    address?: string;
    district?: string;
    reference?: string;
  };
  payment: {
    method: 'contra-entrega' | 'transferencia';
    amount: number;
  };
  status: 'pendiente' | 'en proceso' | 'enviado' | 'cancelado';
  date: any; // Firestore Timestamp
  total: number;
}
