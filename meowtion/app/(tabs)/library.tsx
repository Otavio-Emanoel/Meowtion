import React from 'react';
import { useRouter } from 'expo-router';

import { AppFrame } from '../../src/components/AppFrame';
import { LibraryScreen } from '../../src/screens/LibraryScreen';
import { DeviceSong } from '../../src/hooks/useDeviceSongs';
import { useSimulation } from '../../src/state/SimulationProvider';

export default function LibraryTabScreen() {
  const router = useRouter();
  const { micActive, libraryTab, setLibraryTab, playSong } = useSimulation();

  const handleSelectSong = async (song: DeviceSong, queue: DeviceSong[], index: number) => {
    await playSong(song, queue, index);
    router.navigate('/player');
  };

  return (
    <AppFrame micActive={micActive}>
      <LibraryScreen
        libraryTab={libraryTab}
        onChangeLibraryTab={setLibraryTab}
        onSelectSong={handleSelectSong}
      />
    </AppFrame>
  );
}
