import { apiClient, apiRequest } from '@services/api/client';
import type { Result } from '@services/api/types';
import type {
  HomeData,
  HomeProductItem,
  SkinAnalysisSummary,
  TodaysRoutine,
  Dermatologist,
  PromoBanner,
  ApiProductsResponse,
  ApiDermatologistsResponse,
  ApiBannersResponse,
  ApiNotificationCountResponse,
  ApiRoutineResponse,
} from '../types';
import {
  writeHomeProducts,
  writeCachedAnalysis,
  writeCachedRoutine,
  writeCachedDermatologists,
  writeCachedBanners,
  writeCachedNotificationCount,
  readCachedRoutine,
  writeLastFetchTimestamp,
} from './home.repository';

// ── Individual fetchers ───────────────────────────────────────────────────

async function fetchTrendingProducts(): Promise<HomeProductItem[]> {
  const result = await apiRequest(() =>
    apiClient.get<ApiProductsResponse>('/products/trending?page=1&pageSize=6'),
  );
  if (!result.success) return [];
  const products = result.data.data;
  await writeHomeProducts('trending', products);
  return products;
}

async function fetchBestSellers(): Promise<HomeProductItem[]> {
  const result = await apiRequest(() =>
    apiClient.get<ApiProductsResponse>('/products/best-sellers?page=1&pageSize=6'),
  );
  if (!result.success) return [];
  const products = result.data.data;
  await writeHomeProducts('best_sellers', products);
  return products;
}

async function fetchLatestAnalysis(): Promise<SkinAnalysisSummary | null> {
  const result = await apiRequest(() =>
    apiClient.get<SkinAnalysisSummary>('/skin-analysis/latest'),
  );
  if (!result.success) return null;
  // 204 — axios resolves with empty data; guard against it
  if (!result.data || !result.data.id) return null;
  await writeCachedAnalysis(result.data);
  return result.data;
}

async function fetchTodaysRoutine(analysisId: string): Promise<TodaysRoutine | null> {
  const cached = await readCachedRoutine(analysisId);
  if (cached) return cached;

  const result = await apiRequest(() =>
    apiClient.get<ApiRoutineResponse>('/skin-analysis/latest/routine'),
  );
  if (!result.success) return null;
  if (!result.data || !result.data.analysisId) return null;

  const routine: TodaysRoutine = result.data;
  await writeCachedRoutine(routine);
  return routine;
}

async function fetchFeaturedDermatologists(): Promise<Dermatologist[]> {
  const result = await apiRequest(() =>
    apiClient.get<ApiDermatologistsResponse>('/home/dermatologists?limit=3'),
  );
  if (!result.success) return [];
  const derms = result.data.data;
  await writeCachedDermatologists(derms);
  return derms;
}

async function fetchNotificationCount(): Promise<number> {
  const result = await apiRequest(() =>
    apiClient.get<ApiNotificationCountResponse>('/notifications/unread-count'),
  );
  if (!result.success) return 0;
  const count = result.data.count;
  await writeCachedNotificationCount(count);
  return count;
}

async function fetchBanners(): Promise<PromoBanner[]> {
  const result = await apiRequest(() =>
    apiClient.get<ApiBannersResponse>('/home/banners'),
  );
  if (!result.success) return [];
  const banners = result.data.data;
  await writeCachedBanners(banners);
  return banners;
}

// ── Orchestrator ──────────────────────────────────────────────────────────

export async function refreshHomeData(): Promise<Result<HomeData>> {
  try {
    const [trendingProducts, bestSellers, dermatologists, analysis, notificationCount, banners] =
      await Promise.all([
        fetchTrendingProducts(),
        fetchBestSellers(),
        fetchFeaturedDermatologists(),
        fetchLatestAnalysis(),
        fetchNotificationCount(),
        fetchBanners(),
      ]);

    // Routine fetched sequentially — depends on analysis ID, and uses cache when possible
    const routine =
      analysis !== null ? await fetchTodaysRoutine(analysis.id) : null;

    await writeLastFetchTimestamp();

    return {
      success: true,
      data: {
        trendingProducts,
        bestSellers,
        dermatologists,
        analysis,
        routine,
        notificationCount,
        banners,
      },
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'HOME_REFRESH_FAILED',
        message: 'Failed to refresh home data.',
        statusCode: 0,
      },
    };
  }
}
