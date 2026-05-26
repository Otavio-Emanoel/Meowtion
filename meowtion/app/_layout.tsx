import React from 'react';
import { Stack } from 'expo-router';

import { SimulationProvider } from '../src/state/SimulationProvider';

export default function RootLayout() {
  return (
    <SimulationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SimulationProvider>
  );
}
