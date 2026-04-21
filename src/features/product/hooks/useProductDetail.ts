import { useState, useEffect } from 'react';
import { fetchProductById } from '../services/product.service';
import type { Product } from '../types';

interface UseProductDetailResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

export function useProductDetail(productId: string): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchProductById(productId).then(result => {
      if (cancelled) return;
      if (result.success) {
        setProduct(result.data);
      } else {
        setError(result.error.message);
      }
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [productId]);

  return { product, isLoading, error };
}
