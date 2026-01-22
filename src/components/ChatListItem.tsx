import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../navigation/types';

export type ChatItem = {
  id: string;
  title: string;
  preview: string;
  time: string;
  unread?: number;
  isGroup?: boolean;
};

export default function ChatListItem({ item }: { item: ChatItem }) {
  const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();

  const onPress = () => {
    if (item.isGroup) {
      navigation.navigate('GroupRoom', { chatId: item.id, chatName: item.title, isGroup: true });
    } else {
      navigation.navigate('PrivateRoom', { chatId: item.id, chatName: item.title });
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.preview} numberOfLines={1}>{item.preview}</Text>
            {item.unread ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, flex: 1 },
  time: { fontSize: 12, color: COLORS.subText },
  preview: { fontSize: 13, color: 'rgba(0,0,0,0.35)', flex: 1, fontWeight: '600' },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
});
