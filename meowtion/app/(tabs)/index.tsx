import React from 'react';

import { AppFrame } from '../../src/components/AppFrame';
import { DashboardScreen } from '../../src/screens/DashboardScreen';
import { useSimulation } from '../../src/state/SimulationProvider';

export default function HomeTabScreen() {
  const { micActive } = useSimulation();

  return (
    <AppFrame micActive={micActive}>
      <DashboardScreen micActive={micActive} />
    </AppFrame>
  );
}
