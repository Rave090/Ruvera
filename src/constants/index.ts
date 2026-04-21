export const APP_NAME = 'Ruvera';
export const APP_VERSION = '1.0.0';

export const SECURE_STORE_KEYS = {
  accessToken: 'ruvera_access_token',
  refreshToken: 'ruvera_refresh_token',
  userProfile: 'ruvera_user_profile',
  hasCompletedOnboarding: 'ruvera_has_completed_onboarding',
  userConsent: 'ruvera_user_consent',
  flConsent: 'ruvera_fl_consent',
  colorScheme: 'ruvera_color_scheme',
} as const;

export const USER_ROLES = {
  user: 'user',
  vendor: 'vendor',
  dermatologist: 'dermatologist',
} as const;

export const ORDER_STATUS = {
  pending: 'pending',
  confirmed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
  refunded: 'refunded',
} as const;

export const CONSULTATION_STATUS = {
  scheduled: 'scheduled',
  active: 'active',
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export const SKIN_TYPE = {
  oily: 'oily',
  dry: 'dry',
  combination: 'combination',
  normal: 'normal',
  sensitive: 'sensitive',
} as const;

export const SKIN_CONDITIONS = {
  acne: 'acne',
  rosacea: 'rosacea',
  hyperpigmentation: 'hyperpigmentation',
  eczema: 'eczema',
  psoriasis: 'psoriasis',
  darkCircles: 'dark_circles',
  wrinkles: 'wrinkles',
} as const;

export const MESSAGE_TYPE = {
  text: 'text',
  image: 'image',
  audio: 'audio',
  system: 'system',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const TIMEOUTS = {
  apiRequest: 15_000,
  imageUpload: 60_000,
  socketReconnect: 5_000,
} as const;
