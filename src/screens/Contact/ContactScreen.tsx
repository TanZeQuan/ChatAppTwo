import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SectionList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../../components/SearchBar';

const { width } = Dimensions.get('window');

const CONTACT_DATA = [
  { title: '⭐', data: [{ id: 's1', name: '妈妈' }, { id: 's2', name: '妈妈' }] },
  { title: 'A', data: [{ id: 'a1', name: '妈妈' }] },
  { title: 'B', data: [{ id: 'b1', name: '妈妈' }, { id: 'b2', name: '妈妈' }] },
  { title: 'C', data: [{ id: 'c1', name: '妈妈' }] },
];

const ALPHABET = ["↑", "⭐", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"];

export default function ContactsScreen() {
  const [q, setQ] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>通讯录</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="person-add" size={22} color="#fff" />
            <View style={styles.badge}><Text style={styles.badgeText}>0</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="person-circle-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* 搜索区域 - 左右对齐 */}
        <View style={styles.searchWrapper}>
          <SearchBar value={q} onChangeText={setQ} placeholder="搜索联络人" />
          <Text style={styles.countText}>21 联络人</Text>
        </View>

        {/* 列表容器 */}
        <View style={styles.listContainer}>
          <SectionList
            sections={CONTACT_DATA}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            // 关键：左右内边距保持一致，确保卡片水平居中
            contentContainerStyle={styles.listScroll}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionLabel}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={22} color="#9CA3AF" />
                  </View>
                  <Text style={styles.nameText}>{item.name}</Text>
                </View>
                
                <View style={styles.cardRight}>
                  <TouchableOpacity style={styles.actionIcon}>
                    <Ionicons name="chatbubble-outline" size={20} color="#2563EB" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIcon}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* 右侧索引栏 - 使用绝对定位，不占用列表空间，解决“斜了”的问题 */}
          <View style={styles.sideIndex}>
            {ALPHABET.map((char) => (
              <TouchableOpacity key={char} style={styles.indexItem}>
                <Text style={styles.indexText}>{char}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E1F1FF' },
  header: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIconBtn: { padding: 4, position: 'relative' },
  badge: {
    position: 'absolute',
    right: -2,
    top: 0,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },

  content: { flex: 1 },
  searchWrapper: { paddingHorizontal: 16, paddingTop: 12 },
  countText: { color: '#6B7280', fontSize: 13, marginTop: 10, fontWeight: '600' },

  listContainer: { 
    flex: 1, 
    flexDirection: 'row', // 确保内容横向排列
    position: 'relative' 
  },
  
  listScroll: { 
    paddingLeft: 16,     // 左边距保持 16
    paddingRight: 32,    // ✅ 关键：右边距加大（16基础值 + 16预留位），防止卡片钻进 ABC 索引栏下面
    paddingBottom: 40,
  },
  
  sectionLabel: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#2563EB', 
    marginTop: 18, 
    marginBottom: 8 
  },

  // 卡片布局对齐优化
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    width: '100%',        // 填满 padding 后的剩余空间
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { 
    width: 42, 
    height: 42, 
    borderRadius: 21, 
    backgroundColor: '#F3F4F6', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  nameText: { marginLeft: 12, fontSize: 16, fontWeight: '600', color: '#111827' },
  
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { padding: 8 },

  // 右侧字母索引 - 绝对定位，解决偏移感
 sideIndex: {
    position: 'absolute',
    right: 2,            // 贴近屏幕最右边缘
    top: 0,
    bottom: 0,
    width: 20,           // 固定宽度
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // 透明背景，不遮挡
  },
  indexItem: {
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 9,
    color: '#3B82F6',
    fontWeight: '700',
    textAlign: 'center',
  },
});