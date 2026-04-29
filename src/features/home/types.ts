export interface HomeProductItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badges: string[];
  inStock: boolean;
  isFavourited: boolean;
}

export interface SkinAnalysisSummary {
  id: string;
  analysedAt: string;
  hydrationScore: number;
  hydrationLabel: string;
  overallHealthScore: number;
  skinType: string;
  concerns: string[];
  hasActiveAnalysis: true;
}

export interface RoutineStep {
  order: number;
  productCategory: string;
  instruction: string;
  productName: string | null;
  productId: string | null;
}

export interface TodaysRoutine {
  analysisId: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  generatedAt: string;
}

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
  currency: string;
}

export interface PromoBanner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaRoute: string;
  expiresAt: string;
}

export interface HomeData {
  trendingProducts: HomeProductItem[];
  bestSellers: HomeProductItem[];
  dermatologists: Dermatologist[];
  analysis: SkinAnalysisSummary | null;
  routine: TodaysRoutine | null;
  notificationCount: number;
  banners: PromoBanner[];
}

// API response envelope types
export interface ApiProductsResponse {
  data: HomeProductItem[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiDermatologistsResponse {
  data: Dermatologist[];
}

export interface ApiBannersResponse {
  data: PromoBanner[];
}

export interface ApiNotificationCountResponse {
  count: number;
}

export interface ApiRoutineResponse {
  analysisId: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  generatedAt: string;
}
