/**
 * Image preprocessing pipeline.
 *
 * Real implementation:
 *   1. Use expo-image-manipulator to resize + crop to 224×224
 *   2. Load pixel data via expo-file-system
 *   3. Normalise values to [0, 1] and pack into Float32Array
 *   4. Wrap in a tf.Tensor3D for TFLite inference
 *
 * All processing is on-device. The Float32Array / tensor never leaves the
 * device — it is discarded immediately after inference.
 */

export interface PreprocessedImage {
  width: number;
  height: number;
  /**
   * Normalised pixel buffer [R, G, B, R, G, B, ...] in range [0, 1].
   * null in mock mode; Float32Array in production.
   */
  normalizedData: Float32Array | null;
}

const TARGET_SIZE = 224;

export async function preprocessImage(imageUri: string): Promise<PreprocessedImage> {
  // Production steps (commented-out to avoid heavy deps in Phase 4):
  //
  // const manipulated = await ImageManipulator.manipulateAsync(
  //   imageUri,
  //   [{ resize: { width: TARGET_SIZE, height: TARGET_SIZE } }],
  //   { compress: 1, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  // );
  // const base64 = manipulated.base64!;
  // const raw = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  // const normalized = new Float32Array(raw.length);
  // for (let i = 0; i < raw.length; i++) normalized[i] = raw[i] / 255;
  // return { width: TARGET_SIZE, height: TARGET_SIZE, normalizedData: normalized };

  void imageUri;
  return { width: TARGET_SIZE, height: TARGET_SIZE, normalizedData: null };
}
