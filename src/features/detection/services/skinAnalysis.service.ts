import { apiClient, apiRequest } from '@services/api/client';
import type { Result } from '@services/api/types';
import type { SkinAnalysisApiResult, SkinRoutineApiResult, SubmitAnalysisBody } from '../types';

export async function submitSkinAnalysis(
  body: SubmitAnalysisBody,
): Promise<Result<SkinAnalysisApiResult>> {
  return apiRequest(() =>
    apiClient.post<SkinAnalysisApiResult>('/skin-analysis', body),
  );
}

export async function fetchLatestRoutine(): Promise<Result<SkinRoutineApiResult | null>> {
  const result = await apiRequest<SkinRoutineApiResult>(() =>
    apiClient.get('/skin-analysis/latest/routine'),
  );
  if (!result.success) return result;
  return { success: true, data: result.data || null };
}
