import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '../components/GlassSurface';
import { COLORS } from '../theme/colors';

type NowPlayingScreenProps = {
  handDetected: boolean;
  showPauseOverlay: boolean;
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
};

export function NowPlayingScreen({
  handDetected,
  showPauseOverlay,
  isPlaying,
  progress,
  onTogglePlay,
}: NowPlayingScreenProps) {
  return (
    <View style={[styles.screenContent, styles.playerWrap]}>
      <View style={[styles.gestureBorder, handDetected && styles.gestureBorderActive]} />

      <GlassSurface style={styles.albumShell} intensity={34}>
        <View style={styles.albumArt}>
          <Text style={styles.albumEmoji}>♪</Text>
          <Text style={styles.albumTitle}>Night Shift</Text>
          <Text style={styles.albumArtist}>Neko Waves</Text>
        </View>
      </GlassSurface>

      <View style={styles.progressContainer}>
        <View style={styles.progressMeta}>
          <Text style={styles.progressHint}>Agora tocando</Text>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <View style={styles.controlsRow}>
        <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}>
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

        <Pressable style={({ pressed }) => [styles.controlButton, pressed && styles.controlPressed]}>
          <Text style={styles.controlText}>&gt;&gt;|</Text>
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
    width: '88%',
    alignSelf: 'center',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surface,
  },
  albumArt: {
    width: '100%',
    borderRadius: 20,
    aspectRatio: 1,
    backgroundColor: 'rgba(21, 26, 36, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    marginBottom: 0,
  },
  albumEmoji: {
    fontSize: 64,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  albumTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  albumArtist: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginTop: 6,
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
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.highlight,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
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
