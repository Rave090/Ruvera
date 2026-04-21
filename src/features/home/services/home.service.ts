import type { Result } from '@services/api/types';
import type { Dermatologist, HomeData } from '../types';
import { fetchTrendingProducts, fetchBestSellers } from '@features/product/services/product.service';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_DERMATOLOGISTS: Dermatologist[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Chen',
    specialization: 'Medical Dermatology',
    rating: 4.9,
    reviewCount: 234,
    avatarUrl: 'https://picsum.photos/seed/d1/200/200',
    isOnline: true,
    yearsExperience: 12,
    consultationFee: 45,
  },
  {
    id: 'd2',
    name: 'Dr. Marcus Okafor',
    specialization: 'Cosmetic Dermatology',
    rating: 4.7,
    reviewCount: 189,
    avatarUrl: 'https://picsum.photos/seed/d2/200/200',
    isOnline: false,
    yearsExperience: 8,
    consultationFee: 55,
  },
  {
    id: 'd3',
    name: 'Dr. Priya Nair',
    specialization: 'Pediatric Dermatology',
    rating: 4.8,
    reviewCount: 312,
    avatarUrl: 'https://picsum.photos/seed/d3/200/200',
    isOnline: true,
    yearsExperience: 15,
    consultationFee: 50,
  },
];

export async function fetchDermatologists(): Promise<Result<Dermatologist[]>> {
  await delay(500);
  return { success: true, data: MOCK_DERMATOLOGISTS };
}

export async function fetchHomeData(): Promise<Result<HomeData>> {
  const [trending, bestSellers, derms] = await Promise.all([
    fetchTrendingProducts(),
    fetchBestSellers(),
    fetchDermatologists(),
  ]);

  if (!trending.success) return trending;
  if (!bestSellers.success) return bestSellers;
  if (!derms.success) return derms;

  return {
    success: true,
    data: {
      trendingProducts: trending.data,
      bestSellers: bestSellers.data,
      dermatologists: derms.data,
    },
  };
}
