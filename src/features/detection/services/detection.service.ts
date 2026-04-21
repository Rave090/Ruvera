import { preprocessImage } from '@ml/skinAnalysis/preprocessor';
import { detectFace } from '@ml/faceDetection/detector';
import { skinAnalyzer } from '@ml/skinAnalysis/analyzer';
import { processRawOutput } from '@ml/skinAnalysis/resultProcessor';
import { scanForSensitiveImageData } from '@utils/privacyUtils';
import type { FaceDetectionResult } from '@ml/faceDetection/types';
import type { SkinAnalysisResult, SkinAnalysisInput } from '@ml/skinAnalysis/types';
import type { Result } from '@services/api/types';

export interface DetectionPipelineOutput {
  face: FaceDetectionResult;
  analysis: SkinAnalysisResult;
}

/**
 * Orchestrates the full on-device detection pipeline:
 *   1. Safety guard — ensures no image data escapes as a raw payload
 *   2. Preprocess — resize + normalise to model input shape
 *   3. Face detection — returns bounding box; no image bytes leave this step
 *   4. Skin analysis — runs ML inference on the preprocessed tensor
 *   5. Result processing — maps raw scores to typed SkinAnalysisResult
 *
 * All image data is local-only. Only the returned SkinAnalysisResult may be
 * forwarded to other services (after anonymisation via privacyUtils).
 */
export async function runDetectionPipeline(
  imageUri: string,
): Promise<Result<DetectionPipelineOutput>> {
  // Safety guard: reject anything that looks like serialised image data.
  const guard = scanForSensitiveImageData(imageUri);
  if (!guard.safe) {
    return {
      success: false,
      error: { code: 'PRIVACY_VIOLATION', message: guard.reason, statusCode: 400 },
    };
  }

  let face: FaceDetectionResult;
  try {
    face = await detectFace(imageUri);
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'FACE_DETECTION_FAILED',
        message: err instanceof Error ? err.message : 'Face detection failed.',
        statusCode: 500,
      },
    };
  }

  if (!face.detected) {
    return {
      success: false,
      error: {
        code: 'NO_FACE_DETECTED',
        message: 'No face was detected in the image. Please retake the photo.',
        statusCode: 422,
      },
    };
  }

  let preprocessed: Awaited<ReturnType<typeof preprocessImage>>;
  try {
    preprocessed = await preprocessImage(imageUri);
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'PREPROCESS_FAILED',
        message: err instanceof Error ? err.message : 'Image preprocessing failed.',
        statusCode: 500,
      },
    };
  }

  const analyzerInput: SkinAnalysisInput = {
    imageUri,
    width: preprocessed.width,
    height: preprocessed.height,
  };

  let rawOutput: Awaited<ReturnType<typeof skinAnalyzer.analyze>>;
  try {
    rawOutput = await skinAnalyzer.analyze(analyzerInput);
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'ANALYSIS_FAILED',
        message: err instanceof Error ? err.message : 'Skin analysis failed.',
        statusCode: 500,
      },
    };
  }

  const analysis = processRawOutput(rawOutput);

  return { success: true, data: { face, analysis } };
}
