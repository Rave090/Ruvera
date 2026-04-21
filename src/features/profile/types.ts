export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';

export interface SkinProfile {
  skinType: SkinType;
  concerns: string[];
  allergies: string[];
}

export interface UserProfileData {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  skinProfile: SkinProfile | null;
  favoriteProductIds: string[];
  createdAt: string;
}
