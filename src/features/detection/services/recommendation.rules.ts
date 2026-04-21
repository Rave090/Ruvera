import type { SkinType, SkinCondition, Severity } from '@ml/skinAnalysis/types';
import type { ProductCategory, RecommendationPriority } from '../types';

export interface BaseRule {
  category: ProductCategory;
  priority: RecommendationPriority;
  rationale: string;
  preferIngredients: string[];
  avoidIngredients: string[];
}

export interface ConditionRule extends BaseRule {
  minimumSeverity: Severity;
}

// ─── Skin-type base skincare rules ───────────────────────────────────────────

export const SKIN_TYPE_SKINCARE: Record<SkinType, BaseRule[]> = {
  oily: [
    {
      category: 'cleanser', priority: 'essential',
      rationale: 'A foaming or gel cleanser removes excess sebum without over-stripping.',
      preferIngredients: ['salicylic acid', 'niacinamide', 'tea tree'],
      avoidIngredients: ['petrolatum', 'coconut oil', 'heavy mineral oil'],
    },
    {
      category: 'moisturizer', priority: 'essential',
      rationale: 'A lightweight, oil-free moisturiser hydrates without adding shine.',
      preferIngredients: ['hyaluronic acid', 'glycerin', 'niacinamide'],
      avoidIngredients: ['mineral oil', 'shea butter', 'lanolin'],
    },
    {
      category: 'toner', priority: 'recommended',
      rationale: 'A balancing toner minimises pores and controls oil through the day.',
      preferIngredients: ['witch hazel', 'niacinamide', 'AHA/BHA blend'],
      avoidIngredients: ['alcohol denat.', 'heavy emollients'],
    },
  ],
  dry: [
    {
      category: 'cleanser', priority: 'essential',
      rationale: 'A creamy, non-stripping cleanser preserves the natural moisture barrier.',
      preferIngredients: ['ceramides', 'glycerin', 'squalane'],
      avoidIngredients: ['SLS', 'alcohol denat.', 'salicylic acid'],
    },
    {
      category: 'moisturizer', priority: 'essential',
      rationale: 'A rich moisturiser replenishes lipids and prevents trans-epidermal water loss.',
      preferIngredients: ['ceramides', 'shea butter', 'hyaluronic acid', 'squalane'],
      avoidIngredients: ['alcohol denat.', 'fragrance'],
    },
    {
      category: 'serum', priority: 'recommended',
      rationale: 'A hydrating serum delivers deep moisture beneath the barrier layer.',
      preferIngredients: ['hyaluronic acid', 'glycerin', 'panthenol'],
      avoidIngredients: ['strong acids', 'retinol without buffer'],
    },
  ],
  combination: [
    {
      category: 'cleanser', priority: 'essential',
      rationale: 'A balanced gel-cream cleanser clears the T-zone without over-drying the cheeks.',
      preferIngredients: ['niacinamide', 'glycerin', 'mild surfactants'],
      avoidIngredients: ['heavy oils', 'harsh sulfates'],
    },
    {
      category: 'moisturizer', priority: 'essential',
      rationale: 'A lightweight moisturiser hydrates dry areas without exacerbating oily zones.',
      preferIngredients: ['hyaluronic acid', 'glycerin', 'aloe vera'],
      avoidIngredients: ['heavy occlusives', 'coconut oil'],
    },
    {
      category: 'toner', priority: 'recommended',
      rationale: 'A gentle toner balances the T-zone while keeping cheeks comfortable.',
      preferIngredients: ['niacinamide', 'centella asiatica'],
      avoidIngredients: ['high-concentration alcohol', 'heavy oils'],
    },
  ],
  normal: [
    {
      category: 'cleanser', priority: 'essential',
      rationale: 'A gentle cleanser maintains the existing balanced skin environment.',
      preferIngredients: ['mild surfactants', 'glycerin'],
      avoidIngredients: [],
    },
    {
      category: 'moisturizer', priority: 'essential',
      rationale: 'A medium-weight moisturiser supports a healthy barrier.',
      preferIngredients: ['hyaluronic acid', 'glycerin', 'ceramides'],
      avoidIngredients: [],
    },
  ],
  sensitive: [
    {
      category: 'cleanser', priority: 'essential',
      rationale: 'A fragrance-free, ultra-gentle cleanser avoids triggering reactivity.',
      preferIngredients: ['ceramides', 'colloidal oatmeal', 'allantoin'],
      avoidIngredients: ['fragrance', 'alcohol denat.', 'essential oils', 'SLS'],
    },
    {
      category: 'moisturizer', priority: 'essential',
      rationale: 'A barrier-restoring moisturiser calms and protects reactive skin.',
      preferIngredients: ['ceramides', 'niacinamide', 'panthenol', 'centella asiatica'],
      avoidIngredients: ['fragrance', 'essential oils', 'high-concentration acids'],
    },
    {
      category: 'serum', priority: 'recommended',
      rationale: 'A calming serum reduces redness and reinforces the skin barrier.',
      preferIngredients: ['centella asiatica', 'niacinamide', 'green tea extract'],
      avoidIngredients: ['retinol', 'strong AHA/BHA', 'fragrance'],
    },
  ],
};

export const UNIVERSAL_SUNSCREEN: BaseRule = {
  category: 'sunscreen', priority: 'essential',
  rationale: 'Broad-spectrum SPF 30+ protects against UV-induced ageing and pigmentation.',
  preferIngredients: ['zinc oxide', 'titanium dioxide', 'tinosorb'],
  avoidIngredients: [],
};

// ─── Condition-specific skincare rules ───────────────────────────────────────

export const CONDITION_SKINCARE: Partial<Record<SkinCondition, ConditionRule[]>> = {
  acne: [
    {
      category: 'exfoliant', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'BHA unclogs pores and reduces acne-causing bacteria.',
      preferIngredients: ['salicylic acid (2%)', 'azelaic acid', 'benzoyl peroxide'],
      avoidIngredients: ['heavy oils', 'coconut oil', 'isopropyl myristate'],
    },
    {
      category: 'serum', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'Niacinamide reduces sebum and calms post-acne redness.',
      preferIngredients: ['niacinamide (10%)', 'zinc', 'azelaic acid'],
      avoidIngredients: ['coconut oil', 'fragrance'],
    },
  ],
  hyperpigmentation: [
    {
      category: 'serum', priority: 'essential', minimumSeverity: 'mild',
      rationale: 'Vitamin C inhibits melanin synthesis and brightens uneven tone.',
      preferIngredients: ['L-ascorbic acid', 'alpha-arbutin', 'tranexamic acid'],
      avoidIngredients: ['fragrance', 'phototoxic oils'],
    },
    {
      category: 'exfoliant', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'AHA exfoliation accelerates cell turnover, fading surface pigmentation.',
      preferIngredients: ['glycolic acid', 'lactic acid', 'mandelic acid'],
      avoidIngredients: ['physical scrubs (abrasive)'],
    },
  ],
  dryness: [
    {
      category: 'mask', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'A hydrating mask delivers an intensive moisture boost to parched skin.',
      preferIngredients: ['hyaluronic acid', 'ceramides', 'aloe vera', 'honey extract'],
      avoidIngredients: ['clay', 'charcoal', 'sulfur'],
    },
  ],
  wrinkles: [
    {
      category: 'serum', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'Retinol or a peptide serum stimulates collagen and smooths fine lines.',
      preferIngredients: ['retinol', 'retinal', 'matrixyl', 'copper peptides'],
      avoidIngredients: [],
    },
    {
      category: 'eye-cream', priority: 'optional', minimumSeverity: 'mild',
      rationale: 'The delicate eye area benefits from a targeted peptide or caffeine treatment.',
      preferIngredients: ['caffeine', 'peptides', 'vitamin K'],
      avoidIngredients: ['direct retinol contact with eyes'],
    },
  ],
  sensitivity: [
    {
      category: 'mask', priority: 'optional', minimumSeverity: 'moderate',
      rationale: 'A calming oat or centella mask soothes reactive flare-ups.',
      preferIngredients: ['colloidal oatmeal', 'centella asiatica', 'aloe vera'],
      avoidIngredients: ['acids', 'fragrance', 'essential oils'],
    },
  ],
};

// ─── Skin-type base cosmetics rules ──────────────────────────────────────────

export const SKIN_TYPE_COSMETICS: Record<SkinType, BaseRule[]> = {
  oily: [
    {
      category: 'primer', priority: 'recommended',
      rationale: 'A pore-minimising, mattifying primer controls shine and extends wear.',
      preferIngredients: ['silica', 'dimethicone', 'niacinamide'],
      avoidIngredients: ['heavy oils', 'glycerin-heavy formulas'],
    },
    {
      category: 'foundation', priority: 'recommended',
      rationale: 'A matte, long-wear foundation prevents excess shine throughout the day.',
      preferIngredients: ['oil-free formula', 'niacinamide'],
      avoidIngredients: ['heavy oils', 'luminising pigments'],
    },
    {
      category: 'setting-powder', priority: 'recommended',
      rationale: 'A translucent setting powder locks makeup in place and absorbs midday oil.',
      preferIngredients: ['silica', 'tapioca starch', 'kaolin'],
      avoidIngredients: ['shimmer', 'mica-heavy formulas'],
    },
  ],
  dry: [
    {
      category: 'primer', priority: 'recommended',
      rationale: 'A hydrating primer creates a dewy base and prevents patchiness.',
      preferIngredients: ['hyaluronic acid', 'glycerin', 'squalane'],
      avoidIngredients: ['mattifying silica', 'high-alcohol formulas'],
    },
    {
      category: 'foundation', priority: 'recommended',
      rationale: 'A hydrating, luminous foundation avoids emphasising dry texture.',
      preferIngredients: ['hyaluronic acid', 'glycerin', 'skin oils'],
      avoidIngredients: ['powder formulas', 'matte finishes'],
    },
  ],
  combination: [
    {
      category: 'primer', priority: 'recommended',
      rationale: 'A balancing primer evens out the T-zone and cheeks for uniform application.',
      preferIngredients: ['niacinamide', 'lightweight silicones'],
      avoidIngredients: ['heavy oils'],
    },
    {
      category: 'foundation', priority: 'recommended',
      rationale: 'A satin-finish foundation suits combination skin without over-drying or over-shining.',
      preferIngredients: ['buildable coverage', 'balanced formula'],
      avoidIngredients: [],
    },
  ],
  normal: [
    {
      category: 'foundation', priority: 'optional',
      rationale: 'Normal skin suits a wide range of finishes — choose based on desired look.',
      preferIngredients: ['balanced formula'],
      avoidIngredients: [],
    },
  ],
  sensitive: [
    {
      category: 'foundation', priority: 'recommended',
      rationale: 'A mineral foundation minimises irritation risk and provides gentle coverage.',
      preferIngredients: ['zinc oxide', 'titanium dioxide', 'iron oxides'],
      avoidIngredients: ['fragrance', 'parabens', 'essential oils', 'alcohol denat.'],
    },
  ],
};

// ─── Condition-specific cosmetics rules ──────────────────────────────────────

export const CONDITION_COSMETICS: Partial<Record<SkinCondition, ConditionRule[]>> = {
  hyperpigmentation: [
    {
      category: 'concealer', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'A full-coverage concealer neutralises dark spots and uneven tone.',
      preferIngredients: ['mineral pigments', 'SPF'],
      avoidIngredients: ['fragrance'],
    },
  ],
  'dark-circles': [
    {
      category: 'concealer', priority: 'recommended', minimumSeverity: 'mild',
      rationale: 'A colour-correcting concealer counteracts the blue/purple tone under the eyes.',
      preferIngredients: ['peach/orange corrector pigments', 'vitamin K', 'caffeine'],
      avoidIngredients: ['heavy texture', 'fragrance'],
    },
  ],
};
