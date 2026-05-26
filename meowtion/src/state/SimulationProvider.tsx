import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Audio } from 'expo-av';

import type { DeviceSong } from '../hooks/useDeviceSongs';
import { LibraryTab } from '../types/ui';

type SimulationContextValue = {
  micActive: boolean;
  handDetected: boolean;
  showPauseOverlay: boolean;
  isPlaying: boolean;
  isLoadingTrack: boolean;
  progress: number;
  playbackDurationMillis: number;
  currentSong: DeviceSong | null;
  playbackError: string | null;
  libraryTab: LibraryTab;
  playSong: (song: DeviceSong, queue: DeviceSong[], index: number) => Promise<void>;
  togglePlayback: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  seekBy: (millis: number) => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setLibraryTab: React.Dispatch<React.SetStateAction<LibraryTab>>;
};

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [micActive, setMicActive] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const [showPauseOverlay, setShowPauseOverlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSong, setCurrentSong] = useState<DeviceSong | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [playbackPositionMillis, setPlaybackPositionMillis] = useState(0);
  const [playbackDurationMillis, setPlaybackDurationMillis] = useState(0);
  const [queue, setQueue] = useState<DeviceSong[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('Musicas');
  const soundRef = useRef<Audio.Sound | null>(null);
  const playNextRef = useRef<(() => Promise<void>) | null>(null);
  const isSeekingRef = useRef(false);
  const pendingSeekRef = useRef<number | null>(null);

  const unloadCurrentSound = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // Ignore unload errors when switching tracks quickly.
      }

      soundRef.current = null;
    }
  }, []);

  useEffect(() => {
    void Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: 2,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeAndroid: 2,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      void unloadCurrentSound();
    };
  }, [unloadCurrentSound]);

  const loadTrack = useCallback(
    async (song: DeviceSong, nextQueue: DeviceSong[], nextIndex: number) => {
      setIsLoadingTrack(true);
      setPlaybackError(null);
      setCurrentSong(song);
      setQueue(nextQueue);
      setCurrentIndex(nextIndex);
      setPlaybackPositionMillis(0);
      setPlaybackDurationMillis(0);

      try {
        await unloadCurrentSound();

        const { sound } = await Audio.Sound.createAsync(
          { uri: song.uri },
          { shouldPlay: true, progressUpdateIntervalMillis: 500 },
          (status) => {
            if (!status.isLoaded) {
              return;
            }

            setIsPlaying(status.isPlaying);
            setPlaybackPositionMillis(status.positionMillis);
            setPlaybackDurationMillis(status.durationMillis ?? 0);

            if (status.didJustFinish && queue.length > 0) {
              void playNextRef.current?.();
            }
          }
        );

        soundRef.current = sound;
        setIsPlaying(true);
      } catch {
        setPlaybackError('Nao foi possivel tocar a faixa selecionada.');
        setIsPlaying(false);
      } finally {
        setIsLoadingTrack(false);
      }
    },
    [queue.length, unloadCurrentSound]
  );

  const playNext = useCallback(async () => {
    if (!queue.length) {
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      return;
    }

    await loadTrack(queue[nextIndex], queue, nextIndex);
  }, [currentIndex, loadTrack, queue]);

  const playPrevious = useCallback(async () => {
    if (!queue.length) {
      return;
    }

    const previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      return;
    }

    await loadTrack(queue[previousIndex], queue, previousIndex);
  }, [currentIndex, loadTrack, queue]);

  const togglePlayback = useCallback(async () => {
    if (!soundRef.current) {
      return;
    }

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) {
      return;
    }

    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      return;
    }

    await soundRef.current.playAsync();
    setIsPlaying(true);
  }, []);

  const seekBy = useCallback(async (millis: number) => {
    if (!soundRef.current) {
      return;
    }

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) {
      return;
    }

    const nextPosition = Math.max(0, Math.min(status.durationMillis ?? 0, status.positionMillis + millis));
    await soundRef.current.setPositionAsync(nextPosition);
    setPlaybackPositionMillis(nextPosition);
  }, []);

  const performSeek = useCallback(async (millis: number) => {
    if (!soundRef.current) {
      return;
    }

    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) {
      return;
    }

    const nextPosition = Math.max(0, Math.min(status.durationMillis ?? 0, millis));
    try {
      isSeekingRef.current = true;
      await soundRef.current.setPositionAsync(nextPosition);
      setPlaybackPositionMillis(nextPosition);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes('Seeking interrupted')) {
        setPlaybackError('Nao foi possivel atualizar a posicao da musica.');
      }
    } finally {
      isSeekingRef.current = false;

      const pendingSeek = pendingSeekRef.current;
      pendingSeekRef.current = null;
      if (pendingSeek !== null && pendingSeek !== nextPosition) {
        void performSeek(pendingSeek);
      }
    }
  }, []);

  const seekTo = useCallback(
    async (millis: number) => {
      if (isSeekingRef.current) {
        pendingSeekRef.current = millis;
        return;
      }

      await performSeek(millis);
    },
    [performSeek]
  );

  const playSong = useCallback(
    async (song: DeviceSong, nextQueue: DeviceSong[], nextIndex: number) => {
      await loadTrack(song, nextQueue, nextIndex);
    },
    [loadTrack]
  );

  useEffect(() => {
    playNextRef.current = playNext;
  }, [playNext]);

  useEffect(() => {
    const micTimer = setInterval(() => {
      setMicActive((prev) => !prev);
    }, 3200);

    return () => clearInterval(micTimer);
  }, []);

  useEffect(() => {
    return () => {
      setShowPauseOverlay(false);
    };
  }, []);

  useEffect(() => {
    if (playbackDurationMillis <= 0) {
      setProgress(0);
      return;
    }

    const nextProgress = Math.min(
      100,
      Math.round((playbackPositionMillis / playbackDurationMillis) * 100)
    );
    setProgress(nextProgress);
  }, [playbackDurationMillis, playbackPositionMillis]);

  const value = useMemo(
    () => ({
      micActive,
      handDetected,
      showPauseOverlay,
      isPlaying,
      isLoadingTrack,
      progress,
      playbackDurationMillis,
      currentSong,
      playbackError,
      libraryTab,
      playSong,
      togglePlayback,
      playNext,
      playPrevious,
      seekBy,
      seekTo,
      setIsPlaying,
      setLibraryTab,
    }),
    [
      micActive,
      handDetected,
      showPauseOverlay,
      isPlaying,
      isLoadingTrack,
      progress,
      playbackDurationMillis,
      currentSong,
      playbackError,
      libraryTab,
      playSong,
      togglePlayback,
      playNext,
      playPrevious,
      seekBy,
      seekTo,
    ]
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
