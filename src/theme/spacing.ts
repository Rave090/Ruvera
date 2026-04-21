export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
  section: 80,
} as const;

export type SpacingTokens = typeof spacing;
export type SpacingKey = keyof SpacingTokens;
