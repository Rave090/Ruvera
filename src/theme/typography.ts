import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto',
    semibold: 'Roboto',
    bold: 'Roboto',
  },
  default: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
});

const fontWeight = Platform.select({
  ios: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  android: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  default: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
});

export const typography = {
  fontFamily,
  fontWeight,

  fontSize: {
    xs: 11,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    display: 28,
    hero: 34,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  variants: {
    h1: {
      fontSize: 34,
      lineHeight: 41,
      fontWeight: fontWeight?.bold ?? '700',
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: fontWeight?.bold ?? '700',
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: fontWeight?.semibold ?? '600',
      letterSpacing: 0,
    },
    subheading: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: fontWeight?.semibold ?? '600',
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: fontWeight?.regular ?? '400',
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: fontWeight?.regular ?? '400',
      letterSpacing: 0,
    },
    label: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: fontWeight?.medium ?? '500',
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: fontWeight?.regular ?? '400',
      letterSpacing: 0.2,
    },
    overline: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: fontWeight?.semibold ?? '600',
      letterSpacing: 1.5,
    },
  },
} as const;

export type TypographyTokens = typeof typography;
export type TypographyVariant = keyof typeof typography.variants;
