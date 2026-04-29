import { Q } from '@nozbe/watermelondb';
import { database } from '@db/index';
import { HomeProduct } from '@db/models/HomeProduct';
import { SkinAnalysisCache } from '@db/models/SkinAnalysisCache';
import { RoutineStep as RoutineStepModel } from '@db/models/RoutineStep';
import { HomeDermatologist } from '@db/models/HomeDermatologist';
import { Banner } from '@db/models/Banner';
import { HomeMeta } from '@db/models/HomeMeta';
import type {
  HomeProductItem,
  SkinAnalysisSummary,
  TodaysRoutine,
  Dermatologist,
  PromoBanner,
  RoutineStep,
} from '../types';

const HOME_DATA_TTL = 10 * 60 * 1000;
const ROUTINE_TTL = 60 * 60 * 1000;
const META_KEY_LAST_FETCH = 'last_home_fetch_at';
const META_KEY_NOTIF_COUNT = 'notif_unread_count';

// ── Staleness ─────────────────────────────────────────────────────────────

export async function isHomeDataStale(): Promise<boolean> {
  const records = await database
    .get<HomeMeta>('home_meta')
    .query(Q.where('meta_key', META_KEY_LAST_FETCH))
    .fetch();
  if (records.length === 0) return true;
  return Date.now() - (records[0].valueNum ?? 0) > HOME_DATA_TTL;
}

async function writeMeta(key: string, value: number | string): Promise<void> {
  await database.write(async () => {
    const existing = await database
      .get<HomeMeta>('home_meta')
      .query(Q.where('meta_key', key))
      .fetch();

    if (existing.length > 0) {
      await existing[0].update((r) => {
        if (typeof value === 'number') r.valueNum = value;
        else r.valueStr = value;
        r.cachedAt = Date.now();
      });
    } else {
      await database.get<HomeMeta>('home_meta').create((r) => {
        r.metaKey = key;
        if (typeof value === 'number') r.valueNum = value;
        else r.valueStr = value;
        r.cachedAt = Date.now();
      });
    }
  });
}

export async function writeLastFetchTimestamp(): Promise<void> {
  await writeMeta(META_KEY_LAST_FETCH, Date.now());
}

// ── Products ──────────────────────────────────────────────────────────────

export async function readHomeProducts(
  listType: 'trending' | 'best_sellers',
): Promise<HomeProductItem[]> {
  const records = await database
    .get<HomeProduct>('home_products')
    .query(Q.where('list_type', listType))
    .fetch();
  return records.map((r) => ({
    id: r.serverId,
    name: r.name,
    brand: r.brand,
    category: r.category,
    price: r.price,
    currency: r.currency,
    rating: r.rating,
    reviewCount: r.reviewCount,
    imageUrl: r.imageUrl,
    badges: JSON.parse(r.badgesJson) as string[],
    inStock: r.inStock,
    isFavourited: r.isFavourited,
  }));
}

export async function writeHomeProducts(
  listType: 'trending' | 'best_sellers',
  products: HomeProductItem[],
): Promise<void> {
  await database.write(async () => {
    const existing = await database
      .get<HomeProduct>('home_products')
      .query(Q.where('list_type', listType))
      .fetch();

    const deletes = existing.map((r) => r.prepareDestroyPermanently());
    const now = Date.now();
    const inserts = products.map((p) =>
      database.get<HomeProduct>('home_products').prepareCreate((r) => {
        r.serverId = p.id;
        r.listType = listType;
        r.name = p.name;
        r.brand = p.brand;
        r.category = p.category;
        r.price = p.price;
        r.currency = p.currency;
        r.rating = p.rating;
        r.reviewCount = p.reviewCount;
        r.imageUrl = p.imageUrl;
        r.badgesJson = JSON.stringify(p.badges);
        r.inStock = p.inStock;
        r.isFavourited = p.isFavourited;
        r.cachedAt = now;
      }),
    );

    await database.batch(...deletes, ...inserts);
  });
}

// ── Skin analysis ─────────────────────────────────────────────────────────

export async function readCachedAnalysis(): Promise<SkinAnalysisSummary | null> {
  const records = await database
    .get<SkinAnalysisCache>('skin_analysis_cache')
    .query()
    .fetch();
  if (records.length === 0) return null;
  const r = records[0];
  return {
    id: r.serverId,
    analysedAt: new Date(r.analysedAt).toISOString(),
    hydrationScore: r.hydrationScore,
    hydrationLabel: r.hydrationLabel,
    overallHealthScore: r.overallHealthScore,
    skinType: r.skinType,
    concerns: JSON.parse(r.concernsJson) as string[],
    hasActiveAnalysis: true,
  };
}

export async function writeCachedAnalysis(analysis: SkinAnalysisSummary): Promise<void> {
  await database.write(async () => {
    const existing = await database
      .get<SkinAnalysisCache>('skin_analysis_cache')
      .query()
      .fetch();

    const deletes = existing.map((r) => r.prepareDestroyPermanently());
    const insert = database
      .get<SkinAnalysisCache>('skin_analysis_cache')
      .prepareCreate((r) => {
        r.serverId = analysis.id;
        r.hydrationScore = analysis.hydrationScore;
        r.hydrationLabel = analysis.hydrationLabel;
        r.overallHealthScore = analysis.overallHealthScore;
        r.skinType = analysis.skinType;
        r.concernsJson = JSON.stringify(analysis.concerns);
        r.hasActiveAnalysis = true;
        r.analysedAt = new Date(analysis.analysedAt).getTime();
        r.cachedAt = Date.now();
      });

    await database.batch(...deletes, insert);
  });
}

// ── Routine ───────────────────────────────────────────────────────────────

export async function readCachedRoutine(analysisId: string): Promise<TodaysRoutine | null> {
  const records = await database
    .get<RoutineStepModel>('routine_steps')
    .query(Q.where('analysis_id', analysisId))
    .fetch();

  if (records.length === 0) return null;
  if (Date.now() - records[0].cachedAt > ROUTINE_TTL) return null;

  const toStep = (r: RoutineStepModel): RoutineStep => ({
    order: r.stepOrder,
    productCategory: r.productCategory,
    instruction: r.instruction,
    productName: r.productName ?? null,
    productId: r.productId ?? null,
  });

  return {
    analysisId,
    morning: records
      .filter((r) => r.timeOfDay === 'morning')
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map(toStep),
    evening: records
      .filter((r) => r.timeOfDay === 'evening')
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map(toStep),
    generatedAt: new Date(records[0].generatedAt).toISOString(),
  };
}

export async function writeCachedRoutine(routine: TodaysRoutine): Promise<void> {
  await database.write(async () => {
    const existing = await database
      .get<RoutineStepModel>('routine_steps')
      .query(Q.where('analysis_id', routine.analysisId))
      .fetch();

    const deletes = existing.map((r) => r.prepareDestroyPermanently());
    const now = Date.now();
    const generatedAt = new Date(routine.generatedAt).getTime();

    const allSteps = [
      ...routine.morning.map((s) => ({ ...s, timeOfDay: 'morning' as const })),
      ...routine.evening.map((s) => ({ ...s, timeOfDay: 'evening' as const })),
    ];

    const inserts = allSteps.map((s) =>
      database.get<RoutineStepModel>('routine_steps').prepareCreate((r) => {
        r.analysisId = routine.analysisId;
        r.timeOfDay = s.timeOfDay;
        r.stepOrder = s.order;
        r.productCategory = s.productCategory;
        r.instruction = s.instruction;
        r.productName = s.productName ?? null;
        r.productId = s.productId ?? null;
        r.generatedAt = generatedAt;
        r.cachedAt = now;
      }),
    );

    await database.batch(...deletes, ...inserts);
  });
}

// ── Dermatologists ────────────────────────────────────────────────────────

export async function readCachedDermatologists(): Promise<Dermatologist[]> {
  const records = await database
    .get<HomeDermatologist>('home_dermatologists')
    .query()
    .fetch();
  return records.map((r) => ({
    id: r.serverId,
    name: r.name,
    specialization: r.specialization,
    rating: r.rating,
    reviewCount: r.reviewCount,
    avatarUrl: r.avatarUrl ?? null,
    isOnline: r.isOnline,
    yearsExperience: r.yearsExperience,
    consultationFee: r.consultationFee,
    currency: r.currency,
  }));
}

export async function writeCachedDermatologists(derms: Dermatologist[]): Promise<void> {
  await database.write(async () => {
    const existing = await database
      .get<HomeDermatologist>('home_dermatologists')
      .query()
      .fetch();

    const deletes = existing.map((r) => r.prepareDestroyPermanently());
    const now = Date.now();
    const inserts = derms.map((d) =>
      database.get<HomeDermatologist>('home_dermatologists').prepareCreate((r) => {
        r.serverId = d.id;
        r.name = d.name;
        r.specialization = d.specialization;
        r.rating = d.rating;
        r.reviewCount = d.reviewCount;
        r.avatarUrl = d.avatarUrl ?? null;
        r.isOnline = d.isOnline;
        r.yearsExperience = d.yearsExperience;
        r.consultationFee = d.consultationFee;
        r.currency = d.currency;
        r.cachedAt = now;
      }),
    );

    await database.batch(...deletes, ...inserts);
  });
}

// ── Banners ───────────────────────────────────────────────────────────────

export async function readCachedBanners(): Promise<PromoBanner[]> {
  const now = Date.now();
  const records = await database.get<Banner>('banners').query().fetch();
  return records
    .filter((r) => r.expiresAt > now)
    .map((r) => ({
      id: r.serverId,
      imageUrl: r.imageUrl,
      title: r.title,
      subtitle: r.subtitle,
      ctaLabel: r.ctaLabel,
      ctaRoute: r.ctaRoute,
      expiresAt: new Date(r.expiresAt).toISOString(),
    }));
}

export async function writeCachedBanners(banners: PromoBanner[]): Promise<void> {
  await database.write(async () => {
    const existing = await database.get<Banner>('banners').query().fetch();
    const deletes = existing.map((r) => r.prepareDestroyPermanently());
    const now = Date.now();
    const inserts = banners.map((b) =>
      database.get<Banner>('banners').prepareCreate((r) => {
        r.serverId = b.id;
        r.imageUrl = b.imageUrl;
        r.title = b.title;
        r.subtitle = b.subtitle;
        r.ctaLabel = b.ctaLabel;
        r.ctaRoute = b.ctaRoute;
        r.expiresAt = new Date(b.expiresAt).getTime();
        r.cachedAt = now;
      }),
    );
    await database.batch(...deletes, ...inserts);
  });
}

// ── Notification count ────────────────────────────────────────────────────

export async function readCachedNotificationCount(): Promise<number> {
  const records = await database
    .get<HomeMeta>('home_meta')
    .query(Q.where('meta_key', META_KEY_NOTIF_COUNT))
    .fetch();
  return records.length > 0 ? (records[0].valueNum ?? 0) : 0;
}

export async function writeCachedNotificationCount(count: number): Promise<void> {
  await writeMeta(META_KEY_NOTIF_COUNT, count);
}

// ── Full cache read ───────────────────────────────────────────────────────

export async function readAllCachedHomeData(
  analysisId: string | null,
): Promise<{
  trendingProducts: HomeProductItem[];
  bestSellers: HomeProductItem[];
  dermatologists: Dermatologist[];
  analysis: SkinAnalysisSummary | null;
  routine: TodaysRoutine | null;
  notificationCount: number;
  banners: PromoBanner[];
}> {
  const [trending, bestSellers, derms, analysis, banners, notificationCount] =
    await Promise.all([
      readHomeProducts('trending'),
      readHomeProducts('best_sellers'),
      readCachedDermatologists(),
      readCachedAnalysis(),
      readCachedBanners(),
      readCachedNotificationCount(),
    ]);

  const routine =
    analysisId != null ? await readCachedRoutine(analysisId) : null;

  return {
    trendingProducts: trending,
    bestSellers,
    dermatologists: derms,
    analysis,
    routine,
    notificationCount,
    banners,
  };
}
