import React from 'react';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { COLORS } from '../../src/theme/colors';

export default function TabLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      backgroundColor={COLORS.surfaceAlt}
      tintColor={COLORS.highlight}
      labelStyle={{ fontWeight: '700' }}
      blurEffect="systemMaterial"
    >
      <NativeTabs.Trigger name="index">
        <Icon sf="house.fill" drawable="ic_menu_home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="player">
        <Icon sf="play.circle.fill" drawable="ic_media_play" />
        <Label>Player</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="library">
        <Icon sf="music.note.list" drawable="ic_menu_agenda" />
        <Label>Library</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
