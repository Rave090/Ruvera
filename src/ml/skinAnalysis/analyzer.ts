/**
 * Skin analysis inference engine.
 *
 * Abstraction layer: the SkinAnalyzer interface is the only contract the rest
 * of the app depends on. Swap MockSkinAnalyzer for TFLiteAnalyzer when the
 * model is ready — nothing else changes.
 *
 * Real implementation: load a .tflite flatbuffer via react-native-fast-tflite
 * or @tensorflow/tfjs-react-native, run inference on the preprocessed tensor,
 * read output indices from the model's output tensor.
 */
import type { SkinAnalysisInput, RawMLOutput } from './types';

interface SkinAnalyzer {
  analyze(input: SkinAnalysisInput): Promise<RawMLOutput>;
}

function simpleHash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return Math.abs(h);
}

function norm(hash: number, offset: number, spread: number): number {
  return Math.min(1, Math.max(0, ((hash >> offset) & 0xff) / 255 * spread));
}

class MockSkinAnalyzer implements SkinAnalyzer {
  async analyze(input: SkinAnalysisInput): Promise<RawMLOutput> {
    await new Promise(res => setTimeout(res, 800));

    const h = simpleHash(input.imageUri);

    return {
      acneScore: norm(h, 0, 0.7),
      oilLevelScore: norm(h, 4, 0.9),
      pigmentationScore: norm(h, 8, 0.6),
      hydrationScore: norm(h, 12, 1.0),
      textureScore: norm(h, 16, 1.0),
      uniformityScore: norm(h, 20, 1.0),
      sensitivityScore: norm(h, 24, 0.5),
      confidence: 0.82 + (h % 15) / 100,
    };
  }
}

// Single shared instance — replace with TFLiteAnalyzer when model is integrated.
export const skinAnalyzer: SkinAnalyzer = new MockSkinAnalyzer();
