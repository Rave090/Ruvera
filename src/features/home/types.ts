export interface Dermatologist {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string | null;
  isOnline: boolean;
  yearsExperience: number;
  consultationFee: number;
}

export interface HomeData {
  trendingProducts: import('@features/product/types').Product[];
  bestSellers: import('@features/product/types').Product[];
  dermatologists: Dermatologist[];
}
