import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import SearchBar from '../components/SearchBar';
import ContactListItem, { ContactItem } from '../components/ContactListItem';
import FloatingActionButton from '../components/FloatingActionButton';

export default function ContactsScreen() {
  const [q, setQ] = useState('');

  const data = useMemo<ContactItem[]>(
    () => [
      { id: '1', name: 'Sarah Johnson', title: 'Product Manager', dept: 'Product' },
      { id: '2', name: 'Michael Chen', title: 'Senior Developer', dept: 'Engineering' },
      { id: '3', name: 'Emma Williams', title: 'UX Designer', dept: 'Design' },
      { id: '4', name: 'James Taylor', title: 'Marketing Lead', dept: 'Marketing' },
      { id: '5', name: 'David Martinez', title: 'Sales Manager', dept: 'Sales' },
      { id: '6', name: 'Lisa Anderson', title: 'HR Specialist', dept: 'Human Resources' },
      { id: '7', name: 'Robert Kim', title: 'Data Analyst', dept: 'Analytics' },
    ],
    []
  );

  const filtered = useMemo(
    () => data.filter(x => (x.name + x.title + x.dept).toLowerCase().includes(q.toLowerCase())),
    [data, q]
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
      </View>

      <View style={styles.body}>
        <SearchBar value={q} onChangeText={setQ} />
        <FlatList
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 140, gap: 12 }}
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContactListItem item={item} />}
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
