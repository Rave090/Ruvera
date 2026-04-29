import * as SecureStore from 'expo-secure-store';
import { apiClient, apiRequest } from '@services/api/client';
import { SECURE_STORE_KEYS } from '@constants';
import type { UserRole } from '@store/auth.store';
import type { LoginResponse, SignupRequest, SignupResponse, ForgotPasswordResponse } from '../types';
import type { Result } from '@services/api/types';

export async function loginService(
  email: string,
  password: string,
): Promise<Result<LoginResponse>> {
  return apiRequest(() =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }),
  );
}

export async function signupService(
  request: SignupRequest,
): Promise<Result<SignupResponse>> {
  return apiRequest(() =>
    apiClient.post<SignupResponse>('/auth/signup', request),
  );
}

export async function forgotPasswordService(
  _email: string,
): Promise<Result<ForgotPasswordResponse>> {
  return {
    success: true,
    data: { message: 'If this email exists, a reset link has been sent.' },
  };
}

export async function logoutService(): Promise<void> {
  const refreshToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.refreshToken);
  if (!refreshToken) return;
  await apiRequest(() => apiClient.post<void>('/auth/logout', { refreshToken }));
}

export const MOCK_ROLE_HINT: Record<UserRole, string> = {
  user: 'Browse products & consult dermatologists',
  vendor: 'Manage products & track orders',
  dermatologist: 'Manage patients & consultations',
};
