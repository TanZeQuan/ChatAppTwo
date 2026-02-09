import React, { useMemo, useState } from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChatListItem, { ChatItem } from '../../components/ChatListItem';
import SearchBar from '../../components/SearchBar';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { Ionicons } from '@expo/vector-icons';

// Extend the ChatItem type locally to support pinning for this screen
interface ExtendedChatItem extends ChatItem {
  isPinned?: boolean;
}

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [q, setQ] = useState('');

  // 1. Mock Data matching the image context
  const rawData = useMemo<ExtendedChatItem[]>(
    () => [
      { id: '1', title: '妈妈', preview: '好的谢谢你的礼物', time: '2:44 PM', isPinned: true },
      { id: '2', title: '姐姐', preview: '知道了哦', time: '2:44 PM', unread: 3, isPinned: true },
      { id: '3', title: '朋友', preview: '记得上号', time: '2:44 PM', unread: 1 },
      { id: '4', title: '疯子们', preview: '干得漂亮！', time: '2:44 PM', unread: 20, isGroup: true },
      { id: '5', title: '妈妈', preview: '好的谢谢你的礼物', time: '2:44 PM' }, // Duplicate for list length demo
      { id: '6', title: 'Marketing Team', preview: 'Great job!', time: 'Monday', unread: 0, isGroup: true },
      { id: '7', title: '妈妈', preview: '好的谢谢你的礼物', time: '2:44 PM' },
    ],
    []
  );

  // 2. Filter and Organize Data into Sections
  const sections = useMemo(() => {
    const filtered = rawData.filter((x) =>
      (x.title + x.preview).toLowerCase().includes(q.toLowerCase())
    );

    const pinned = filtered.filter((item) => item.isPinned);
    const others = filtered.filter((item) => !item.isPinned);

    const result = [];
    if (pinned.length > 0) {
      result.push({ title: 'Pinned', data: pinned, icon: 'pin' });
    }
    if (others.length > 0) {
      result.push({ title: 'All Chats', data: others, icon: null });
    }
    return result;
  }, [rawData, q]);

  const renderSectionHeader = ({ section: { title, icon } }: any) => (
    <View style={styles.sectionHeader}>
      {icon && (
        <Ionicons
          name="push-outline"
          size={16}
          color={COLORS.primary} // Or a darker grey depending on preference
          style={{ marginRight: 6, transform: [{ rotate: '45deg' }] }}
        />
      )}
      <Text style={[styles.sectionTitle, icon && { color: '#445' }]}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header matching image: Left Title, Right Add Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>信息</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.navigate('AddChat' as never)}
        >
          <Ionicons name="add" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View style={{ marginBottom: 10 }}>
              <SearchBar value={q} onChangeText={setQ} />
            </View>
          }
          renderSectionHeader={renderSectionHeader}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              {/* Pass isPinned to ChatListItem if it supports it, otherwise layout handles the look */}
              <ChatListItem item={item} />
              
              {/* Optional: Render visual Pin icon inside card if ChatListItem doesn't have it */}
              {item.isPinned && (
                <View style={styles.pinIconContainer}>
                  <Ionicons name="push" size={12} color={COLORS.primary} />
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
    backgroundColor: '#DAEAF8' // Light blue background matching the image
  },
  header: {
    height: Platform.OS === 'ios' ? 100 : 80,
    backgroundColor: '#2563EB', // Bright Blue
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600' 
  },
  headerButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { 
    flex: 1, 
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334', // Dark grey text for section headers
    opacity: 0.8,
  },
  // The Card Style Container
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    paddingVertical: 4,
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden'
  },
  pinIconContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    transform: [{ rotate: '45deg' }]
  }
});