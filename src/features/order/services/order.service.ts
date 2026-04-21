import type { Result } from '@services/api/types';
import type { Order, ShippingAddress } from '../types';
import type { CartItem } from '@features/cart/types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    status: 'shipped',
    items: [],
    totalAmount: 63.49,
    shippingAddress: {
      fullName: 'Test User',
      line1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    estimatedDelivery: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    trackingNumber: 'TRK123456789',
    trackingEvents: [
      {
        status: 'pending',
        description: 'Order placed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        isCompleted: true,
      },
      {
        status: 'confirmed',
        description: 'Order confirmed by vendor',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        isCompleted: true,
      },
      {
        status: 'shipped',
        description: 'Package picked up by courier',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        isCompleted: true,
      },
      {
        status: 'delivered',
        description: 'Out for delivery',
        timestamp: '',
        isCompleted: false,
      },
    ],
  },
];

export async function fetchOrders(): Promise<Result<Order[]>> {
  await delay(600);
  return { success: true, data: MOCK_ORDERS };
}

export async function fetchOrderById(id: string): Promise<Result<Order>> {
  await delay(400);
  const order = MOCK_ORDERS.find(o => o.id === id);
  if (!order) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: 'Order not found', statusCode: 404 },
    };
  }
  return { success: true, data: order };
}

export async function placeOrder(
  items: CartItem[],
  shippingAddress: ShippingAddress,
): Promise<Result<Order>> {
  await delay(800);
  const order: Order = {
    id: `o${Date.now()}`,
    status: 'pending',
    items: items.map(i => ({
      product: i.product,
      quantity: i.quantity,
      unitPrice: i.product.price,
    })),
    totalAmount: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    shippingAddress,
    createdAt: new Date().toISOString(),
    trackingEvents: [
      {
        status: 'pending',
        description: 'Order placed',
        timestamp: new Date().toISOString(),
        isCompleted: true,
      },
    ],
  };
  MOCK_ORDERS.unshift(order);
  return { success: true, data: order };
}
