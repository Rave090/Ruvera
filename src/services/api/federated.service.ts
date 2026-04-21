import { apiClient } from './client';
import type { Result } from './types';
import { checkFLConsent } from '@ml/federatedLearning/consentGate';
import { aggregateGradients } from '@ml/federatedLearning/aggregator';
import type { GradientUpdate } from '@ml/federatedLearning/trainer';

export interface FLServerAck {
  accepted: boolean;
  nextModelVersion: string;
}

/**
 * Submits DP-noised gradient updates to the FL aggregation server.
 * Consent is verified here as a second safety check (primary check is in trainer.ts).
 * Raw training data and face images are never included in the payload.
 */
export async function submitGradientUpdate(
  updates: GradientUpdate[],
  modelVersion: string,
): Promise<Result<FLServerAck>> {
  const consent = await checkFLConsent();
  if (!consent.granted) {
    return {
      success: false,
      error: {
        code: 'FL_CONSENT_DENIED',
        message: consent.reason ?? 'Federated learning consent not granted.',
        statusCode: 403,
      },
    };
  }

  const payload = aggregateGradients(updates, modelVersion);
  return apiClient.post<FLServerAck>('/ml/federated/update', payload);
}
