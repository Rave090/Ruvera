import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORE_KEYS } from '@constants';
import type { UserProfile } from '@store/auth.store';
import { useAuthStore } from '@store/auth.store';

export function useSessionHydration(): void {
  useEffect(() => {
    async function hydrate() {
      const { setCredentials, setHydrating, completeOnboarding } =
        useAuthStore.getState();

      try {
        const [accessToken, refreshToken, profileJson, onboardingFlag] =
          await Promise.all([
            SecureStore.getItemAsync(SECURE_STORE_KEYS.accessToken),
            SecureStore.getItemAsync(SECURE_STORE_KEYS.refreshToken),
            SecureStore.getItemAsync(SECURE_STORE_KEYS.userProfile),
            SecureStore.getItemAsync(SECURE_STORE_KEYS.hasCompletedOnboarding),
          ]);

        if (onboardingFlag === 'true') {
          completeOnboarding();
        }

        if (accessToken && refreshToken && profileJson) {
          const userProfile = JSON.parse(profileJson) as UserProfile;
          setCredentials({ accessToken, refreshToken, userProfile });
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[SessionHydration] Failed to restore session:', error);
        }
      } finally {
        setHydrating(false);
      }
    }

    hydrate();
  }, []);
}
