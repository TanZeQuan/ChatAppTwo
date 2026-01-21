import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';

type Props = {
  title: string;
  danger?: boolean;
};

export default function SettingRow({ title, danger }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.icon} />
      <Text style={[styles.text, danger && { color: COLORS.danger }]}>{title}</Text>
      <Text style={styles.chev}>{'>'}</Text>
    </View>
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
  },
  text: { flex: 1, fontSize: 15, fontWeight: '700', color: COLORS.text },
  chev: { color: 'rgba(0,0,0,0.35)', fontSize: 18, fontWeight: '700' },
});
