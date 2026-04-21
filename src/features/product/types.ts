export type ProductCategory =
  | 'serum'
  | 'moisturizer'
  | 'cleanser'
  | 'sunscreen'
  | 'toner'
  | 'treatment'
  | 'eye-care'
  | 'mask';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  vendorId: string;
  description: string;
  isTrending: boolean;
  isDiscounted: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  tags: string[];
}

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
}

export interface ProductListParams {
  query?: string;
  filters?: ProductFilters;
  page?: number;
  pageSize?: number;
}
