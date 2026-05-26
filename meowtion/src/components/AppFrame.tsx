import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { GlassSurface } from './GlassSurface';
import { COLORS } from '../theme/colors';

type AppFrameProps = {
  micActive: boolean;
  children: React.ReactNode;
};

export function AppFrame({ micActive, children }: AppFrameProps) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={[COLORS.backgroundTop, COLORS.background, COLORS.backgroundBottom]}
        start={{ x: 0.12, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.gradientBg}
      />

      <SafeAreaView style={styles.container}>
        <GlassSurface style={styles.headerShell} intensity={42}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Meowtion</Text>
              <Text style={styles.headerSubtitle}>Controle por voz e gestos em tempo real</Text>
            </View>

            <View style={styles.liveDotWrap}>
              <View style={[styles.liveDot, micActive && styles.liveDotActive]} />
              <Text style={styles.liveDotText}>{micActive ? 'Mic ativo' : 'Mic inativo'}</Text>
            </View>
          </View>
        </GlassSurface>

        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerShell: {
    marginHorizontal: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surface,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    color: COLORS.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
  liveDotWrap: {
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: '#7B8798',
  },
  liveDotActive: {
    backgroundColor: COLORS.highlight,
    shadowColor: COLORS.highlight,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  liveDotText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});
