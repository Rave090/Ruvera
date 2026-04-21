import type { Product } from '@features/product/types';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TrackingEvent {
  status: OrderStatus;
  description: string;
  timestamp: string;
  isCompleted: boolean;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingEvents: TrackingEvent[];
}
