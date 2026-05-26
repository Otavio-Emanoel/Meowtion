import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassSurface } from '../components/GlassSurface';
import { LIBRARY_DATA } from '../data/mock';
import { COLORS } from '../theme/colors';
import { LibraryTab } from '../types/ui';

type LibraryScreenProps = {
  libraryTab: LibraryTab;
  onChangeLibraryTab: (tab: LibraryTab) => void;
};

export function LibraryScreen({ libraryTab, onChangeLibraryTab }: LibraryScreenProps) {
  const libraryItems = useMemo(() => LIBRARY_DATA[libraryTab], [libraryTab]);

  return (
    <View style={styles.screenContent}>
      <View style={styles.libraryTabsRow}>
        {(Object.keys(LIBRARY_DATA) as LibraryTab[]).map((tab) => {
          const isActive = tab === libraryTab;

          return (
            <Pressable
              key={tab}
              style={({ pressed }) => [
                styles.libraryTabButton,
                isActive && styles.libraryTabButtonActive,
                pressed && styles.libraryTabPressed,
              ]}
              onPress={() => onChangeLibraryTab(tab)}
            >
              <Text style={[styles.libraryTabText, isActive && styles.libraryTabTextActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>

      <GlassSurface style={styles.sectionCard} intensity={30}>
        <Text style={styles.sectionTitle}>{libraryTab}</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {libraryItems.map((item) => (
            <View key={item} style={styles.libraryItemRow}>
              <Text style={styles.libraryItemText}>{item}</Text>
              <Text style={styles.rowChevron}>&gt;</Text>
            </View>
          ))}
        </ScrollView>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  libraryTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  libraryTabButton: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  libraryTabPressed: {
    opacity: 0.85,
  },
  libraryTabButtonActive: {
    backgroundColor: COLORS.highlightSoft,
    borderColor: 'rgba(247, 255, 0, 0.45)',
  },
  libraryTabText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  libraryTabTextActive: {
    color: COLORS.highlight,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 16,
  },
  libraryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoft,
    paddingVertical: 13,
  },
  libraryItemText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  rowChevron: {
    color: COLORS.textMuted,
    fontSize: 18,
  },
});
