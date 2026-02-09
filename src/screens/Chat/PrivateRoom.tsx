// src/screens/chat/PrivateRoomScreen.tsx
import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Keyboard,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "@/src/styles/colors";

// --- Mock Data for New Features ---
const ATTACHMENT_ITEMS = [
  { id: '1', label: 'Photo', icon: 'image', color: '#E3F2FD', iconColor: '#4285F4' },
  { id: '2', label: 'Video', icon: 'videocam', color: '#FFF3E0', iconColor: '#FB8C00' },
  { id: '3', label: 'Voice call', icon: 'call', color: '#FCE4EC', iconColor: '#F06292' },
  { id: '4', label: 'File', icon: 'document-text', color: '#E8F5E9', iconColor: '#43A047' },
  { id: '5', label: 'Contact', icon: 'person', color: '#EDE7F6', iconColor: '#7E57C2' },
];

const EMOJI_LIST = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂",
  "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩",
  "😘", "😗", "☺", "😚", "😙", "🥲", "😋", "😛",
  "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
];

// ✅ Replace with your real ChatStackParamList if you have it
type RootStackParamList = {
  PrivateRoom: { roomId: string; title: string; avatar?: string; online?: boolean };
};

type Nav = NativeStackNavigationProp<RootStackParamList, "PrivateRoom">;

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
};

export default function PrivateRoomScreen() {
  const route = useRoute() as any;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const { title, avatar, online } = route.params ?? {
    title: "Sarah Johnson",
    avatar: "",
    online: true,
  };

  // ✅ restore TabBar style when leaving chat room
  const tabBarStyle = useMemo(
    () => ({
      height: 56 + insets.bottom,
      paddingBottom: insets.bottom,
      paddingTop: 6,
      backgroundColor: COLORS.primary,
      borderTopWidth: 0,
    }),
    [insets.bottom]
  );

  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      // ✅ hide bottom tabs in room
      parent?.setOptions({ tabBarStyle: { display: "none" } });
      // ✅ restore when leaving
      return () => parent?.setOptions({ tabBarStyle });
    }, [navigation, tabBarStyle])
  );

  const [menuVisible, setMenuVisible] = useState(false);
  const [input, setInput] = useState("");
  
  // ✅ New State for Footer Panels
  const [activeFooter, setActiveFooter] = useState<'none' | 'attachments' | 'emojis'>('none');

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hey! How's the new project?", sender: "other", time: "10:30 AM" },
    { id: "2", text: "It's going great! We finished the design phase.", sender: "me", time: "10:32 AM" },
    { id: "3", text: "That's awesome! Can you share some screenshots?", sender: "other", time: "10:33 AM" },
    { id: "4", text: "Sure! I'll send them over in a few minutes.", sender: "me", time: "10:35 AM" },
    { id: "5", text: "Thanks for the update on the project!", sender: "other", time: "10:40 AM" },
    { id: "6", text: "You're welcome! Excited about the progress.", sender: "me", time: "10:42 AM" },
  ]);

  const listRef = useRef<FlatList<Message>>(null);
  const headerSubtitle = useMemo(() => (online ? "online" : "offline"), [online]);

  // ✅ Listen for keyboard appearance to close custom footers
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setActiveFooter('none'));
    return () => showSub.remove();
  }, []);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: Message = {
      id: String(Date.now()),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setActiveFooter('none'); // Close panels on send

    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };
  
  // ✅ Toggle Logic
  const toggleAttachments = () => {
    if (activeFooter === 'attachments') {
      setActiveFooter('none');
    } else {
      Keyboard.dismiss();
      setActiveFooter('attachments');
    }
  };

  const toggleEmojis = () => {
    if (activeFooter === 'emojis') {
      setActiveFooter('none');
    } else {
      Keyboard.dismiss();
      setActiveFooter('emojis');
    }
  };

  const addEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  // Menu Handlers
  const onPressSearch = () => {
    setMenuVisible(false);
    Alert.alert("Search Chat", "TODO: navigate to Search screen");
  };

  const onPressPin = () => {
    setMenuVisible(false);
    Alert.alert("Pin Chat", "TODO: pin logic");
  };

  const onPressMute = () => {
    setMenuVisible(false);
    Alert.alert("Mute Chat", "TODO: mute logic");
  };

  const onPressClear = () => {
    setMenuVisible(false);
    Alert.alert("Clear Chat", "Are you sure you want to clear this chat?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => setMessages([]) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Header (covers status bar) */}
      <View style={[styles.header, { height: 84 + insets.top, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <View style={styles.avatarWrap}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={18} color="#6B7280" />
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {title}
            </Text>
            <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ✅ Popover Menu */}
      <HeaderMenu
        visible={menuVisible}
        top={insets.top + 58} // position below status/header area
        onClose={() => setMenuVisible(false)}
        onSearch={onPressSearch}
        onPin={onPressPin}
        onMute={onPressMute}
        onClear={onPressClear}
      />

      {/* Chat */}
      <View style={styles.body}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 20 }, // Adjusted padding since footer is outside
          ]}
          renderItem={({ item }) => <MessageRow message={item} showAvatar={item.sender === "other"} />}
          ListHeaderComponent={<DayChip label="Today" />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      </View>

      {/* Input Section with Footer */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        
        {/* Input Bar */}
        <View style={[
            styles.inputBar, 
            { paddingBottom: activeFooter !== 'none' ? 10 : insets.bottom + 10 }
        ]}>
          <TouchableOpacity style={styles.smallIconBtn} onPress={toggleAttachments}>
            <Ionicons 
              name="attach" 
              size={20} 
              color={activeFooter === 'attachments' ? COLORS.primary : "#6B7280"} 
            />
          </TouchableOpacity>

          <View style={styles.inputWrap}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
              returnKeyType="send"
              onSubmitEditing={onSend}
            />
          </View>

          <TouchableOpacity style={styles.smallIconBtn} onPress={toggleEmojis}>
            <Ionicons 
              name={activeFooter === 'emojis' ? "happy" : "happy-outline"} 
              size={20} 
              color={activeFooter === 'emojis' ? COLORS.primary : "#6B7280"} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendBtn} onPress={onSend} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ✅ Custom Footer Panels */}
        {activeFooter !== 'none' && (
          <View style={[styles.footerPanel, { paddingBottom: insets.bottom + 10 }]}>
            
            {/* Attachment Grid */}
            {activeFooter === 'attachments' && (
              <View style={styles.attachmentGrid}>
                {ATTACHMENT_ITEMS.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.attachItem} onPress={() => Alert.alert("Sent", item.label)}>
                    <View style={[styles.attachIconBg, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                    </View>
                    <Text style={styles.attachLabel}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Emoji Grid */}
            {activeFooter === 'emojis' && (
              <View style={{ flex: 1 }}>
                <View style={styles.emojiHeader}>
                  <Text style={styles.emojiTitle}>Select Emoji</Text>
                  <TouchableOpacity onPress={() => setActiveFooter('none')}>
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.emojiGrid}>
                  {EMOJI_LIST.map((e, i) => (
                    <TouchableOpacity key={i} onPress={() => addEmoji(e)} style={styles.emojiItem}>
                      <Text style={{ fontSize: 26 }}>{e}</Text>
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

// ... HeaderMenu, MenuItem, DayChip, MessageRow components remain exactly the same ...
function HeaderMenu({
  visible,
  top,
  onClose,
  onSearch,
  onPin,
  onMute,
  onClear,
}: {
  visible: boolean;
  top: number;
  onClose: () => void;
  onSearch: () => void;
  onPin: () => void;
  onMute: () => void;
  onClear: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={menuStyles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={menuStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[menuStyles.menuCard, { top }]}>
        <MenuItem icon="search" label="Search Chat" onPress={onSearch} />
        <MenuItem icon="bookmark-outline" label="Pin Chat" onPress={onPin} />
        <MenuItem icon="volume-mute-outline" label="Mute Chat" onPress={onMute} />
        <View style={menuStyles.divider} />
        <MenuItem icon="trash-outline" label="Clear Chat" danger onPress={onClear} />
      </View>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={menuStyles.item} onPress={onPress} activeOpacity={0.85}>
      <Ionicons name={icon} size={18} color={danger ? "#EF4444" : "#111827"} style={{ width: 22 }} />
      <Text style={[menuStyles.itemText, danger && { color: "#EF4444" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function DayChip({ label }: { label: string }) {
  return (
    <View style={styles.dayChipWrap}>
      <View style={styles.dayChip}>
        <Text style={styles.dayChipText}>{label}</Text>
      </View>
    </View>
  );
}

function MessageRow({ message, showAvatar }: { message: Message; showAvatar: boolean }) {
  const isMe = message.sender === "me";
  return (
    <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
      {!isMe && showAvatar ? (
        <View style={styles.smallAvatar}>
          <Ionicons name="person" size={14} color="#6B7280" />
        </View>
      ) : (
        !isMe && <View style={{ width: 30 }} />
      )}

      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.msgText, isMe ? styles.msgTextMe : styles.msgTextOther]}>{message.text}</Text>
      </View>

      <Text style={[styles.timeText, isMe ? styles.timeRight : styles.timeLeft]}>{message.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#CFE7FF" },

  header: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  headerIconBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitleWrap: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  avatarImg: { width: "100%", height: "100%" },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { color: "#fff", fontWeight: "800", fontSize: 15 },
  headerSubtitle: { color: "#DCEBFF", fontSize: 12, marginTop: 1 },

  body: { flex: 1, backgroundColor: "#D7EEFF" },
  listContent: { paddingHorizontal: 12, paddingTop: 8 },

  dayChipWrap: { alignItems: "center", marginVertical: 8 },
  dayChip: {
    backgroundColor: "rgba(255,255,255,0.65)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dayChipText: { color: "#374151", fontWeight: "700", fontSize: 12 },

  row: { marginBottom: 14 },
  rowLeft: { alignItems: "flex-start" },
  rowRight: { alignItems: "flex-end" },

  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleOther: { backgroundColor: "#FFFFFF" },
  bubbleMe: { backgroundColor: "#2563EB" },

  msgText: { fontSize: 14, lineHeight: 20 },
  msgTextOther: { color: "#111827" },
  msgTextMe: { color: "#FFFFFF", fontWeight: "700" },

  timeText: { fontSize: 11, color: "#374151", marginTop: 6 },
  timeLeft: { alignSelf: "flex-start" },
  timeRight: { alignSelf: "flex-end" },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#F8FAFC",
  },
  smallIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2F7",
  },
  inputWrap: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  textInput: { fontSize: 14, color: "#111827", paddingVertical: 0 },

  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ New Styles for Footer Panels
  footerPanel: {
    backgroundColor: "#fff",
    height: 280, // Fixed height for panel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    overflow: "hidden",
  },
  
  // Attachments
  attachmentGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 24,
    justifyContent: 'space-between',
  },
  attachItem: {
    width: '22%', 
    alignItems: 'center',
    marginBottom: 20,
  },
  attachIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  attachLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center'
  },

  // Emojis
  emojiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  emojiTitle: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  emojiItem: {
    width: '12.5%', 
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const menuStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  menuCard: {
    position: "absolute",
    right: 12,
    width: 210,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 10,
  },
  item: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
    marginHorizontal: 10,
  },
});