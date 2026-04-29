import type { Result, PaginatedResponse } from '@services/api/types';
import type { Product, ProductListParams, ProductReview } from '../types';

const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

const MOCK_REVIEWS: Record<string, ProductReview[]> = {
  p1: [
    { id: 'r1a', authorName: 'Priya S.', rating: 5, text: 'Absolutely love this! My skin feels so much more hydrated within a week.', date: 'Apr 2026' },
    { id: 'r1b', authorName: 'Ritika M.', rating: 5, text: 'Lightweight and absorbs instantly. No sticky feeling at all.', date: 'Mar 2026' },
    { id: 'r1c', authorName: 'Ananya K.', rating: 4, text: 'Good product but a bit pricey. Results are visible though!', date: 'Mar 2026' },
  ],
  p2: [
    { id: 'r2a', authorName: 'Meera V.', rating: 5, text: 'My pores have visibly shrunk after 2 weeks. Highly recommend!', date: 'Apr 2026' },
    { id: 'r2b', authorName: 'Kavya R.', rating: 4, text: 'Gentle enough for daily use. Skin feels smooth and bright.', date: 'Mar 2026' },
  ],
  p3: [
    { id: 'r3a', authorName: 'Sneha P.', rating: 5, text: 'Best moisturiser for dry skin. My skin barrier feels completely restored.', date: 'Apr 2026' },
    { id: 'r3b', authorName: 'Divya T.', rating: 5, text: 'Rich but not heavy. Absorbed overnight and I woke up with glowing skin.', date: 'Mar 2026' },
    { id: 'r3c', authorName: 'Nisha C.', rating: 5, text: 'Worth every rupee. My sensitive skin loves this.', date: 'Feb 2026' },
  ],
  p4: [
    { id: 'r4a', authorName: 'Pooja N.', rating: 5, text: 'Fades dark spots noticeably within 3 weeks. Skin glows!', date: 'Apr 2026' },
    { id: 'r4b', authorName: 'Aisha K.', rating: 4, text: 'Good formula, stable Vitamin C. No irritation on sensitive skin.', date: 'Mar 2026' },
  ],
  p5: [
    { id: 'r5a', authorName: 'Sana M.', rating: 5, text: 'No white cast, no greasiness. Perfect under makeup!', date: 'Apr 2026' },
    { id: 'r5b', authorName: 'Lakshmi A.', rating: 5, text: 'Lightweight and non-comedogenic. My holy grail sunscreen.', date: 'Mar 2026' },
    { id: 'r5c', authorName: 'Tara B.', rating: 4, text: 'Great SPF protection. Slightly pricey but worth it.', date: 'Feb 2026' },
  ],
  p6: [
    { id: 'r6a', authorName: 'Radha S.', rating: 5, text: 'Encapsulated formula means zero irritation. Fine lines are fading!', date: 'Apr 2026' },
    { id: 'r6b', authorName: 'Poonam G.', rating: 4, text: 'Start once a week as instructed. Results in 4 weeks are impressive.', date: 'Mar 2026' },
  ],
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Hydra Veil Serum',
    brand: 'Glow Lab',
    category: 'serum',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 312,
    imageUrl: 'https://picsum.photos/seed/p1/400/400',
    vendorId: 'v1',
    description:
      'A weightless hyaluronic acid serum that delivers deep hydration and plumps skin instantly. Formulated for combination and dry skin types, this serum penetrates three layers of the epidermis to lock in moisture all day.',
    isTrending: true,
    isDiscounted: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Hydrating', 'Fragrance-free'],
    badge: 'Matched',
    volume: '30ml',
    skinType: 'Combination · Dry',
    ingredients: 'Aqua, Sodium Hyaluronate, Niacinamide, Glycerin, Panthenol, Allantoin',
    themeColor: '#dce8f0',
    accentColor: '#4a9aba',
    reviews: MOCK_REVIEWS.p1,
  },
  {
    id: 'p2',
    name: 'Pore Refine Toner',
    brand: 'Lumière',
    category: 'toner',
    price: 649,
    originalPrice: 899,
    rating: 4.6,
    reviewCount: 198,
    imageUrl: 'https://picsum.photos/seed/p2/400/400',
    vendorId: 'v1',
    description:
      'A gentle exfoliating toner with 5% AHA + 1% BHA that minimises pores, evens texture and brightens skin overnight. Witch hazel soothes while aloe vera calms post-exfoliation redness.',
    isTrending: true,
    isDiscounted: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Pore-care', 'AHA/BHA'],
    badge: 'Bestseller',
    volume: '150ml',
    skinType: 'Oily · Combination',
    ingredients: 'Aqua, Glycolic Acid, Salicylic Acid, Witch Hazel, Aloe Vera, Niacinamide',
    themeColor: '#f0e8dc',
    accentColor: '#b07840',
    reviews: MOCK_REVIEWS.p2,
  },
  {
    id: 'p3',
    name: 'Ceramide Repair Cream',
    brand: 'Dermasoft',
    category: 'moisturizer',
    price: 1199,
    originalPrice: 1599,
    rating: 4.9,
    reviewCount: 541,
    imageUrl: 'https://picsum.photos/seed/p3/400/400',
    vendorId: 'v2',
    description:
      "A rich barrier-repairing cream with ceramides, cholesterol and fatty acids. Restores the skin's natural lipid barrier and soothes sensitivity. Ideal for dry, sensitive, and eczema-prone skin.",
    isTrending: false,
    isDiscounted: true,
    isBestSeller: true,
    inStock: true,
    tags: ['Barrier repair', 'Rich'],
    badge: 'Top Rated',
    volume: '50ml',
    skinType: 'Dry · Sensitive',
    ingredients:
      'Aqua, Ceramide NP, Ceramide AP, Cholesterol, Niacinamide, Shea Butter, Tocopherol',
    themeColor: '#e8f0dc',
    accentColor: '#5a8a5a',
    reviews: MOCK_REVIEWS.p3,
  },
  {
    id: 'p4',
    name: 'Vitamin C Glow Drops',
    brand: 'Glow Lab',
    category: 'serum',
    price: 1099,
    originalPrice: 1499,
    rating: 4.7,
    reviewCount: 276,
    imageUrl: 'https://picsum.photos/seed/p4/400/400',
    vendorId: 'v1',
    description:
      'Stabilised 15% Vitamin C with ferulic acid and Vitamin E. Fades dark spots, boosts radiance and defends against environmental damage. Best applied in the morning before SPF.',
    isTrending: true,
    isDiscounted: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Brightening', 'Antioxidant'],
    badge: 'Matched',
    volume: '30ml',
    skinType: 'All types',
    ingredients:
      'Aqua, Ascorbic Acid, Ferulic Acid, Tocopherol, Sodium Hyaluronate, Niacinamide',
    themeColor: '#fdf0d8',
    accentColor: '#c4a035',
    reviews: MOCK_REVIEWS.p4,
  },
  {
    id: 'p5',
    name: 'SPF 50+ Fluid',
    brand: 'Shield',
    category: 'sunscreen',
    price: 749,
    originalPrice: 999,
    rating: 4.8,
    reviewCount: 423,
    imageUrl: 'https://picsum.photos/seed/p5/400/400',
    vendorId: 'v2',
    description:
      'An invisible, non-greasy SPF 50+ fluid that protects against UVA, UVB and blue light. Wears perfectly under makeup with no white cast or greasy residue.',
    isTrending: true,
    isDiscounted: true,
    isBestSeller: true,
    inStock: true,
    tags: ['SPF50+', 'Lightweight'],
    badge: 'Essential',
    volume: '50ml',
    skinType: 'All types',
    ingredients: 'Aqua, Uvinul A Plus, Tinosorb S, Zinc Oxide, Glycerin, Dimethicone',
    themeColor: '#f0eaf8',
    accentColor: '#7a5aaa',
    reviews: MOCK_REVIEWS.p5,
  },
  {
    id: 'p6',
    name: 'Retinol Night Serum',
    brand: 'ReneCell',
    category: 'serum',
    price: 1399,
    originalPrice: 1899,
    rating: 4.5,
    reviewCount: 167,
    imageUrl: 'https://picsum.photos/seed/p6/400/400',
    vendorId: 'v1',
    description:
      '0.3% encapsulated retinol with peptides and bakuchiol for visible line reduction without irritation. Start once weekly and build up. Avoid use with AHA/BHA on the same night.',
    isTrending: false,
    isDiscounted: true,
    isBestSeller: false,
    inStock: true,
    tags: ['Anti-aging', 'Night use'],
    badge: 'Expert Pick',
    volume: '30ml',
    skinType: 'Normal · Combination',
    ingredients: 'Aqua, Retinol, Bakuchiol, Matrixyl 3000, Sodium Hyaluronate, Squalane',
    themeColor: '#f8e8e0',
    accentColor: '#9b2d4f',
    reviews: MOCK_REVIEWS.p6,
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
        p.tags.some(t => t.toLowerCase().includes(q)),
    );
  }

  if (filters?.category) {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters?.minPrice !== undefined) {
    results = results.filter(p => p.price >= (filters.minPrice as number));
  }
  if (filters?.maxPrice !== undefined) {
    results = results.filter(p => p.price <= (filters.maxPrice as number));
  }
  if (filters?.minRating !== undefined) {
    results = results.filter(p => p.rating >= (filters.minRating as number));
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

export async function fetchProductById(id: string): Promise<Result<Product>> {
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
  return { success: true, data: MOCK_PRODUCTS.filter(p => p.isTrending) };
}

export async function fetchBestSellers(): Promise<Result<Product[]>> {
  await delay(500);
  return { success: true, data: MOCK_PRODUCTS.filter(p => p.isBestSeller) };
}
