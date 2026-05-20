import type { SkinAnalysisResult } from '@ml/skinAnalysis/types';
import type { FaceDetectionResult } from '@ml/faceDetection/types';

export interface DetectionSessionState {
  phase: 'idle' | 'detecting' | 'analysing' | 'complete' | 'error';
  faceResult: FaceDetectionResult | null;
  analysisResult: SkinAnalysisResult | null;
  errorMessage: string | null;
}

export interface DetectionConsentState {
  cameraGranted: boolean;
  skinAnalysisGranted: boolean;
  federatedLearningGranted: boolean;
}

// ─── Recommendation types ────────────────────────────────────────────────────

export type ProductCategory =
  | 'cleanser'
  | 'moisturizer'
  | 'serum'
  | 'sunscreen'
  | 'toner'
  | 'exfoliant'
  | 'eye-cream'
  | 'mask'
  | 'foundation'
  | 'concealer'
  | 'blush'
  | 'setting-powder'
  | 'primer';

export type RecommendationPriority = 'essential' | 'recommended' | 'optional';

export type ProductLineCategory = 'skincare' | 'cosmetics';

export interface ProductRecommendation {
  category: ProductCategory;
  productLine: ProductLineCategory;
  priority: RecommendationPriority;
  rationale: string;
  preferIngredients: string[];
  avoidIngredients: string[];
}

export interface SkincareRoutineStep {
  order: number;
  timeOfDay: 'morning' | 'evening';
  productCategory: ProductCategory;
  instruction: string;
}

export interface SkinRecommendation {
  analysisId: string;
  skincareProducts: ProductRecommendation[];
  cosmeticProducts: ProductRecommendation[];
  morningRoutine: SkincareRoutineStep[];
  eveningRoutine: SkincareRoutineStep[];
  generatedAt: string;
}

// ─── Backend API shapes ──────────────────────────────────────────────────────

export interface SkinAnalysisApiResult {
  id: string;
  analysedAt: string;
  hydrationScore: number;
  hydrationLabel: string;
  overallHealthScore: number;
  skinType: string;
  concerns: string[];
  hasActiveAnalysis: boolean;
}

export interface RoutineStep {
  order: number;
  productCategory: string;
  instruction: string;
  productName: string | null;
  productId: string | null;
}

export interface SkinRoutineApiResult {
  analysisId: string;
  morning: RoutineStep[];
  evening: RoutineStep[];
  generatedAt: string;
}

export interface SubmitAnalysisBody {
  skinType: string;
  concerns: string[];
  oiliness: number;
  hydration: number;
  sensitivity: number;
  acneScore: number;
  pigmentation: number;
  wrinkleScore: number;
  confidence: number;
  analysedAt: string;
}
