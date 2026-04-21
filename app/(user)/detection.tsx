import React, { useState } from 'react';
import DetectionCameraScreen from '@features/detection/screens/DetectionCameraScreen';
import DetectionAnalyzingScreen from '@features/detection/screens/DetectionAnalyzingScreen';
import DetectionResultsScreen from '@features/detection/screens/DetectionResultsScreen';

type Phase = 'camera' | 'analyzing' | 'results';

export default function DetectionRoute() {
  const [phase, setPhase] = useState<Phase>('camera');
  const handleCapture = (_uri: string) => {
    // _uri available for backend ML pipeline integration
    setPhase('analyzing');
  };

  if (phase === 'analyzing') {
    return <DetectionAnalyzingScreen onDone={() => setPhase('results')} />;
  }
  if (phase === 'results') {
    return <DetectionResultsScreen onRescan={() => setPhase('camera')} />;
  }
  return <DetectionCameraScreen onCapture={handleCapture} />;
}
