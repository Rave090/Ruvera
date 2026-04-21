export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  xxxl: 32,
  full: 9999,
} as const;

export type BorderRadiusTokens = typeof borderRadius;
export type BorderRadiusKey = keyof BorderRadiusTokens;
