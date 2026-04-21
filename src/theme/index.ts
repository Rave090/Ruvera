import { lightColors, darkColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';
import { borderRadius } from './borderRadius';

export const lightTheme = {
  colors: lightColors,
  spacing,
  typography,
  shadows,
  borderRadius,
} as const;

export const darkTheme = {
  colors: darkColors,
  spacing,
  typography,
  shadows,
  borderRadius,
} as const;

export type Theme = typeof lightTheme;

export { lightColors, darkColors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
export { shadows } from './shadows';
export { borderRadius } from './borderRadius';
export type { ColorTokens, ColorKey } from './colors';
export type { SpacingTokens, SpacingKey } from './spacing';
export type { TypographyTokens, TypographyVariant } from './typography';
export type { ShadowTokens, ShadowKey } from './shadows';
export type { BorderRadiusTokens, BorderRadiusKey } from './borderRadius';
