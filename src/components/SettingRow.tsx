import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';

type Props = {
  title: string;
  danger?: boolean;
  onPress?: () => void;

  // ✅ 新增：支持 Ionicons
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function SettingRow({ title, danger, onPress, icon }: Props) {
  const iconColor = danger ? COLORS.danger : COLORS.primary;

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.75}>
      <View style={styles.row}>
        {/* Left Icon */}
        <View style={styles.icon}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={iconColor}
            />
          )}
        </View>

        {/* Title */}
        <Text style={[styles.text, danger && { color: COLORS.danger }]}>
          {title}
        </Text>

        {/* Right Chevron */}
        <Ionicons
          name="chevron-forward"
          size={18}
          color="rgba(0,0,0,0.35)"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: COLORS.card,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.cardPadding,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(30,99,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
});
