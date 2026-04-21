import { useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@store/auth.store';
import { SECURE_STORE_KEYS } from '@constants';

interface UseOnboardingReturn {
  finishOnboarding: () => Promise<void>;
}

export function useOnboarding(): UseOnboardingReturn {
  const finishOnboarding = useCallback(async () => {
    await SecureStore.setItemAsync(SECURE_STORE_KEYS.hasCompletedOnboarding, 'true');
    useAuthStore.getState().completeOnboarding();
  }, []);

  return { finishOnboarding };
}
