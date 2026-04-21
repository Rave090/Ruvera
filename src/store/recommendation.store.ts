import { create } from 'zustand';
import type { SkinRecommendation } from '@features/detection/types';

interface RecommendationState {
  current: SkinRecommendation | null;
  history: SkinRecommendation[];
}

interface RecommendationActions {
  setRecommendation: (rec: SkinRecommendation) => void;
  clearCurrent: () => void;
  clearHistory: () => void;
}

type RecommendationStore = RecommendationState & RecommendationActions;

const HISTORY_LIMIT = 10;

const initialState: RecommendationState = {
  current: null,
  history: [],
};

export const useRecommendationStore = create<RecommendationStore>((set) => ({
  ...initialState,

  setRecommendation: (rec) =>
    set((state) => ({
      current: rec,
      history: [rec, ...state.history].slice(0, HISTORY_LIMIT),
    })),

  clearCurrent: () => set({ current: null }),

  clearHistory: () => set({ history: [] }),
}));

export const selectCurrentRecommendation = (s: RecommendationStore): SkinRecommendation | null =>
  s.current;
export const selectRecommendationHistory = (s: RecommendationStore): SkinRecommendation[] =>
  s.history;
