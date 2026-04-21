import type { SkinAnalysisResult } from '@ml/skinAnalysis/types';

/** Regex patterns that indicate raw image data that must never leave the device. */
const SENSITIVE_PATTERNS = [
  /^data:image\//i,       // data URI
  /^[A-Za-z0-9+/]{100,}={0,2}$/, // bare base64 blob (≥100 chars)
] as const;

export type SafeGuardResult =
  | { safe: true }
  | { safe: false; reason: string };

/**
 * Recursively scans a plain object for string values that look like
 * raw image data. Call this before passing any object to a network service.
 */
export function scanForSensitiveImageData(value: unknown, path = 'root'): SafeGuardResult {
  if (typeof value === 'string') {
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(value)) {
        return { safe: false, reason: `Sensitive image data detected at "${path}"` };
      }
    }
    return { safe: true };
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const result = scanForSensitiveImageData(value[i], `${path}[${i}]`);
      if (!result.safe) return result;
    }
    return { safe: true };
  }

  if (value !== null && typeof value === 'object') {
    for (const key of Object.keys(value as Record<string, unknown>)) {
      const result = scanForSensitiveImageData(
        (value as Record<string, unknown>)[key],
        `${path}.${key}`,
      );
      if (!result.safe) return result;
    }
    return { safe: true };
  }

  return { safe: true };
}

/**
 * Extracts only the anonymised, transmittable fields from a SkinAnalysisResult.
 * The returned object contains no pixel data, embeddings, or biometric identifiers.
 */
export function anonymiseSkinResult(
  result: SkinAnalysisResult,
): Pick<SkinAnalysisResult, 'skinType' | 'conditions' | 'scores' | 'analysedAt'> {
  return {
    skinType: result.skinType,
    conditions: result.conditions,
    scores: result.scores,
    analysedAt: result.analysedAt,
  };
}
