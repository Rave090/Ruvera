/**
 * Face detection abstraction.
 *
 * Real implementation: swap the body of `detectFace` to call a Vision Camera
 * frame processor or a TFLite face-detection model. The interface and return
 * type must not change — only this file changes.
 */
import type { FaceDetectionResult } from './types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function detectFace(imageUri: string): Promise<FaceDetectionResult> {
  // Production: run TFLite face detection model on the image.
  // The model output stays on-device; only the bounding box leaves this function.
  await delay(400);

  // Deterministically vary output based on the URI so different images
  // produce slightly different results in the mock.
  const charSum = imageUri.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const confidence = 0.88 + (charSum % 10) * 0.01;

  return {
    detected: true,
    boundingBox: {
      x: 0.2 + (charSum % 5) * 0.01,
      y: 0.1 + (charSum % 4) * 0.01,
      width: 0.55,
      height: 0.65,
    },
    confidence,
  };
}
