import type { SkinAnalysisResult, Severity } from '@ml/skinAnalysis/types';
import type {
  SkinRecommendation,
  ProductRecommendation,
  SkincareRoutineStep,
  ProductCategory,
} from '../types';
import {
  SKIN_TYPE_SKINCARE,
  SKIN_TYPE_COSMETICS,
  CONDITION_SKINCARE,
  CONDITION_COSMETICS,
  UNIVERSAL_SUNSCREEN,
  type BaseRule,
  type ConditionRule,
} from './recommendation.rules';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEVERITY_RANK: Record<Severity, number> = { none: 0, mild: 1, moderate: 2, severe: 3 };

function meetsMinimum(actual: Severity, minimum: Severity): boolean {
  return SEVERITY_RANK[actual] >= SEVERITY_RANK[minimum];
}

function toProductRecommendation(
  rule: BaseRule,
  productLine: 'skincare' | 'cosmetics',
): ProductRecommendation {
  return { ...rule, productLine };
}

function conditionRuleToBase({ minimumSeverity: _, ...rest }: ConditionRule): BaseRule {
  return rest;
}

// ─── Routine builder ─────────────────────────────────────────────────────────

const STEP_ORDER: ProductCategory[] = [
  'cleanser', 'toner', 'serum', 'eye-cream', 'moisturizer', 'sunscreen', 'mask', 'exfoliant',
];

function buildRoutine(
  products: ProductRecommendation[],
  timeOfDay: 'morning' | 'evening',
): SkincareRoutineStep[] {
  return products
    .filter((p) => p.productLine === 'skincare')
    .filter((p) => {
      if (timeOfDay === 'morning' && p.category === 'exfoliant') return false;
      if (timeOfDay === 'evening' && p.category === 'sunscreen') return false;
      return true;
    })
    .sort((a, b) => {
      const ai = STEP_ORDER.indexOf(a.category);
      const bi = STEP_ORDER.indexOf(b.category);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    })
    .map((p, i): SkincareRoutineStep => ({
      order: i + 1,
      timeOfDay,
      productCategory: p.category,
      instruction: p.rationale,
    }));
}

// ─── Engine ───────────────────────────────────────────────────────────────────

/**
 * Rule-based recommendation engine.
 * Maps a SkinAnalysisResult to skincare + cosmetics product recommendations
 * and a morning/evening routine. Pure function — no side effects.
 */
export function generateRecommendations(result: SkinAnalysisResult): SkinRecommendation {
  const skincareMap = new Map<ProductCategory, ProductRecommendation>();
  const cosmeticsMap = new Map<ProductCategory, ProductRecommendation>();

  // Base rules from skin type
  for (const rule of SKIN_TYPE_SKINCARE[result.skinType]) {
    skincareMap.set(rule.category, toProductRecommendation(rule, 'skincare'));
  }
  skincareMap.set('sunscreen', toProductRecommendation(UNIVERSAL_SUNSCREEN, 'skincare'));

  for (const rule of SKIN_TYPE_COSMETICS[result.skinType]) {
    cosmeticsMap.set(rule.category, toProductRecommendation(rule, 'cosmetics'));
  }

  // Layer in condition-specific rules (do not overwrite a slot already filled by skin-type rules)
  for (const { condition, severity } of result.conditions) {
    for (const condRule of CONDITION_SKINCARE[condition] ?? []) {
      if (meetsMinimum(severity, condRule.minimumSeverity) && !skincareMap.has(condRule.category)) {
        skincareMap.set(
          condRule.category,
          toProductRecommendation(conditionRuleToBase(condRule), 'skincare'),
        );
      }
    }

    for (const condRule of CONDITION_COSMETICS[condition] ?? []) {
      if (meetsMinimum(severity, condRule.minimumSeverity) && !cosmeticsMap.has(condRule.category)) {
        cosmeticsMap.set(
          condRule.category,
          toProductRecommendation(conditionRuleToBase(condRule), 'cosmetics'),
        );
      }
    }
  }

  const skincareProducts = Array.from(skincareMap.values());
  const cosmeticProducts = Array.from(cosmeticsMap.values());

  return {
    analysisId: result.analysedAt,
    skincareProducts,
    cosmeticProducts,
    morningRoutine: buildRoutine(skincareProducts, 'morning'),
    eveningRoutine: buildRoutine(skincareProducts, 'evening'),
    generatedAt: new Date().toISOString(),
  };
}
