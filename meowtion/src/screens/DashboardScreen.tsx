import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '../components/GlassSurface';
import { RECENT_TRACKS, RECOMMENDED_PLAYLISTS } from '../data/mock';
import { COLORS } from '../theme/colors';

type DashboardScreenProps = {
  micActive: boolean;
};

export function DashboardScreen({ micActive }: DashboardScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <GlassSurface style={styles.heroCard} intensity={32}>
        <View style={styles.catHeader}>
          <Text style={styles.catIcon}>=^.^=</Text>
          <View style={styles.mascotFace}>
            <View style={[styles.glasses, micActive && styles.glassesActive]}>
              <Text style={styles.glassesText}>[] []</Text>
            </View>
          </View>
        </View>
        <Text style={styles.greeting}>Ola, Otavio. Sua trilha ja esta alinhada com o seu ritmo.</Text>
        <Text style={styles.wakeWord}>
          Palavra de ativacao: "Hey Gato" {micActive ? '(ouvindo)' : '(inativo)'}
        </Text>
      </GlassSurface>

      <GlassSurface style={styles.sectionCard} intensity={30}>
        <Text style={styles.sectionTitle}>Tocadas Recentemente</Text>
        {RECENT_TRACKS.map((track) => (
          <View key={track} style={styles.trackRow}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.listItemText}>{track}</Text>
          </View>
        ))}
      </GlassSurface>

      <GlassSurface style={styles.sectionCard} intensity={30}>
        <Text style={styles.sectionTitle}>Playlists Recomendadas</Text>
        {RECOMMENDED_PLAYLISTS.map((playlist) => (
          <View key={playlist} style={styles.trackRow}>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.listItemText}>{playlist}</Text>
          </View>
        ))}
      </GlassSurface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 16,
    paddingBottom: 140,
    gap: 12,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surface,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  catIcon: {
    color: COLORS.textPrimary,
    fontSize: 28,
    marginRight: 12,
    fontWeight: '700',
  },
  mascotFace: {
    flex: 1,
    justifyContent: 'center',
  },
  glasses: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surfaceAlt,
  },
  glassesActive: {
    borderColor: COLORS.highlight,
    shadowColor: COLORS.highlight,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
  },
  glassesText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 10,
  },
  wakeWord: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    color: COLORS.highlight,
    marginRight: 8,
    fontSize: 15,
  },
  listItemText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
