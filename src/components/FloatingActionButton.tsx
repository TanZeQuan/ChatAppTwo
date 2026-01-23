import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../styles/colors';

type Props = {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
  children?: React.ReactNode; // ✅ 关键
};

export default function FloatingActionButton({
  onPress,
  label,
  style,
  children,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {children ? children : <Text style={styles.label}>{label ?? ''}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6, // Android shadow
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
