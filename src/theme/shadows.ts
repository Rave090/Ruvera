import { ViewStyle } from 'react-native';

const makeShadow = (
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
): ViewStyle => ({
  shadowColor: '#1A1A2E',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const shadows = {
  none: makeShadow(0, 0, 0, 0),
  xs: makeShadow(0.04, 2, 1, 1),
  sm: makeShadow(0.06, 4, 2, 2),
  md: makeShadow(0.1, 8, 4, 4),
  lg: makeShadow(0.14, 12, 6, 6),
  xl: makeShadow(0.18, 20, 10, 10),
} as const;

export type ShadowTokens = typeof shadows;
export type ShadowKey = keyof ShadowTokens;
