import { useCallback } from 'react';
import {
  useDetectionStore,
  selectDetectionPhase,
  selectAnalysisResult,
  selectDetectionError,
} from '../store/detection.store';
import {
  useRecommendationStore,
  selectCurrentRecommendation,
} from '@store/recommendation.store';
import { runDetectionPipeline } from '../services/detection.service';
import { generateRecommendations } from '../services/recommendation.service';
import type { SkinAnalysisResult } from '@ml/skinAnalysis/types';
import type { SkinRecommendation } from '../types';

interface UseSkinAnalysisReturn {
  analyseImage: (imageUri: string) => Promise<void>;
  phase: 'idle' | 'detecting' | 'analysing' | 'complete' | 'error';
  analysisResult: SkinAnalysisResult | null;
  recommendation: SkinRecommendation | null;
  errorMessage: string | null;
  resetSession: () => void;
}

export function useSkinAnalysis(): UseSkinAnalysisReturn {
  const phase = useDetectionStore(selectDetectionPhase);
  const analysisResult = useDetectionStore(selectAnalysisResult);
  const errorMessage = useDetectionStore(selectDetectionError);
  const recommendation = useRecommendationStore(selectCurrentRecommendation);

  const startDetection = useDetectionStore((s) => s.startDetection);
  const setAnalysisResult = useDetectionStore((s) => s.setAnalysisResult);
  const setError = useDetectionStore((s) => s.setError);
  const detectionReset = useDetectionStore((s) => s.resetSession);
  const setRecommendation = useRecommendationStore((s) => s.setRecommendation);
  const clearCurrent = useRecommendationStore((s) => s.clearCurrent);

  const analyseImage = useCallback(
    async (imageUri: string): Promise<void> => {
      startDetection(imageUri);
      const pipelineResult = await runDetectionPipeline(imageUri);
      if (!pipelineResult.success) {
        setError(pipelineResult.error.message);
        return;
      }
      const { analysis } = pipelineResult.data;
      setAnalysisResult(analysis);
      setRecommendation(generateRecommendations(analysis));
    },
    [startDetection, setAnalysisResult, setError, setRecommendation],
  );

  const resetSession = useCallback(() => {
    detectionReset();
    clearCurrent();
  }, [detectionReset, clearCurrent]);

  return { analyseImage, phase, analysisResult, recommendation, errorMessage, resetSession };
}
