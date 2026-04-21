import { create } from 'zustand';
import type { SkinAnalysisResult } from '@ml/skinAnalysis/types';

interface DetectionState {
  phase: 'idle' | 'detecting' | 'analysing' | 'complete' | 'error';
  analysisResult: SkinAnalysisResult | null;
  /** Local URI only — cleared immediately after analysis completes. Never persisted. */
  localImageUri: string | null;
  errorMessage: string | null;
}

interface DetectionActions {
  startDetection: (imageUri: string) => void;
  setAnalysing: () => void;
  setAnalysisResult: (result: SkinAnalysisResult) => void;
  setError: (message: string) => void;
  clearImageUri: () => void;
  resetSession: () => void;
}

type DetectionStore = DetectionState & DetectionActions;

const initialState: DetectionState = {
  phase: 'idle',
  analysisResult: null,
  localImageUri: null,
  errorMessage: null,
};

export const useDetectionStore = create<DetectionStore>((set) => ({
  ...initialState,

  startDetection: (imageUri) =>
    set({ phase: 'detecting', localImageUri: imageUri, errorMessage: null }),

  setAnalysing: () => set({ phase: 'analysing' }),

  setAnalysisResult: (result) =>
    set({ phase: 'complete', analysisResult: result, localImageUri: null }),

  setError: (message) =>
    set({ phase: 'error', errorMessage: message, localImageUri: null }),

  clearImageUri: () => set({ localImageUri: null }),

  resetSession: () => set(initialState),
}));

export const selectDetectionPhase = (s: DetectionStore): DetectionState['phase'] => s.phase;
export const selectAnalysisResult = (s: DetectionStore): SkinAnalysisResult | null => s.analysisResult;
export const selectDetectionError = (s: DetectionStore): string | null => s.errorMessage;
