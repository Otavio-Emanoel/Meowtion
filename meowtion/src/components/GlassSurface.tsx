import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

type GlassSurfaceProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

export function GlassSurface({ children, style, intensity = 35 }: GlassSurfaceProps) {
  if (Platform.OS === 'ios') {
    return (
      <BlurView intensity={intensity} tint="dark" style={[styles.base, style]}>
        {children}
      </BlurView>
    );
  }

  return <View style={[styles.base, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
