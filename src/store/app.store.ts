import { create } from 'zustand';

type ColorScheme = 'light' | 'dark' | 'system';

interface AppState {
  isOnline: boolean;
  colorScheme: ColorScheme;
  isInitialized: boolean;
  isSyncing: boolean;
}

interface AppActions {
  setOnline: (value: boolean) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setInitialized: (value: boolean) => void;
  setSyncing: (value: boolean) => void;
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  isOnline: true,
  colorScheme: 'system',
  isInitialized: false,
  isSyncing: false,

  setOnline: (value) => set({ isOnline: value }),
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
  setInitialized: (value) => set({ isInitialized: value }),
  setSyncing: (value) => set({ isSyncing: value }),
}));

// Selectors
export const selectIsOnline = (s: AppState) => s.isOnline;
export const selectColorScheme = (s: AppState) => s.colorScheme;
export const selectIsInitialized = (s: AppState) => s.isInitialized;
export const selectIsSyncing = (s: AppState) => s.isSyncing;
