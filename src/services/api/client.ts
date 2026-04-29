import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import type { ApiError, Result } from './types';

const BASE_URL = (() => {
  if (!__DEV__) {
    return process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.ruvera.app/v1';
  }

  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }

  // In Expo Go on a physical device, debuggerHost is the Metro bundler address
  // ("192.168.x.x:8081"). The API server lives on the same machine, so we
  // reuse that LAN IP instead of localhost (which resolves to the device itself).
  const metroHost = Constants.expoGoConfig?.debuggerHost?.split(':')[0];
  if (metroHost && metroHost !== 'localhost' && metroHost !== '127.0.0.1') {
    return `http://${metroHost}:8080/api/v1`;
  }

  // Android emulator: 10.0.2.2 is the alias for the host machine.
  const loopback = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${loopback}:8080/api/v1`;
})();
const REQUEST_TIMEOUT = 15_000;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 500;

const SECURE_STORE_KEYS = {
  accessToken: 'ruvera_access_token',
  refreshToken: 'ruvera_refresh_token',
} as const;

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function drainQueue(token: string | null): void {
  refreshQueue.forEach((resolve) => resolve(token));
  refreshQueue = [];
}

async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_STORE_KEYS.accessToken);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync(SECURE_STORE_KEYS.refreshToken);
  if (!refreshToken) return null;

  try {
    const response = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${BASE_URL}/auth/refresh`,
      { refreshToken },
    );
    const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;
    await Promise.all([
      SecureStore.setItemAsync(SECURE_STORE_KEYS.accessToken, newToken),
      SecureStore.setItemAsync(SECURE_STORE_KEYS.refreshToken, newRefreshToken),
    ]);
    return newToken;
  } catch {
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.accessToken);
    await SecureStore.deleteItemAsync(SECURE_STORE_KEYS.refreshToken);
    return null;
  }
}

function buildApiError(error: AxiosError): ApiError {
  const responseData = error.response?.data as Record<string, unknown> | undefined;

  return {
    statusCode: error.response?.status ?? 0,
    code: (responseData?.code as string) ?? error.code ?? 'UNKNOWN_ERROR',
    message:
      (responseData?.message as string) ??
      error.message ??
      'An unexpected error occurred.',
    details: responseData?.details,
  };
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const skipAuth = (config as InternalAxiosRequestConfig & { skipAuth?: boolean }).skipAuth;
      if (!skipAuth) {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retryCount?: number;
        _skipRefresh?: boolean;
      };

      if (!originalRequest) return Promise.reject(buildApiError(error));

      // Token refresh on 401
      if (error.response?.status === 401 && !originalRequest._skipRefresh) {
        originalRequest._skipRefresh = true;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push((token) => {
              if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(client(originalRequest));
              } else {
                reject(buildApiError(error));
              }
            });
          });
        }

        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        drainQueue(newToken);

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        }

        return Promise.reject(buildApiError(error));
      }

      // Retry on network errors or 5xx with exponential backoff
      const retryCount = originalRequest._retryCount ?? 0;
      const isRetryable =
        !error.response || (error.response.status >= 500 && error.response.status < 600);

      if (isRetryable && retryCount < MAX_RETRIES) {
        originalRequest._retryCount = retryCount + 1;
        const delay = RETRY_BASE_DELAY * 2 ** retryCount;
        await new Promise((r) => setTimeout(r, delay));
        return client(originalRequest);
      }

      return Promise.reject(buildApiError(error));
    },
  );

  return client;
}

export const apiClient = createApiClient();

export async function apiRequest<T>(
  requestFn: () => Promise<AxiosResponse<T>>,
): Promise<Result<T>> {
  try {
    const response = await requestFn();
    return { success: true, data: response.data };
  } catch (error) {
    if ((error as ApiError).code !== undefined) {
      return { success: false, error: error as ApiError };
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.',
        statusCode: 0,
      },
    };
  }
}
