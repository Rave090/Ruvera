import { useCallback, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@store/auth.store';
import { logoutService } from '@features/auth/services/auth.service';
import { SECURE_STORE_KEYS } from '@constants';

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
}

export function useLogout(): UseLogoutReturn {
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    setIsLoading(true);

    await logoutService();

    await Promise.all([
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.accessToken),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.refreshToken),
      SecureStore.deleteItemAsync(SECURE_STORE_KEYS.userProfile),
    ]);

    // Clearing credentials triggers the auth guard to redirect to login
    useAuthStore.getState().clearCredentials();

    setIsLoading(false);
  }, []);

  return { logout, isLoading };
}
