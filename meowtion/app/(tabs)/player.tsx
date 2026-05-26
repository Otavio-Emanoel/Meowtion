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
    playbackDurationMillis,
    currentSong,
    isLoadingTrack,
    playbackError,
    togglePlayback,
    playNext,
    playPrevious,
    seekBy,
    seekTo,
  } = useSimulation();

  return (
    <AppFrame micActive={micActive}>
      <NowPlayingScreen
        handDetected={handDetected}
        showPauseOverlay={showPauseOverlay}
        isPlaying={isPlaying}
        progress={progress}
        playbackDurationMillis={playbackDurationMillis}
        currentSong={currentSong}
        isLoadingTrack={isLoadingTrack}
        playbackError={playbackError}
        onTogglePlay={togglePlayback}
        onNext={playNext}
        onPrevious={playPrevious}
        onSeekForward={() => void seekBy(15000)}
        onSeekBackward={() => void seekBy(-15000)}
        onSeekTo={(millis) => void seekTo(millis)}
      />
    </AppFrame>
  );
}
