import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { COLORS } from '../styles/colors';

type Props = {
  onPress: () => void;
  label?: string; // 先用文字“+”，你要图标我再帮你换
  style?: ViewStyle;
};

export default function FloatingActionButton({ onPress, label = '+', style }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.fab, style]}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 92,
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.fab,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    color: COLORS.fabIcon,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '700',
  },
});
