import React from 'react';

import { AppFrame } from '../../src/components/AppFrame';
import { LibraryScreen } from '../../src/screens/LibraryScreen';
import { useSimulation } from '../../src/state/SimulationProvider';

export default function LibraryTabScreen() {
  const { micActive, libraryTab, setLibraryTab } = useSimulation();

  return (
    <AppFrame micActive={micActive}>
      <LibraryScreen
        libraryTab={libraryTab}
        onChangeLibraryTab={setLibraryTab}
      />
    </AppFrame>
  );
}
