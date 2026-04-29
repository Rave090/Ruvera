import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../services/product.service';
import type { Product, ProductListParams, ProductFilters } from '../types';
import type { PaginatedResponse } from '@services/api/types';

interface UseProductListResult {
  products: Product[];
  total: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  refresh: () => void;
  loadMore: () => void;
}

export function useProductList(params: ProductListParams = {}): UseProductListResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = params.query;
  const category = params.filters?.category;
  const minPrice = params.filters?.minPrice;
  const maxPrice = params.filters?.maxPrice;
  const minRating = params.filters?.minRating;
  const inStockOnly = params.filters?.inStockOnly;

  const load = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
        setError(null);
      }

      const hasFilters =
        category !== undefined ||
        minPrice !== undefined ||
        maxPrice !== undefined ||
        minRating !== undefined ||
        inStockOnly !== undefined;

      const filters: ProductFilters | undefined = hasFilters
        ? { category, minPrice, maxPrice, minRating, inStockOnly }
        : undefined;

      const result = await fetchProducts({ query, filters, page: pageNum });

      if (result.success) {
        const res: PaginatedResponse<Product> = result.data;
        setProducts(prev => (append ? [...prev, ...res.data] : res.data));
        setTotal(res.total);
        setHasNextPage(res.hasNextPage);
        setPage(pageNum);
      } else {
        setError(result.error.message);
      }

      if (append) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    },
    [query, category, minPrice, maxPrice, minRating, inStockOnly],
  );

  useEffect(() => {
    void load(1, false);
  }, [load]);

  const refresh = useCallback(() => void load(1, false), [load]);
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasNextPage) {
      void load(page + 1, true);
    }
  }, [isLoadingMore, hasNextPage, load, page]);

  return { products, total, hasNextPage, isLoading, isLoadingMore, error, refresh, loadMore };
}
