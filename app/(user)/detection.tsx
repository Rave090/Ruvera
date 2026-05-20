import React, { useState, useEffect, useCallback } from 'react';
import DetectionCameraScreen from '@features/detection/screens/DetectionCameraScreen';
import DetectionAnalyzingScreen from '@features/detection/screens/DetectionAnalyzingScreen';
import DetectionResultsScreen from '@features/detection/screens/DetectionResultsScreen';
import { useSkinAnalysis } from '@features/detection/hooks/useSkinAnalysis';
import { useDetectionStore, selectDetectionPhase } from '@features/detection/store/detection.store';

type RoutePhase = 'camera' | 'analyzing' | 'results';

export default function DetectionRoute() {
  const [routePhase, setRoutePhase] = useState<RoutePhase>('camera');
  const [animDone, setAnimDone] = useState(false);

  const storePhase = useDetectionStore(selectDetectionPhase);
  const { analyseImage, resetSession } = useSkinAnalysis();

  const handleCapture = useCallback(
    (uri: string) => {
      setRoutePhase('analyzing');
      setAnimDone(false);
      analyseImage(uri);
    },
    [analyseImage],
  );

  // Advance to results when both the animation and API pipeline are complete.
  useEffect(() => {
    if (routePhase !== 'analyzing') return;
    const asyncDone = storePhase === 'complete' || storePhase === 'error';
    if (!asyncDone || !animDone) return;
    if (storePhase === 'error') {
      setRoutePhase('camera');
    } else {
      setRoutePhase('results');
    }
  }, [routePhase, storePhase, animDone]);

  const handleRescan = useCallback(() => {
    resetSession();
    setRoutePhase('camera');
    setAnimDone(false);
  }, [resetSession]);

  if (routePhase === 'analyzing') {
    return <DetectionAnalyzingScreen onDone={() => setAnimDone(true)} />;
  }
  if (routePhase === 'results') {
    return <DetectionResultsScreen onRescan={handleRescan} />;
  }
  return <DetectionCameraScreen onCapture={handleCapture} />;
}
