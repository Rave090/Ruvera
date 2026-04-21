import type { GradientUpdate } from './trainer';

export interface AggregatedPayload {
  modelVersion: string;
  updates: GradientUpdate[];
  sampleCount: number;
  timestamp: string;
}

/**
 * Packages local gradient updates into the payload shape expected by the FL server.
 * No raw training data is included — only DP-noised gradients.
 *
 * STUB: real aggregation logic pending trainer implementation.
 */
export function aggregateGradients(
  updates: GradientUpdate[],
  modelVersion: string,
): AggregatedPayload {
  return {
    modelVersion,
    updates,
    sampleCount: updates.length,
    timestamp: new Date().toISOString(),
  };
}
