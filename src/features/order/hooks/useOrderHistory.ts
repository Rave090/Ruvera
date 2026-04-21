import { useState, useEffect, useCallback } from 'react';
import { fetchOrders } from '../services/order.service';
import type { Order } from '../types';

interface UseOrderHistoryResult {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useOrderHistory(): UseOrderHistoryResult {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchOrders();
    if (result.success) {
      setOrders(result.data);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { orders, isLoading, error, refresh: load };
}
