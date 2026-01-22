// src/screens/chat/GroupRoomScreen.tsx
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
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "@/src/styles/colors";

// ✅ Adjust to your real stacks/types
type RootStackParamList = {
  GroupRoom: { roomId: string; title: string; membersCount?: number };
};

type Nav = NativeStackNavigationProp<RootStackParamList, "GroupRoom">;

type GroupMessage = {
  id: string;
  text: string;
  sender: "me" | "other";
  senderName?: string;
  time: string;
};

export default function GroupRoomScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute() as any;
  const insets = useSafeAreaInsets();

  const { title, membersCount } = route.params ?? { title: "Project Team", membersCount: 5 };

  const [menuVisible, setMenuVisible] = useState(false);

  const [input, setInput] = useState("");
  const listRef = useRef<FlatList<GroupMessage>>(null);

  // ✅ restore TabBar style when leaving room
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

      // ✅ hide tabs inside room
      parent?.setOptions({ tabBarStyle: { display: "none" } });

      // ✅ restore on leave
      return () => parent?.setOptions({ tabBarStyle });
    }, [navigation, tabBarStyle])
  );

  const [messages, setMessages] = useState<GroupMessage[]>([
    { id: "1", sender: "other", senderName: "Sarah Johnson", text: "Hey team! How's everyone doing?", time: "10:30 AM" },
    { id: "2", sender: "other", senderName: "Michael Chen", text: "Doing great! Just finished the new feature.", time: "10:32 AM" },
    { id: "3", sender: "other", senderName: "Emma Williams", text: "The designs are ready for review!", time: "10:33 AM" },
    { id: "4", sender: "me", text: "Perfect! I'll check them out now.", time: "10:35 AM" },
    { id: "5", sender: "other", senderName: "James Taylor", text: "Marketing campaign is ready to launch!", time: "10:40 AM" },
  ]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: GroupMessage = {
      id: String(Date.now()),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  // ✅ menu actions
  const onPressSearchHistory = () => {
    setMenuVisible(false);
    Alert.alert("Search History", "TODO: open search history screen");
  };

  const onPressGroupInfo = () => {
    setMenuVisible(false);
    Alert.alert("Group Info", "TODO: navigate to GroupSetting / GroupInfo");
    // example:
    // navigation.navigate('GroupSettingScreen', { chatId: route.params.roomId, chatName: title })
  };

  const onPressPinGroup = () => {
    setMenuVisible(false);
    Alert.alert("Pin Group", "TODO: pin group logic");
  };

  const onPressMuteGroup = () => {
    setMenuVisible(false);
    Alert.alert("Mute Group", "TODO: mute group logic");
  };

  const onPressLeaveGroup = () => {
    setMenuVisible(false);
    Alert.alert("Leave Group", "Are you sure you want to leave this group?", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: () => Alert.alert("Left", "TODO: call API to leave group") },
    ]);
  };

  return (
    /**
     * ✅ IMPORTANT:
     * edges={[]} so background covers the whole screen
     * inputBar uses insets.bottom to avoid home indicator
     */
    <SafeAreaView style={styles.safe} edges={[]}>
      {/* Header */}
      <View style={[styles.header, { height: 84 + insets.top, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
          <Ionicons name="arrow-back-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerMid}>
          <View style={styles.groupIcon}>
            <Ionicons name="people" size={18} color="#2563EB" />
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {title}
            </Text>
            <Text style={styles.headerSubtitle}>{membersCount ?? 0} members</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ✅ Menu like your screenshot */}
      <GroupHeaderMenu
        visible={menuVisible}
        top={insets.top + 58}
        onClose={() => setMenuVisible(false)}
        onSearchHistory={onPressSearchHistory}
        onGroupInfo={onPressGroupInfo}
        onPinGroup={onPressPinGroup}
        onMuteGroup={onPressMuteGroup}
        onLeaveGroup={onPressLeaveGroup}
      />

      {/* Chat */}
      <View style={styles.body}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          ListHeaderComponent={<DayChip label="Today" />}
          renderItem={({ item }) => <GroupMessageRow message={item} />}
          contentContainerStyle={[
            styles.listContent,
            // ✅ prevent last messages from being covered by input bar + safe area
            { paddingBottom: 72 + insets.bottom },
          ]}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        />
      </View>

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity style={styles.smallIconBtn} onPress={() => {}}>
            <Ionicons name="attach" size={20} color="#6B7280" />
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

          <TouchableOpacity style={styles.smallIconBtn} onPress={() => {}}>
            <Ionicons name="happy-outline" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendBtn} onPress={onSend} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function GroupHeaderMenu({
  visible,
  top,
  onClose,
  onSearchHistory,
  onGroupInfo,
  onPinGroup,
  onMuteGroup,
  onLeaveGroup,
}: {
  visible: boolean;
  top: number;
  onClose: () => void;
  onSearchHistory: () => void;
  onGroupInfo: () => void;
  onPinGroup: () => void;
  onMuteGroup: () => void;
  onLeaveGroup: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={menuStyles.overlay} pointerEvents="box-none">
      <TouchableOpacity style={menuStyles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={[menuStyles.menuCard, { top }]}>
        <MenuItem icon="search" label="Search History" onPress={onSearchHistory} />
        <MenuItem icon="people-outline" label="Group Info" onPress={onGroupInfo} />
        <MenuItem icon="bookmark-outline" label="Pin Group" onPress={onPinGroup} />
        <MenuItem icon="volume-mute-outline" label="Mute Group" onPress={onMuteGroup} />
        <View style={menuStyles.divider} />
        <MenuItem icon="log-out-outline" label="Leave Group" danger onPress={onLeaveGroup} />
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

function GroupMessageRow({ message }: { message: GroupMessage }) {
  const isMe = message.sender === "me";

  return (
    <View style={[styles.row, isMe ? styles.rowRight : styles.rowLeft]}>
      {!isMe ? (
        <View style={styles.senderTop}>
          <View style={styles.smallAvatar}>
            <Ionicons name="person" size={14} color="#6B7280" />
          </View>
          <Text style={styles.senderName}>{message.senderName}</Text>
        </View>
      ) : null}

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
  headerMid: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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

  senderTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  senderName: { fontSize: 12, fontWeight: "700", color: "#374151" },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
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
    width: 220,
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
