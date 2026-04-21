import type { Result } from '@services/api/types';
import type { UserProfileData, SkinProfile } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

let MOCK_PROFILE: UserProfileData = {
  id: 'u1',
  displayName: 'Test User',
  email: 'user@test.com',
  avatarUrl: null,
  skinProfile: null,
  favoriteProductIds: ['p1', 'p4'],
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
};

export async function fetchUserProfile(): Promise<Result<UserProfileData>> {
  await delay(400);
  return { success: true, data: { ...MOCK_PROFILE } };
}

export async function updateDisplayName(
  displayName: string,
): Promise<Result<UserProfileData>> {
  await delay(500);
  MOCK_PROFILE = { ...MOCK_PROFILE, displayName };
  return { success: true, data: { ...MOCK_PROFILE } };
}

export async function updateSkinProfile(
  skinProfile: SkinProfile,
): Promise<Result<UserProfileData>> {
  await delay(500);
  MOCK_PROFILE = { ...MOCK_PROFILE, skinProfile };
  return { success: true, data: { ...MOCK_PROFILE } };
}

export async function toggleFavoriteProduct(
  productId: string,
): Promise<Result<string[]>> {
  await delay(300);
  const ids = MOCK_PROFILE.favoriteProductIds;
  const next = ids.includes(productId)
    ? ids.filter(id => id !== productId)
    : [...ids, productId];
  MOCK_PROFILE = { ...MOCK_PROFILE, favoriteProductIds: next };
  return { success: true, data: next };
}
