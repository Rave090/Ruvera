import type { SkinAnalysisResult } from '@ml/skinAnalysis/types';
import { checkFLConsent } from './consentGate';

export interface GradientUpdate {
  layerName: string;
  /** Differential-privacy-noised gradient values — raw training data is never included. */
  noisedGradients: number[];
}

export interface TrainingResult {
  success: boolean;
  gradientUpdates: GradientUpdate[];
  errorMessage?: string;
}

/**
 * Runs a single on-device fine-tuning pass using the provided sample.
 * Always checks consent before executing. Applies DP noise before returning gradients.
 *
 * STUB: TFLite model update logic is not yet implemented.
 */
export async function runLocalTrainingPass(
  _sample: SkinAnalysisResult,
): Promise<TrainingResult> {
  const consent = await checkFLConsent();
  if (!consent.granted) {
    return { success: false, gradientUpdates: [], errorMessage: consent.reason };
  }

  // TODO: load TFLite model, forward pass, compute gradients, apply DP noise
  return { success: false, gradientUpdates: [], errorMessage: 'Trainer not yet implemented.' };
}
