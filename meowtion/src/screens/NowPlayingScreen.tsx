import React, { useMemo, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '../components/GlassSurface';
import { COLORS } from '../theme/colors';
import { DeviceSong } from '../hooks/useDeviceSongs';

type NowPlayingScreenProps = {
  handDetected: boolean;
  showPauseOverlay: boolean;
  isPlaying: boolean;
  progress: number;
  playbackDurationMillis: number;
  currentSong: DeviceSong | null;
  isLoadingTrack: boolean;
  playbackError: string | null;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onSeekTo: (millis: number) => void;
};

export function NowPlayingScreen({
  handDetected,
  showPauseOverlay,
  isPlaying,
  progress,
  playbackDurationMillis,
  currentSong,
  isLoadingTrack,
  playbackError,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeekForward,
  onSeekBackward,
  onSeekTo,
}: NowPlayingScreenProps) {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const songTitle = currentSong?.title ?? 'Selecione uma musica na Library';
  const songArtist = currentSong?.source === 'drive' ? 'Google Drive' : 'Dispositivo';
  const durationLabel = currentSong ? (currentSong.source === 'drive' ? 'Faixa local do cache' : 'Faixa do dispositivo') : 'Sem musica selecionada';
  const playStateLabel = isLoadingTrack
    ? 'Carregando...'
    : playbackError
      ? 'Erro na reproducao'
      : isPlaying
        ? 'Tocando agora'
        : 'Pausado';

  const displayProgress = scrubProgress ?? progress;
  const displayProgressRatio = Math.min(1, Math.max(0, displayProgress / 100));
  const displayProgressWidth = trackWidth > 0 ? trackWidth * displayProgressRatio : 0;

  const updateScrubProgressAtX = (x: number) => {
    if (trackWidth <= 0) {
      return;
    }

    const ratio = Math.min(1, Math.max(0, x / trackWidth));
    const nextProgress = ratio * 100;
    setScrubProgress(nextProgress);
  };

  const commitSeekAtX = (x: number) => {
    if (trackWidth <= 0 || playbackDurationMillis <= 0) {
      return;
    }

    const ratio = Math.min(1, Math.max(0, x / trackWidth));
    const targetMillis = Math.round(ratio * playbackDurationMillis);
    onSeekTo(targetMillis);
  };

  const progressPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          setIsScrubbing(true);
          updateScrubProgressAtX(event.nativeEvent.locationX);
        },
        onPanResponderMove: (event) => {
          updateScrubProgressAtX(event.nativeEvent.locationX);
        },
        onPanResponderRelease: (event) => {
          commitSeekAtX(event.nativeEvent.locationX);
          setIsScrubbing(false);
          setScrubProgress(null);
        },
        onPanResponderTerminate: () => {
          setIsScrubbing(false);
          setScrubProgress(null);
        },
      }),
    [playbackDurationMillis, onSeekTo, trackWidth]
  );

  return (
    <View style={[styles.screenContent, styles.playerWrap]}>
      <View style={[styles.gestureBorder, handDetected && styles.gestureBorderActive]} />

      <GlassSurface style={styles.heroCard} intensity={36}>
        <View style={styles.albumArt}>
          <Text style={styles.albumEmoji}>{currentSong?.source === 'drive' ? 'DRV' : '♪'}</Text>
        </View>
        <View style={styles.heroMeta}>
          <Text numberOfLines={2} style={styles.albumTitle}>
            {songTitle}
          </Text>
          <Text style={styles.albumArtist}>{songArtist}</Text>
          <Text style={styles.songKind}>{durationLabel}</Text>
        </View>
      </GlassSurface>

      <View style={styles.progressContainer}>
        <View style={styles.progressMeta}>
          <Text style={styles.progressHint}>{playStateLabel}</Text>
          <Text style={styles.progressText}>{isScrubbing ? `${Math.round(displayProgress)}%` : `${progress}%`}</Text>
        </View>
        <View
          onLayout={(event) => {
            setTrackWidth(event.nativeEvent.layout.width);
          }}
          style={styles.progressTrack}
          {...progressPanResponder.panHandlers}
        >
          <View style={[styles.progressFill, { width: displayProgressWidth }]} />
          <View
            style={[
              styles.progressThumb,
              {
                left: Math.max(0, displayProgressWidth - 10),
              },
            ]}
          />
        </View>
      </View>

      {playbackError && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{playbackError}</Text>
        </View>
      )}

      <View style={styles.controlsRow}>
        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
          onPress={onPrevious}
        >
          <Text style={styles.controlText}>|&lt;&lt;</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            styles.controlPrimary,
            pressed && styles.controlPrimaryPressed,
          ]}
          onPress={onTogglePlay}
        >
          <Text style={[styles.controlText, styles.controlPrimaryText]}>
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}
          onPress={onNext}
        >
          <Text style={styles.controlText}>&gt;&gt;|</Text>
        </Pressable>
      </View>

      <View style={styles.secondaryActionsRow}>
        <Pressable
          style={({ pressed }) => [styles.secondaryActionButton, pressed && styles.controlPressed]}
          onPress={onSeekBackward}
        >
          <Text style={styles.secondaryActionText}>-15s</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryActionButton, pressed && styles.controlPressed]}
          onPress={onSeekForward}
        >
          <Text style={styles.secondaryActionText}>+15s</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryActionButton, pressed && styles.controlPressed]}
          onPress={onPrevious}
        >
          <Text style={styles.secondaryActionText}>Prev</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryActionButton, pressed && styles.controlPressed]}
          onPress={onNext}
        >
          <Text style={styles.secondaryActionText}>Next</Text>
        </Pressable>
      </View>

      {showPauseOverlay && (
        <GlassSurface style={styles.pauseOverlay} intensity={42}>
          <Text style={styles.pauseOverlayIcon}>II</Text>
          <Text style={styles.pauseOverlayText}>Palma aberta detectada</Text>
        </GlassSurface>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  playerWrap: {
    justifyContent: 'flex-start',
    position: 'relative',
    paddingTop: 10,
  },
  gestureBorder: {
    position: 'absolute',
    top: 12,
    right: 6,
    bottom: 130,
    left: 6,
    borderWidth: 1,
    borderColor: 'rgba(247,255,0,0.08)',
    borderRadius: 24,
  },
  gestureBorderActive: {
    borderColor: COLORS.highlight,
    shadowColor: COLORS.highlight,
    shadowOpacity: 0.65,
    shadowRadius: 10,
    elevation: 8,
  },
  albumShell: {
    width: '92%',
    alignSelf: 'center',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surface,
  },
  heroCard: {
    width: '92%',
    alignSelf: 'center',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  albumArt: {
    width: 92,
    height: 92,
    borderRadius: 20,
    backgroundColor: 'rgba(21, 26, 36, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  albumEmoji: {
    fontSize: 42,
    color: COLORS.textPrimary,
  },
  heroMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  albumTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  albumArtist: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginTop: 6,
  },
  songKind: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  progressContainer: {
    marginTop: 18,
    marginBottom: 20,
    paddingHorizontal: 18,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressHint: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  progressTrack: {
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.highlight,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    backgroundColor: COLORS.highlight,
    borderWidth: 2,
    borderColor: '#111722',
    shadowColor: COLORS.highlight,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  errorCard: {
    marginTop: 4,
    marginBottom: 16,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(145, 46, 46, 0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255, 120, 120, 0.35)',
  },
  errorText: {
    color: COLORS.textPrimary,
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 10,
  },
  secondaryActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surfaceAlt,
    minWidth: 74,
    alignItems: 'center',
  },
  secondaryActionText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  controlButton: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 18,
    minWidth: 78,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  controlPressed: {
    opacity: 0.82,
  },
  controlPrimary: {
    backgroundColor: COLORS.highlight,
    minWidth: 128,
    borderColor: 'rgba(247, 255, 0, 0.7)',
  },
  controlPrimaryPressed: {
    opacity: 0.9,
  },
  controlText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  controlPrimaryText: {
    color: '#171D26',
  },
  pauseOverlay: {
    position: 'absolute',
    top: '38%',
    alignSelf: 'center',
    backgroundColor: 'rgba(20, 24, 32, 0.86)',
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(247, 255, 0, 0.6)',
  },
  pauseOverlayIcon: {
    color: COLORS.highlight,
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 5,
  },
  pauseOverlayText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    letterSpacing: 0.2,
  },
});
