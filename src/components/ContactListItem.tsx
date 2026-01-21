import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';

export type ContactItem = {
  id: string;
  name: string;
  title: string;
  dept: string;
};

export default function ContactListItem({ item }: { item: ContactItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.title}</Text>
        <Text style={styles.meta2}>{item.dept}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SPACING.cardRadius,
    padding: SPACING.cardPadding,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  name: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: 13, color: 'rgba(0,0,0,0.45)', marginTop: 2 },
  meta2: { fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 2 },
});
