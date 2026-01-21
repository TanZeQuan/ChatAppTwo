import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import SearchBar from '../components/SearchBar';
import ChatListItem, { ChatItem } from '../components/ChatListItem';
import FloatingActionButton from '../components/FloatingActionButton';

export default function MessagesScreen() {
  const [q, setQ] = useState('');

  const data = useMemo<ChatItem[]>(
    () => [
      { id: '1', title: 'Sarah Johnson', preview: 'Thanks for the update!', time: '2:44 PM' },
      { id: '2', title: 'Product Team', preview: "Let's review the designs", time: '2:44 PM' },
      { id: '3', title: 'Michael Chen', preview: 'Sounds good to me!', time: '2:44 PM' },
      { id: '4', title: 'Design Squad', preview: 'Amazing work everyone!', time: '2:44 PM', unread: 20, isGroup: true },
      { id: '5', title: 'Alex Thompson', preview: 'See you tomorrow', time: '2:44 PM' },
      { id: '6', title: 'Marketing Team', preview: 'Great job!', time: '2:44 PM', unread: 2, isGroup: true },
      { id: '7', title: 'Development Hub', preview: 'Meeting starts at 3pm...', time: '2:44 PM', isGroup: true },
    ],
    []
  );

  const filtered = useMemo(
    () => data.filter(x => (x.title + x.preview).toLowerCase().includes(q.toLowerCase())),
    [data, q]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.body}>
        <SearchBar value={q} onChangeText={setQ} />
        <FlatList
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 140, gap: 12 }}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatListItem item={item} />}
        />
      </View>

      <FloatingActionButton onPress={() => {}} label="+" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    height: 84,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 14,
  },
  headerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  body: { flex: 1, padding: SPACING.screenPadding },
});
