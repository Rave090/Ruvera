export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

export type SkinCondition =
  | 'acne'
  | 'rosacea'
  | 'hyperpigmentation'
  | 'dryness'
  | 'oiliness'
  | 'sensitivity'
  | 'wrinkles'
  | 'dark-circles';

export type Severity = 'none' | 'mild' | 'moderate' | 'severe';

/** Raw float values produced by the on-device ML model — never transmitted. */
export interface RawMLOutput {
  acneScore: number;          // 0–1
  oilLevelScore: number;      // 0–1
  pigmentationScore: number;  // 0–1
  hydrationScore: number;     // 0–1
  textureScore: number;       // 0–1
  uniformityScore: number;    // 0–1
  sensitivityScore: number;   // 0–1
  confidence: number;         // 0–1
}

/** Input to the skin analyzer — image URI is local-only, never transmitted. */
export interface SkinAnalysisInput {
  imageUri: string; // LOCAL ONLY
  width: number;
  height: number;
}

export interface ConditionSeverity {
  condition: SkinCondition;
  severity: Severity;
}

export interface SkinScores {
  hydration: number;   // 0–1
  texture: number;     // 0–1
  uniformity: number;  // 0–1
}

/**
 * Processed, anonymised result safe for use across the app.
 * This shape (minus imageUri) may be sent to the backend via skinParams.service.
 */
export interface SkinAnalysisResult {
  skinType: SkinType;
  conditions: ConditionSeverity[];
  scores: SkinScores;
  analysedAt: string;
  confidence: number;
}
