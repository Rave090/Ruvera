export interface FaceBoundingBox {
  x: number;      // 0–1 normalised
  y: number;      // 0–1 normalised
  width: number;  // 0–1 normalised
  height: number; // 0–1 normalised
}

export interface FaceDetectionResult {
  detected: boolean;
  boundingBox: FaceBoundingBox | null;
  confidence: number; // 0–1
}
