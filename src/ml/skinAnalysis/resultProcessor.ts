import type {
  RawMLOutput,
  SkinAnalysisResult,
  SkinType,
  SkinCondition,
  ConditionSeverity,
  Severity,
} from './types';

function scoreToSeverity(score: number): Severity {
  if (score < 0.25) return 'none';
  if (score < 0.5) return 'mild';
  if (score < 0.75) return 'moderate';
  return 'severe';
}

function invertedSeverity(score: number): Severity {
  return scoreToSeverity(1 - score);
}

function deriveSkinType(raw: RawMLOutput): SkinType {
  const { oilLevelScore, hydrationScore, sensitivityScore } = raw;

  if (sensitivityScore >= 0.6) return 'sensitive';
  if (oilLevelScore >= 0.65 && hydrationScore >= 0.4) return 'oily';
  if (hydrationScore < 0.3) return 'dry';
  if (oilLevelScore >= 0.5 && hydrationScore < 0.45) return 'combination';
  return 'normal';
}

interface ConditionMapping {
  condition: SkinCondition;
  score: number;
  invert?: boolean;
}

function deriveConditions(raw: RawMLOutput): ConditionSeverity[] {
  const mappings: ConditionMapping[] = [
    { condition: 'acne',               score: raw.acneScore },
    { condition: 'hyperpigmentation',  score: raw.pigmentationScore },
    { condition: 'oiliness',           score: raw.oilLevelScore },
    { condition: 'dryness',            score: raw.hydrationScore, invert: true },
    { condition: 'sensitivity',        score: raw.sensitivityScore },
    // Low uniformity / texture → visible wrinkles / uneven surface
    { condition: 'wrinkles',           score: raw.textureScore, invert: true },
  ];

  return mappings
    .map(({ condition, score, invert }): ConditionSeverity => ({
      condition,
      severity: invert ? invertedSeverity(score) : scoreToSeverity(score),
    }))
    .filter(({ severity }) => severity !== 'none');
}

/**
 * Converts the raw float output from the ML model into a typed, human-readable
 * SkinAnalysisResult. No image data is involved at this stage.
 */
export function processRawOutput(raw: RawMLOutput): SkinAnalysisResult {
  return {
    skinType: deriveSkinType(raw),
    conditions: deriveConditions(raw),
    scores: {
      hydration:  parseFloat(raw.hydrationScore.toFixed(3)),
      texture:    parseFloat(raw.textureScore.toFixed(3)),
      uniformity: parseFloat(raw.uniformityScore.toFixed(3)),
    },
    analysedAt: new Date().toISOString(),
    confidence: parseFloat(raw.confidence.toFixed(3)),
  };
}
