import React from 'react';

import { AppFrame } from '../../src/components/AppFrame';
import { NowPlayingScreen } from '../../src/screens/NowPlayingScreen';
import { useSimulation } from '../../src/state/SimulationProvider';

export default function PlayerTabScreen() {
  const {
    micActive,
    handDetected,
    showPauseOverlay,
    isPlaying,
    progress,
    setIsPlaying,
  } = useSimulation();

  return (
    <AppFrame micActive={micActive}>
      <NowPlayingScreen
        handDetected={handDetected}
        showPauseOverlay={showPauseOverlay}
        isPlaying={isPlaying}
        progress={progress}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
      />
    </AppFrame>
  );
}
