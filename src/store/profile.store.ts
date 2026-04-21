import { create } from 'zustand';
import type { SkinProfile } from '@features/profile/types';

interface ProfileState {
  skinProfile: SkinProfile | null;
  favoriteProductIds: string[];
}

interface ProfileActions {
  setSkinProfile: (profile: SkinProfile) => void;
  setFavoriteProductIds: (ids: string[]) => void;
  toggleFavoriteProduct: (productId: string) => void;
}

type ProfileStore = ProfileState & ProfileActions;

export const useProfileStore = create<ProfileStore>((set, get) => ({
  skinProfile: null,
  favoriteProductIds: [],

  setSkinProfile: (profile) => set({ skinProfile: profile }),

  setFavoriteProductIds: (ids) => set({ favoriteProductIds: ids }),

  toggleFavoriteProduct: (productId) => {
    const { favoriteProductIds } = get();
    const next = favoriteProductIds.includes(productId)
      ? favoriteProductIds.filter(id => id !== productId)
      : [...favoriteProductIds, productId];
    set({ favoriteProductIds: next });
  },
}));

export const selectSkinProfile = (s: ProfileStore) => s.skinProfile;
export const selectFavoriteProductIds = (s: ProfileStore) =>
  s.favoriteProductIds;
