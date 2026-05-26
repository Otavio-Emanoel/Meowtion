import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { GlassSurface } from '../components/GlassSurface';
import { LIBRARY_DATA } from '../data/mock';
import { DeviceSong } from '../hooks/useDeviceSongs';
import { useDeviceSongs } from '../hooks/useDeviceSongs';
import { COLORS } from '../theme/colors';
import { LibraryTab } from '../types/ui';

type LibraryScreenProps = {
  libraryTab: LibraryTab;
  onChangeLibraryTab: (tab: LibraryTab) => void;
  onSelectSong: (song: DeviceSong, queue: DeviceSong[], index: number) => void;
};

export function LibraryScreen({ libraryTab, onChangeLibraryTab, onSelectSong }: LibraryScreenProps) {
  const { songs, isLoading, errorMessage, hasPermission, refreshSongs, requestAccess } =
    useDeviceSongs();
  const libraryItems = useMemo(() => LIBRARY_DATA[libraryTab], [libraryTab]);
  const deviceSongs = songs;

  const renderMusicItem = ({
    item,
    index,
  }: {
    item: (typeof deviceSongs)[number];
    index: number;
  }) => {
    const durationMinutes = Math.floor(item.durationSeconds / 60);
    const durationSeconds = Math.floor(item.durationSeconds % 60)
      .toString()
      .padStart(2, '0');

    return (
      <Pressable
        onPress={() => onSelectSong(item, deviceSongs, index)}
        style={({ pressed }) => [styles.songRow, pressed && styles.songRowPressed]}
      >
        <View style={styles.songBadge}>
          <Text style={styles.songBadgeText}>{item.source === 'drive' ? 'DRV' : '♪'}</Text>
        </View>
        <View style={styles.songMeta}>
          <Text numberOfLines={1} style={styles.songTitle}>
            {item.title || 'Unknown Track'}
          </Text>
          <Text style={styles.songSubtitle}>
            {item.source === 'drive'
              ? 'Carregada do Google Drive'
              : durationMinutes > 0 || item.durationSeconds > 0
                ? `${durationMinutes}:${durationSeconds}`
                : 'Sem duracao disponivel'}
          </Text>
        </View>
      </Pressable>
    );
  };

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
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{libraryTab}</Text>
          <Pressable onPress={refreshSongs} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </Pressable>
        </View>

        {libraryTab === 'Musicas' ? (
          <View style={styles.musicSection}>
            {!hasPermission && (
              <View style={styles.permissionCard}>
                <Text style={styles.permissionTitle}>Acesso necessario</Text>
                <Text style={styles.permissionText}>
                  Permita o acesso a biblioteca de midia para listar as musicas do dispositivo.
                </Text>
                <Pressable onPress={requestAccess} style={styles.permissionButton}>
                  <Text style={styles.permissionButtonText}>Permitir acesso</Text>
                </Pressable>
              </View>
            )}

            {isLoading && (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={COLORS.highlight} />
                <Text style={styles.loadingText}>Carregando musicas do dispositivo...</Text>
              </View>
            )}

            {!isLoading && errorMessage && (
              <View style={styles.permissionCard}>
                <Text style={styles.permissionTitle}>Nao foi possivel carregar</Text>
                <Text style={styles.permissionText}>{errorMessage}</Text>
                <Pressable onPress={requestAccess} style={styles.permissionButton}>
                  <Text style={styles.permissionButtonText}>Tentar novamente</Text>
                </Pressable>
              </View>
            )}

            {!isLoading && hasPermission && deviceSongs.length === 0 && (
              <View style={styles.permissionCard}>
                <Text style={styles.permissionTitle}>Nenhuma musica encontrada</Text>
                <Text style={styles.permissionText}>
                  Nao achamos faixas de audio no aparelho agora. As faixas do Drive serao carregadas automaticamente.
                </Text>
              </View>
            )}

            {!isLoading && hasPermission && deviceSongs.length > 0 && (
              <FlatList
                data={deviceSongs}
                keyExtractor={(item) => item.id}
                renderItem={renderMusicItem}
                ItemSeparatorComponent={() => <View style={styles.songSeparator} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {libraryItems.map((item) => (
              <View key={item} style={styles.libraryItemRow}>
                <Text style={styles.libraryItemText}>{item}</Text>
                <Text style={styles.rowChevron}>&gt;</Text>
              </View>
            ))}
          </ScrollView>
        )}
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
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: COLORS.highlightSoft,
    borderWidth: 1,
    borderColor: 'rgba(247, 255, 0, 0.35)',
  },
  refreshButtonText: {
    color: COLORS.highlight,
    fontSize: 11,
    fontWeight: '700',
  },
  musicSection: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  permissionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: 'rgba(15, 19, 27, 0.45)',
    padding: 14,
    marginBottom: 12,
  },
  permissionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  permissionText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  permissionButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.highlight,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  permissionButtonText: {
    color: '#171D26',
    fontSize: 12,
    fontWeight: '800',
  },
  listContent: {
    paddingBottom: 16,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  songRowPressed: {
    opacity: 0.8,
  },
  songBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.highlightSoft,
    borderWidth: 1,
    borderColor: 'rgba(247, 255, 0, 0.25)',
  },
  songBadgeText: {
    color: COLORS.highlight,
    fontSize: 16,
    fontWeight: '800',
  },
  songMeta: {
    flex: 1,
  },
  songTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  songSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  songSeparator: {
    height: 1,
    backgroundColor: COLORS.borderSoft,
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
