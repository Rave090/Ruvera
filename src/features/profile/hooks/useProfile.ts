import { useState, useEffect, useCallback } from 'react';
import { fetchUserProfile, updateDisplayName, updateSkinProfile, toggleFavoriteProduct } from '../services/user.service';
import { useProfileStore } from '@store/profile.store';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import type { UserProfileData, SkinProfile } from '../types';

interface UseProfileResult {
  profile: UserProfileData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveName: (name: string) => Promise<void>;
  saveSkinProfile: (skin: SkinProfile) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  refresh: () => void;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setFavoriteIds = useProfileStore(s => s.setFavoriteProductIds);
  const setSkinProfile = useProfileStore(s => s.setSkinProfile);
  const authProfile = useAuthStore(selectUserProfile);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchUserProfile();
    if (result.success) {
      const data = { ...result.data, displayName: authProfile?.displayName ?? result.data.displayName };
      setProfile(data);
      setFavoriteIds(data.favoriteProductIds);
      if (data.skinProfile) setSkinProfile(data.skinProfile);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  }, [authProfile, setFavoriteIds, setSkinProfile]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveName = useCallback(async (name: string) => {
    setIsSaving(true);
    const result = await updateDisplayName(name);
    if (result.success) setProfile(result.data);
    setIsSaving(false);
  }, []);

  const saveSkinProfile = useCallback(async (skin: SkinProfile) => {
    setIsSaving(true);
    const result = await updateSkinProfile(skin);
    if (result.success) {
      setProfile(result.data);
      setSkinProfile(skin);
    }
    setIsSaving(false);
  }, [setSkinProfile]);

  const toggleFavorite = useCallback(async (productId: string) => {
    const result = await toggleFavoriteProduct(productId);
    if (result.success) {
      setFavoriteIds(result.data);
      setProfile(prev => prev ? { ...prev, favoriteProductIds: result.data } : prev);
    }
  }, [setFavoriteIds]);

  return { profile, isLoading, isSaving, error, saveName, saveSkinProfile, toggleFavorite, refresh: load };
}
