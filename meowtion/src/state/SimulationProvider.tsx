import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { LibraryTab } from '../types/ui';

type SimulationContextValue = {
  micActive: boolean;
  handDetected: boolean;
  showPauseOverlay: boolean;
  isPlaying: boolean;
  progress: number;
  libraryTab: LibraryTab;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setLibraryTab: React.Dispatch<React.SetStateAction<LibraryTab>>;
};

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [micActive, setMicActive] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('Musicas');

  useEffect(() => {
    const micTimer = setInterval(() => {
      setMicActive((prev) => !prev);
    }, 3200);

    return () => clearInterval(micTimer);
  }, []);

  useEffect(() => {
    const handTimer = setInterval(() => {
      setHandDetected((prev) => {
        const next = !prev;
        if (next) {
          setShowPauseOverlay(true);
          setIsPlaying(false);
          setTimeout(() => setShowPauseOverlay(false), 900);
        }
        return next;
      });
    }, 4500);

    return () => clearInterval(handTimer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (!isPlaying) {
          return prev;
        }
        const next = prev + 1;
        return next > 100 ? 0 : next;
      });
    }, 900);

    return () => clearInterval(progressTimer);
  }, [isPlaying]);

  const value = useMemo(
    () => ({
      micActive,
      handDetected,
      showPauseOverlay,
      isPlaying,
      progress,
      libraryTab,
      setIsPlaying,
      setLibraryTab,
    }),
    [micActive, handDetected, showPauseOverlay, isPlaying, progress, libraryTab]
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const context = useContext(SimulationContext);

  if (!context) {
    throw new Error('useSimulation must be used inside SimulationProvider');
  }

  return context;
}
