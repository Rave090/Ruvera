import type { Result, PaginatedResponse } from '@services/api/types';
import type { Product, ProductListParams } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Hydra-Boost Serum',
    brand: 'GlowLab',
    category: 'serum',
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.8,
    reviewCount: 312,
    imageUrl: 'https://picsum.photos/seed/p1/400/400',
    vendorId: 'v1',
    description: 'Lightweight hyaluronic acid serum for deep hydration.',
    isTrending: true,
    isDiscounted: true,
    isBestSeller: true,
    inStock: true,
    tags: ['hydrating', 'hyaluronic acid', 'lightweight'],
  },
  {
    id: 'p2',
    name: 'Vitamin C Brightening Cream',
    brand: 'Lumière',
    category: 'moisturizer',
    price: 28.0,
    rating: 4.6,
    reviewCount: 205,
    imageUrl: 'https://picsum.photos/seed/p2/400/400',
    vendorId: 'v1',
    description: 'Daily moisturizer enriched with 10% Vitamin C.',
    isTrending: true,
    isDiscounted: false,
    isBestSeller: false,
    inStock: true,
    tags: ['brightening', 'vitamin c', 'antioxidant'],
  },
  {
    id: 'p3',
    name: 'Gentle Foam Cleanser',
    brand: 'PureRise',
    category: 'cleanser',
    price: 18.5,
    originalPrice: 22.0,
    rating: 4.7,
    reviewCount: 489,
    imageUrl: 'https://picsum.photos/seed/p3/400/400',
    vendorId: 'v2',
    description: 'pH-balanced foam cleanser for all skin types.',
    isTrending: false,
    isDiscounted: true,
    isBestSeller: true,
    inStock: true,
    tags: ['gentle', 'foam', 'all skin types'],
  },
  {
    id: 'p4',
    name: 'SPF 50 Sunscreen Fluid',
    brand: 'ShieldSkin',
    category: 'sunscreen',
    price: 22.99,
    rating: 4.9,
    reviewCount: 678,
    imageUrl: 'https://picsum.photos/seed/p4/400/400',
    vendorId: 'v2',
    description: 'Invisible fluid sunscreen with broad spectrum SPF 50.',
    isTrending: true,
    isDiscounted: false,
    isBestSeller: true,
    inStock: true,
    tags: ['spf', 'sun protection', 'invisible'],
  },
  {
    id: 'p5',
    name: 'Retinol Night Treatment',
    brand: 'GlowLab',
    category: 'treatment',
    price: 49.0,
    originalPrice: 59.0,
    rating: 4.5,
    reviewCount: 143,
    imageUrl: 'https://picsum.photos/seed/p5/400/400',
    vendorId: 'v1',
    description: '0.3% retinol night treatment for fine lines and texture.',
    isTrending: false,
    isDiscounted: true,
    isBestSeller: false,
    inStock: true,
    tags: ['retinol', 'anti-aging', 'night'],
  },
  {
    id: 'p6',
    name: 'Niacinamide 10% Toner',
    brand: 'Lumière',
    category: 'toner',
    price: 16.99,
    rating: 4.7,
    reviewCount: 356,
    imageUrl: 'https://picsum.photos/seed/p6/400/400',
    vendorId: 'v1',
    description: 'Pore-minimising toner with 10% niacinamide and 1% zinc.',
    isTrending: true,
    isDiscounted: false,
    isBestSeller: true,
    inStock: true,
    tags: ['niacinamide', 'pores', 'brightening'],
  },
];

export async function fetchProducts(
  params: ProductListParams = {},
): Promise<Result<PaginatedResponse<Product>>> {
  await delay(600);
  const { query, filters, page = 1, pageSize = 10 } = params;

  let results = [...MOCK_PRODUCTS];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)),
    );
  }

  if (filters?.category) {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter(p => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter(p => p.price <= filters.maxPrice!);
  }
  if (filters?.minRating !== undefined) {
    results = results.filter(p => p.rating >= filters.minRating!);
  }
  if (filters?.inStockOnly) {
    results = results.filter(p => p.inStock);
  }

  const start = (page - 1) * pageSize;
  const paginated = results.slice(start, start + pageSize);

  return {
    success: true,
    data: {
      data: paginated,
      total: results.length,
      page,
      pageSize,
      hasNextPage: start + pageSize < results.length,
    },
  };
}

export async function fetchProductById(
  id: string,
): Promise<Result<Product>> {
  await delay(400);
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  if (!product) {
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: 'Product not found', statusCode: 404 },
    };
  }
  return { success: true, data: product };
}

export async function fetchTrendingProducts(): Promise<Result<Product[]>> {
  await delay(500);
  return {
    success: true,
    data: MOCK_PRODUCTS.filter(p => p.isTrending),
  };
}

export async function fetchBestSellers(): Promise<Result<Product[]>> {
  await delay(500);
  return {
    success: true,
    data: MOCK_PRODUCTS.filter(p => p.isBestSeller),
  };
}
