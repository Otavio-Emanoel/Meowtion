import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from 'expo-glass-effect';

import { GlassSurface } from './GlassSurface';
import { COLORS } from '../theme/colors';
import { MainTab } from '../types/ui';

type BottomNavProps = {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
};

const NAV_ITEMS: Array<{ key: MainTab; label: string; icon: string }> = [
  { key: 'dashboard', label: 'Dashboard', icon: '⌂' },
  { key: 'player', label: 'Now Playing', icon: '♪' },
  { key: 'library', label: 'Library', icon: '☰' },
];

function BottomNavShell({ children }: { children: React.ReactNode }) {
  const hasNativeLiquidGlass =
    Platform.OS === 'ios' && isGlassEffectAPIAvailable() && isLiquidGlassAvailable();

  if (hasNativeLiquidGlass) {
    return (
      <GlassView
        style={[styles.bottomNav, styles.bottomNavLiquid]}
        glassEffectStyle={{ style: 'regular', animate: true, animationDuration: 0.24 }}
        tintColor="rgba(0, 98, 255, 0.2)"
        isInteractive
      >
        {children}
      </GlassView>
    );
  }

  return (
    <GlassSurface style={styles.bottomNav} intensity={44}>
      {children}
    </GlassSurface>
  );
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <BottomNavShell>
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeTab;

        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.navItem,
              isActive && styles.navItemActive,
              pressed && styles.navItemPressed,
            ]}
            onPress={() => onChangeTab(item.key)}
          >
            <Text style={[styles.navIcon, isActive && styles.navTextActive]}>{item.icon}</Text>
            <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </BottomNavShell>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    backgroundColor: COLORS.surfaceAlt,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  bottomNavLiquid: {
    backgroundColor: 'rgb(228, 228, 228)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 12,
  },
  navItemPressed: {
    opacity: 0.8,
  },
  navItemActive: {
    backgroundColor: COLORS.highlightSoft,
    borderWidth: 1,
    borderColor: 'rgba(247, 255, 0, 0.45)',
  },
  navIcon: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 4,
  },
  navText: {
    color: COLORS.textMuted,
    fontWeight: '600',
    fontSize: 11,
  },
  navTextActive: {
    color: COLORS.highlight,
    fontWeight: '700',
  },
});
