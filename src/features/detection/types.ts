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
