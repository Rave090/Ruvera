export type ProductCategory =
  | 'serum'
  | 'moisturizer'
  | 'cleanser'
  | 'sunscreen'
  | 'toner'
  | 'treatment'
  | 'eye-care'
  | 'mask'
  | 'other';

export interface ProductReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  date: string;
}

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
  badge?: string | null;
  volume?: string;
  skinType?: string;
  ingredients?: string;
  themeColor?: string;
  accentColor?: string;
  isFavourited: boolean;
  reviews?: ProductReview[];
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
