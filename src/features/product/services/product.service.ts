import { apiClient, apiRequest } from '@services/api/client';
import type { Result, PaginatedResponse } from '@services/api/types';
import type { Product, ProductListParams } from '../types';

export async function fetchProducts(
  params: ProductListParams = {},
): Promise<Result<PaginatedResponse<Product>>> {
  const { query, filters, page = 1, pageSize = 10 } = params;

  const queryParams: Record<string, string | number | boolean> = { page, pageSize };
  if (query) queryParams.query = query;
  if (filters?.category) queryParams.category = filters.category;
  if (filters?.minPrice !== undefined) queryParams.minPrice = filters.minPrice;
  if (filters?.maxPrice !== undefined) queryParams.maxPrice = filters.maxPrice;
  if (filters?.minRating !== undefined) queryParams.minRating = filters.minRating;
  if (filters?.inStockOnly !== undefined) queryParams.inStockOnly = filters.inStockOnly;

  return apiRequest(() =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params: queryParams }),
  );
}

export async function fetchProductById(id: string): Promise<Result<Product>> {
  return apiRequest(() => apiClient.get<Product>(`/products/${id}`));
}

export async function fetchTrendingProducts(): Promise<Result<Product[]>> {
  return apiRequest(() => apiClient.get<Product[]>('/products/trending'));
}

export async function fetchBestSellers(): Promise<Result<Product[]>> {
  return apiRequest(() => apiClient.get<Product[]>('/products/bestsellers'));
}
