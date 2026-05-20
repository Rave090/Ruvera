import { useCallback } from 'react';
import {
  useDetectionStore,
  selectDetectionPhase,
  selectAnalysisResult,
  selectBackendResult,
  selectRoutine,
  selectDetectionError,
} from '../store/detection.store';
import { runDetectionPipeline } from '../services/detection.service';
import { submitSkinAnalysis, fetchLatestRoutine } from '../services/skinAnalysis.service';
import type { SubmitAnalysisBody } from '../types';

interface UseSkinAnalysisReturn {
  analyseImage: (imageUri: string) => Promise<void>;
  phase: 'idle' | 'detecting' | 'analysing' | 'complete' | 'error';
  errorMessage: string | null;
  resetSession: () => void;
}

export function useSkinAnalysis(): UseSkinAnalysisReturn {
  const phase = useDetectionStore(selectDetectionPhase);
  const errorMessage = useDetectionStore(selectDetectionError);

  const startDetection = useDetectionStore((s) => s.startDetection);
  const setAnalysisResult = useDetectionStore((s) => s.setAnalysisResult);
  const setBackendResult = useDetectionStore((s) => s.setBackendResult);
  const setError = useDetectionStore((s) => s.setError);
  const resetSession = useDetectionStore((s) => s.resetSession);

  const analyseImage = useCallback(
    async (imageUri: string): Promise<void> => {
      startDetection(imageUri);

      const pipelineResult = await runDetectionPipeline(imageUri);
      if (!pipelineResult.success) {
        setError(pipelineResult.error.message);
        return;
      }

      const { analysis, raw } = pipelineResult.data;
      setAnalysisResult(analysis);

      const body: SubmitAnalysisBody = {
        skinType: analysis.skinType,
        concerns: analysis.conditions.map((c) => c.condition),
        oiliness: raw.oilLevelScore,
        hydration: raw.hydrationScore,
        sensitivity: raw.sensitivityScore,
        acneScore: raw.acneScore,
        pigmentation: raw.pigmentationScore,
        wrinkleScore: parseFloat((1 - raw.textureScore).toFixed(3)),
        confidence: raw.confidence,
        analysedAt: analysis.analysedAt,
      };

      const apiResult = await submitSkinAnalysis(body);
      if (!apiResult.success) {
        setError(apiResult.error.message);
        return;
      }

      const routineResult = await fetchLatestRoutine();
      setBackendResult(
        apiResult.data,
        routineResult.success ? routineResult.data : null,
      );
    },
    [startDetection, setAnalysisResult, setBackendResult, setError],
  );

  return { analyseImage, phase, errorMessage, resetSession };
}

export { selectAnalysisResult, selectBackendResult, selectRoutine };
