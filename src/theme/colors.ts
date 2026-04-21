export const lightColors = {
  // Brand — warm rose / mauve
  primary: '#5C2B3E',
  primaryLight: '#A67888',
  primaryDark: '#3D1828',

  secondary: '#E8906A',
  secondaryLight: '#F2B898',
  secondaryDark: '#C06840',

  // Semantic
  success: '#2D8A6F',
  successLight: '#AADBC8',
  successDark: '#1F6150',

  error: '#D63031',
  errorLight: '#FAB8B8',
  errorDark: '#A02020',

  warning: '#E8A020',
  warningLight: '#FAD880',
  warningDark: '#B87810',

  info: '#3A7DC8',
  infoLight: '#AACED0',
  infoDark: '#2858A0',

  // Surfaces
  background: '#FAF2F3',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5E8EA',
  surfaceTertiary: '#EED5D8',

  // Text
  textPrimary: '#3D1828',
  textSecondary: '#7A5560',
  textDisabled: '#C4A8B0',
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Borders
  border: '#E5D0D4',
  borderFocus: '#5C2B3E',
  borderError: '#D63031',

  // Overlays
  overlay: 'rgba(62, 24, 40, 0.5)',
  overlayLight: 'rgba(62, 24, 40, 0.1)',

  // Misc
  divider: '#EDD8DC',
  skeleton: '#F0E0E3',
  transparent: 'transparent',
} as const;

export const darkColors = {
  // Brand
  primary: '#C896A8',
  primaryLight: '#E0B8C8',
  primaryDark: '#A07080',

  secondary: '#E8906A',
  secondaryLight: '#F2B898',
  secondaryDark: '#C06840',

  // Semantic
  success: '#4DB896',
  successLight: '#1A4A38',
  successDark: '#2D8A6F',

  error: '#FF7070',
  errorLight: '#5C1A1A',
  errorDark: '#D63031',

  warning: '#FDCB6E',
  warningLight: '#5C3D00',
  warningDark: '#E8A020',

  info: '#74AEFF',
  infoLight: '#0A2030',
  infoDark: '#3A7DC8',

  // Surfaces
  background: '#1A0D10',
  surface: '#261318',
  surfaceSecondary: '#301820',
  surfaceTertiary: '#3D2028',

  // Text
  textPrimary: '#F5E8EA',
  textSecondary: '#C4A0A8',
  textDisabled: '#7A5560',
  textInverse: '#3D1828',
  textOnPrimary: '#FFFFFF',

  // Borders
  border: '#3D2028',
  borderFocus: '#C896A8',
  borderError: '#FF7070',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Misc
  divider: '#3D2028',
  skeleton: '#301820',
  transparent: 'transparent',
} as const;

export type ColorTokens = typeof lightColors;
export type ColorKey = keyof ColorTokens;
