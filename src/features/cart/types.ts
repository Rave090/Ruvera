import type { Product } from '@features/product/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}
