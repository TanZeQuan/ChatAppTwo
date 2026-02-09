import React, { useMemo, useRef, useState, useCallback } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/src/styles/colors";

// --- Mock Data ---
// 扩展了成员数据以匹配图片中的 Admin 标签和删除按钮逻辑
const GROUP_MEMBERS_DETAILED = [
  { id: '1', name: 'Sarah Johnson', isAdmin: true },
  { id: '2', name: 'Sarah Johnson', isAdmin: true },
  { id: '3', name: 'Sarah Johnson', isAdmin: false },
  { id: '4', name: 'Sarah Johnson', isAdmin: false },
  { id: '5', name: '你', isAdmin: true, isMe: true },
];

const ATTACHMENT_ITEMS = [
  { id: '1', label: 'Photo', icon: 'image', color: '#E3F2FD', iconColor: '#4285F4' },
  { id: '2', label: 'Video', icon: 'videocam', color: '#FFF3E0', iconColor: '#FB8C00' },
  { id: '3', label: 'Voice call', icon: 'call', color: '#FCE4EC', iconColor: '#F06292' },
  { id: '4', label: 'File', icon: 'document-text', color: '#E8F5E9', iconColor: '#43A047' },
  { id: '5', label: 'Contact', icon: 'person', color: '#EDE7F6', iconColor: '#7E57C2' },
];

const EMOJIS = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏"];

type GroupMessage = {
  id: string;
  text: string;
  sender: "me" | "other";
  senderName?: string;
  time: string;
};

export default function GroupRoomScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute() as any;
  const insets = useSafeAreaInsets();

  const { title, membersCount } = route.params ?? { title: "计划部", membersCount: 5 };

  // ✅ States
  const [menuVisible, setMenuVisible] = useState(false);
  const [noticeModalVisible, setNoticeModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false); // 控制群信息弹窗
  const [noticeInput, setNoticeInput] = useState("");
  const [pinnedNotice, setPinnedNotice] = useState<string | null>("欢迎加入团队！请查看置顶消息以获取重要信息。");
  const [activeFooter, setActiveFooter] = useState<'none' | 'attachments' | 'emojis' | 'mentions'>('none');
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<GroupMessage>>(null);

  const [messages, setMessages] = useState<GroupMessage[]>([
    { id: "1", sender: "other", senderName: "Sarah Johnson", text: "Hey team! How's everyone doing?", time: "10:30 AM" },
  ]);

  // ✅ TabBar Visibility
  const tabBarStyle = useMemo(() => ({
    height: 56 + insets.bottom,
    paddingBottom: insets.bottom,
    paddingTop: 6,
    backgroundColor: COLORS.primary,
    borderTopWidth: 0,
  }), [insets.bottom]);

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      return () => parent?.setOptions({ tabBarStyle });
    }, [navigation, tabBarStyle])
  );

  const onSend = (text: string) => {
    if (!text.trim()) return;
    const newMsg: GroupMessage = {
      id: String(Date.now()),
      sender: "me",
      text: text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setActiveFooter('none');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const toggleFooter = (type: 'attachments' | 'emojis' | 'mentions') => {
    if (activeFooter === type) {
      setActiveFooter('none');
    } else {
      Keyboard.dismiss();
      setActiveFooter(type);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Header - 将中间标题部分包装成可点击 */}
      <View style={[styles.header, { height: 84 + insets.top, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerTitleWrap} 
          activeOpacity={0.7}
          onPress={() => setInfoModalVisible(true)}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatarPlaceholder}><Ionicons name="people" size={18} color="#2563EB" /></View>
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{membersCount ?? 0} 名成员</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ✅ 顶部公告栏 */}
      {pinnedNotice && (
        <View style={styles.pinnedBar}>
          <Ionicons name="megaphone-outline" size={18} color="#B45309" style={styles.pinnedIcon} />
          <View style={styles.pinnedContent}>
            <Text style={styles.pinnedTitle}>群组公告</Text>
            <Text numberOfLines={1} style={styles.pinnedText}>{pinnedNotice}</Text>
          </View>
          <TouchableOpacity onPress={() => setPinnedNotice(null)} style={styles.pinnedCloseBtn}>
            <Ionicons name="close" size={20} color="#B45309" />
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ 群信息弹窗 (Group Info Modal) */}
      <GroupInfoModal 
        visible={infoModalVisible} 
        onClose={() => setInfoModalVisible(false)} 
        title={title}
        membersCount={membersCount}
      />

      {/* Menu & Modal Popups */}
      <GroupHeaderMenu 
  visible={menuVisible} 
  top={insets.top + 58} 
  onClose={() => setMenuVisible(false)} 
  onOpenNotice={() => { setMenuVisible(false); setNoticeModalVisible(true); }}
  onOpenInfo={() => { setMenuVisible(false); setInfoModalVisible(true); }} // ✅ 加上这一行
/>

      <NoticeInputModal 
        visible={noticeModalVisible}
        value={noticeInput}
        onChange={setNoticeInput}
        onClose={() => setNoticeModalVisible(false)}
        onSend={() => {
          setPinnedNotice(noticeInput);
          setNoticeInput("");
          setNoticeModalVisible(false);
        }}
      />

      {/* Chat Body */}
      <View style={styles.body}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          ListHeaderComponent={<DayChip label="今天" />}
          renderItem={({ item }) => <GroupMessageRow message={item} />}
          contentContainerStyle={[styles.listContent, { paddingBottom: 20 }]}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      </View>

      {/* Input Section */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {activeFooter === 'mentions' && (
          <View style={styles.mentionPopup}>
            <Text style={styles.mentionLabel}>艾特某人</Text>
            {GROUP_MEMBERS_DETAILED.map((member) => (
              <TouchableOpacity key={member.id} style={styles.mentionItem} onPress={() => { setInput(prev => prev + `@${member.name} `); setActiveFooter('none'); }}>
                <View style={styles.mentionAvatar}><Ionicons name="person" size={16} color="#6B7280" /></View>
                <Text style={styles.mentionName}>{member.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={[styles.inputBar, { paddingBottom: activeFooter === 'none' ? insets.bottom + 10 : 10 }]}>
          <TouchableOpacity style={styles.smallIconBtn} onPress={() => toggleFooter('attachments')}>
            <Ionicons name="attach" size={22} color={activeFooter === 'attachments' ? "#2563EB" : "#6B7280"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallIconBtn} onPress={() => toggleFooter('mentions')}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: activeFooter === 'mentions' ? '#2563EB' : '#6B7280' }}>@</Text>
          </TouchableOpacity>
          <View style={styles.inputWrap}>
            <TextInput value={input} onChangeText={setInput} placeholder="输入消息..." style={styles.textInput} onFocus={() => setActiveFooter('none')} />
          </View>
          <TouchableOpacity style={styles.smallIconBtn} onPress={() => toggleFooter('emojis')}>
            <Ionicons name="happy-outline" size={22} color={activeFooter === 'emojis' ? "#2563EB" : "#6B7280"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={() => onSend(input)}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {(activeFooter === 'attachments' || activeFooter === 'emojis') && (
          <View style={[styles.footerPanel, { height: 280 + insets.bottom, paddingBottom: insets.bottom }]}>
            {activeFooter === 'attachments' ? (
              <View style={styles.attachmentGrid}>
                {ATTACHMENT_ITEMS.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.attachItem}>
                    <View style={[styles.attachIconBg, { backgroundColor: item.color }]}><Ionicons name={item.icon as any} size={24} color={item.iconColor} /></View>
                    <Text style={styles.attachLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <View style={styles.emojiHeader}>
                  <Text style={styles.emojiTitle}>表情选择</Text>
                  <TouchableOpacity onPress={() => setActiveFooter('none')}><Ionicons name="close" size={20} color="#6B7280" /></TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.emojiGrid}>
                  {EMOJIS.map((emoji, i) => (
                    <TouchableOpacity key={i} style={styles.emojiItem} onPress={() => setInput(p => p + emoji)}>
                      <Text style={{ fontSize: 24 }}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Sub-Components ---

/**
 * ✅ 群信息弹窗组件 (Group Info Modal)
 * 对应图片中的设计布局
 */
function GroupInfoModal({ visible, onClose, title, membersCount }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={infoStyles.overlay}>
        <View style={infoStyles.contentContainer}>
          {/* 蓝色背景 Header 部分 */}
          <View style={infoStyles.blueHeader}>
            <TouchableOpacity onPress={onClose} style={infoStyles.modalCloseBtn}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={infoStyles.headerMain}>
              <View style={infoStyles.largeAvatar}>
                <Ionicons name="people" size={40} color="#2563EB" />
              </View>
              <View style={infoStyles.titleGroup}>
                <Text style={infoStyles.groupNameText}>{title || "Project Team"}</Text>
                <TouchableOpacity><Ionicons name="pencil" size={18} color="#fff" style={{ marginLeft: 8 }} /></TouchableOpacity>
              </View>
              <Text style={infoStyles.memberCountText}>{membersCount || 5}位成员</Text>
            </View>
          </View>

          {/* 成员列表部分 */}
          <View style={infoStyles.body}>
            <View style={infoStyles.bodyHeader}>
              <Text style={infoStyles.sectionTitle}>群员</Text>
              <TouchableOpacity style={infoStyles.addButton}>
                <Ionicons name="person-add" size={16} color="#fff" />
                <Text style={infoStyles.addButtonText}>添加</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {GROUP_MEMBERS_DETAILED.map((member) => (
                <View key={member.id} style={infoStyles.memberRow}>
                  <View style={infoStyles.memberLeft}>
                    <View style={infoStyles.memberAvatarSmall}>
                      <Ionicons name="person" size={20} color="#6B7280" />
                    </View>
                    <Text style={infoStyles.memberNameText}>{member.name}</Text>
                    {member.isAdmin && (
                      <View style={infoStyles.adminBadge}>
                        <Text style={infoStyles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                  </View>
                  {!member.isMe && (
                    <TouchableOpacity>
                      <Ionicons name="close" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function GroupHeaderMenu({ visible, top, onClose, onOpenNotice, onOpenInfo }: any) {
  if (!visible) return null;
  return (
    <View style={menuStyles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={menuStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[menuStyles.menuCard, { top }]}>
        <MenuItem icon="search" label="搜索聊天记录" onPress={onClose} />
        {/* ✅ 点击这里也要能跳出弹窗 */}
        <MenuItem icon="people-outline" label="群员信息" onPress={onOpenInfo} /> 
        <MenuItem icon="megaphone-outline" label="发布群通告" onPress={onOpenNotice} />
        <MenuItem icon="pin-outline" label="置顶聊天" onPress={onClose} />
        <View style={menuStyles.divider} />
        <MenuItem icon="trash-outline" label="清除聊天记录" danger onPress={onClose} />
      </View>
    </View>
  );
}

function NoticeInputModal({ visible, value, onChange, onClose, onSend }: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.noticeCard}>
          <Text style={styles.modalTitle}>更新群通告</Text>
          <TextInput style={styles.noticeInput} placeholder="输入要置顶的内容..." multiline value={value} onChangeText={onChange} autoFocus />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalBtn} onPress={onClose}><Text style={{ color: '#6B7280' }}>取消</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnConfirm]} onPress={onSend}><Text style={{ color: '#fff', fontWeight: 'bold' }}>发布</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function MenuItem({ icon, label, onPress, danger }: any) {
  return (
    <TouchableOpacity style={menuStyles.item} onPress={onPress}>
      <Ionicons name={icon} size={18} color={danger ? "#EF4444" : "#111827"} style={{ width: 22 }} />
      <Text style={[menuStyles.itemText, danger && { color: "#EF4444" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function DayChip({ label }: { label: string }) {
  return <View style={styles.dayChipWrap}><View style={styles.dayChip}><Text style={styles.dayChipText}>{label}</Text></View></View>;
}

function GroupMessageRow({ message }: { message: GroupMessage }) {
  const isMe = message.sender === "me";
  return (
    <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
      {!isMe && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <View style={styles.smallAvatar}><Ionicons name="person" size={14} color="#6B7280" /></View>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#4B5563' }}>{message.senderName}</Text>
        </View>
      )}
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{message.text}</Text>
      </View>
      <Text style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}>{message.time}</Text>
    </View>
  );
}

// --- Styles ---

// ✅ 新增：群信息弹窗专用样式
const infoStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  contentContainer: { height: '85%', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  blueHeader: { backgroundColor: '#2563EB', padding: 20, alignItems: 'center' },
  modalCloseBtn: { alignSelf: 'flex-end' },
  headerMain: { alignItems: 'center', marginTop: -10, paddingBottom: 10 },
  largeAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  titleGroup: { flexDirection: 'row', alignItems: 'center' },
  groupNameText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  memberCountText: { color: '#DCEBFF', fontSize: 14, marginTop: 4 },
  
  body: { flex: 1, padding: 20 },
  bodyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '700', marginLeft: 4 },
  
  memberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  memberLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  memberAvatarSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  memberNameText: { fontSize: 16, color: '#111827', fontWeight: '600' },
  adminBadge: { backgroundColor: '#DBEAFE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  adminBadgeText: { color: '#2563EB', fontSize: 11, fontWeight: '800' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#CFE7FF" },
  header: { backgroundColor: "#2563EB", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, zIndex: 10 },
  headerIconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitleWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  avatarPlaceholder: { width: "100%", height: "100%", backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 15 },
  headerSubtitle: { color: "#DCEBFF", fontSize: 12, marginTop: 1 },

  pinnedBar: { backgroundColor: '#FFFBEB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#FEF3C7', zIndex: 5 },
  pinnedIcon: { marginRight: 12 },
  pinnedContent: { flex: 1 },
  pinnedTitle: { fontSize: 13, fontWeight: '800', color: '#B45309', marginBottom: 2 },
  pinnedText: { fontSize: 14, color: '#92400E' },
  pinnedCloseBtn: { padding: 4 },

  body: { flex: 1, backgroundColor: "#D7EEFF" },
  listContent: { paddingHorizontal: 12, paddingTop: 8 },
  dayChipWrap: { alignItems: "center", marginVertical: 8 },
  dayChip: { backgroundColor: "rgba(255,255,255,0.65)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  dayChipText: { color: "#374151", fontWeight: "700", fontSize: 12 },
  row: { marginBottom: 14 },
  rowLeft: { alignItems: "flex-start" },
  rowRight: { alignItems: "flex-end" },
  smallAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  bubble: { maxWidth: "78%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleOther: { backgroundColor: "#FFFFFF" },
  bubbleMe: { backgroundColor: "#2563EB" },
  msgText: { fontSize: 14, lineHeight: 20 },
  msgTextOther: { color: "#111827" },
  msgTextMe: { color: "#FFFFFF", fontWeight: "700" },
  timeText: { fontSize: 10, color: "#6B7280", marginTop: 4 },
  timeLeft: { alignSelf: "flex-start" },
  timeRight: { alignSelf: "flex-end" },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  noticeCard: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  noticeInput: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 12, height: 120, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 10 },
  modalBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  modalBtnConfirm: { backgroundColor: '#2563EB' },

  inputBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 10, paddingTop: 10, backgroundColor: "#F8FAFC" },
  smallIconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF2F7" },
  inputWrap: { flex: 1, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB", paddingHorizontal: 12, justifyContent: "center" },
  textInput: { fontSize: 14, color: "#111827", paddingVertical: 0 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#2563EB", alignItems: "center", justifyContent: "center" },
  footerPanel: { backgroundColor: "#fff", height: 280 },
  attachmentGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 24, justifyContent: 'space-between' },
  attachItem: { width: '22%', alignItems: 'center', marginBottom: 20 },
  attachIconBg: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  attachLabel: { fontSize: 12, color: '#64748B', textAlign: 'center' },
  emojiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  emojiTitle: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  emojiItem: { width: '12.5%', height: 44, alignItems: 'center', justifyContent: 'center' },
  mentionPopup: { backgroundColor: '#FFFFFF', marginHorizontal: 12, marginBottom: 8, borderRadius: 18, padding: 16, elevation: 5 },
  mentionLabel: { fontSize: 13, color: '#6B7280', marginBottom: 16, fontWeight: '600' },
  mentionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  mentionAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  mentionName: { fontSize: 15, fontWeight: '600', color: '#111827' },
});

const menuStyles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 999 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "transparent" },
  menuCard: { position: "absolute", right: 12, width: 210, borderRadius: 14, backgroundColor: "#FFFFFF", paddingVertical: 8, shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  item: { height: 46, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  itemText: { fontSize: 14, fontWeight: "700", color: "#111827" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6, marginHorizontal: 10 },
});