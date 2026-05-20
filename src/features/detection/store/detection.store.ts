import { create } from 'zustand';
import type { SkinAnalysisResult } from '@ml/skinAnalysis/types';
import type { SkinAnalysisApiResult, SkinRoutineApiResult } from '../types';

interface DetectionState {
  phase: 'idle' | 'detecting' | 'analysing' | 'complete' | 'error';
  analysisResult: SkinAnalysisResult | null;
  backendResult: SkinAnalysisApiResult | null;
  routine: SkinRoutineApiResult | null;
  /** Local URI only — cleared immediately after analysis completes. Never persisted. */
  localImageUri: string | null;
  errorMessage: string | null;
}

interface DetectionActions {
  startDetection: (imageUri: string) => void;
  setAnalysisResult: (result: SkinAnalysisResult) => void;
  setBackendResult: (result: SkinAnalysisApiResult, routine: SkinRoutineApiResult | null) => void;
  setError: (message: string) => void;
  clearImageUri: () => void;
  resetSession: () => void;
}

type DetectionStore = DetectionState & DetectionActions;

const initialState: DetectionState = {
  phase: 'idle',
  analysisResult: null,
  backendResult: null,
  routine: null,
  localImageUri: null,
  errorMessage: null,
};

export const useDetectionStore = create<DetectionStore>((set) => ({
  ...initialState,

  startDetection: (imageUri) =>
    set({ phase: 'detecting', localImageUri: imageUri, errorMessage: null }),

  setAnalysisResult: (result) =>
    set({ phase: 'analysing', analysisResult: result, localImageUri: null }),

  setBackendResult: (result, routine) =>
    set({ phase: 'complete', backendResult: result, routine }),

  setError: (message) =>
    set({ phase: 'error', errorMessage: message, localImageUri: null }),

  clearImageUri: () => set({ localImageUri: null }),

  resetSession: () => set(initialState),
}));

export const selectDetectionPhase = (s: DetectionStore): DetectionState['phase'] => s.phase;
export const selectAnalysisResult = (s: DetectionStore): SkinAnalysisResult | null => s.analysisResult;
export const selectBackendResult = (s: DetectionStore): SkinAnalysisApiResult | null => s.backendResult;
export const selectRoutine = (s: DetectionStore): SkinRoutineApiResult | null => s.routine;
export const selectDetectionError = (s: DetectionStore): string | null => s.errorMessage;
