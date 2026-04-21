import { useState, useEffect } from 'react';
import { fetchOrderById } from '../services/order.service';
import type { Order } from '../types';

interface UseOrderDetailResult {
  order: Order | null;
  isLoading: boolean;
  error: string | null;
}

export function useOrderDetail(orderId: string): UseOrderDetailResult {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchOrderById(orderId).then(result => {
      if (cancelled) return;
      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error.message);
      }
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [orderId]);

  return { order, isLoading, error };
}
