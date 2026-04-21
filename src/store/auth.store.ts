import { create } from 'zustand';

export type UserRole = 'user' | 'vendor' | 'dermatologist';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  hasCompletedOnboarding: boolean;
}

interface AuthActions {
  setCredentials: (params: {
    accessToken: string;
    refreshToken: string;
    userProfile: UserProfile;
  }) => void;
  clearCredentials: () => void;
  setHydrating: (value: boolean) => void;
  completeOnboarding: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  userProfile: null,
  isAuthenticated: false,
  isHydrating: true,
  hasCompletedOnboarding: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setCredentials: ({ accessToken, refreshToken, userProfile }) =>
    set({ accessToken, refreshToken, userProfile, isAuthenticated: true }),

  clearCredentials: () =>
    set({ ...initialState, isHydrating: false, hasCompletedOnboarding: true }),

  setHydrating: (value) => set({ isHydrating: value }),

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));

// Selectors
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectUserProfile = (s: AuthState) => s.userProfile;
export const selectUserRole = (s: AuthState) => s.userProfile?.role ?? null;
export const selectIsHydrating = (s: AuthState) => s.isHydrating;
export const selectHasCompletedOnboarding = (s: AuthState) => s.hasCompletedOnboarding;
