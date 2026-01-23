import React, { useMemo, useState, useCallback } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ChatStackParamList } from '../../navigation/types'; // 按你项目路径
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Contact = {
    id: string;
    name: string;
    title: string;
};

type Nav = NativeStackNavigationProp<ChatStackParamList, 'AddChat'>;

export default function AddChatScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<Nav>();


    const [tab, setTab] = useState<"private" | "group">("private");
    const [q, setQ] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const tabBarStyle = {
        height: 56 + insets.bottom,
        paddingBottom: insets.bottom,
        paddingTop: 6,
        backgroundColor: COLORS.primary,
        borderTopWidth: 0,
    };

    useFocusEffect(
        useCallback(() => {
            const parent = navigation.getParent();

            // ✅ hide
            parent?.setOptions({
                tabBarStyle: { display: "none" },
            });

            // ✅ restore EXACT style
            return () => {
                parent?.setOptions({
                    tabBarStyle,
                });
            };
        }, [navigation, insets.bottom])
    );

    const data = useMemo<Contact[]>(
        () => [
            { id: "1", name: "Sarah Johnson", title: "Product Manager" },
            { id: "2", name: "Michael Chen", title: "Senior Developer" },
            { id: "3", name: "Emma Williams", title: "UX Designer" },
            { id: "4", name: "James Taylor", title: "Marketing Lead" },
            { id: "5", name: "David Martinez", title: "Sales Manager" },
            { id: "6", name: "Lisa Anderson", title: "HR Specialist" },
            { id: "7", name: "Robert Kim", title: "DevOps Engineer" },
        ],
        []
    );

    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        if (!qq) return data;
        return data.filter((x) => `${x.name} ${x.title}`.toLowerCase().includes(qq));
    }, [data, q]);

    const onPressCreate = () => {
        // TODO:
    };

    return (
        // ✅ 背景全屏不被 SafeArea 推
        <SafeAreaView style={styles.screen} edges={[]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity style={styles.headerIconBtn}  onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>New Chat</Text>

                <TouchableOpacity style={styles.createBtn} onPress={onPressCreate} activeOpacity={0.85}>
                    <Text style={styles.createText}>Create</Text>
                </TouchableOpacity>
            </View>

            {/* Segmented */}
            <View style={styles.segmentWrap}>
                <View style={styles.segment}>
                    <TouchableOpacity
                        style={[styles.segmentItem, tab === "private" && styles.segmentItemActive]}
                        onPress={() => setTab("private")}
                        activeOpacity={0.9}
                    >
                        <Ionicons
                            name="person-outline"
                            size={16}
                            color={tab === "private" ? COLORS.primary : "#EAF1FF"}
                        />
                        <Text style={[styles.segmentText, tab === "private" && styles.segmentTextActive]}>
                            Private Chat
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.segmentItem, tab === "group" && styles.segmentItemActive]}
                        onPress={() => setTab("group")}
                        activeOpacity={0.9}
                    >
                        <Ionicons
                            name="people-outline"
                            size={16}
                            color={tab === "group" ? COLORS.primary : "#EAF1FF"}
                        />
                        <Text style={[styles.segmentText, tab === "group" && styles.segmentTextActive]}>
                            Group Chat
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.search}>
                    <Ionicons name="search" size={18} color="rgba(0,0,0,0.45)" />
                    <TextInput
                        value={q}
                        onChangeText={setQ}
                        placeholder="Search contacts..."
                        placeholderTextColor="rgba(0,0,0,0.35)"
                        style={styles.searchInput}
                        returnKeyType="search"
                    />
                </View>

                <Text style={styles.hint}>
                    {tab === "private"
                        ? "Select a contact to start a private conversation"
                        : "Select contacts to start a group chat"}
                </Text>

                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    // ✅ 最后一条不被底部(输入框/按钮)挡住
                    contentContainerStyle={{ paddingBottom: 72 + insets.bottom }}
                    renderItem={({ item }) => {
                        const selected = selectedId === item.id;
                        return (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => setSelectedId(item.id)}
                                activeOpacity={0.85}
                            >
                                <View style={styles.avatar}>
                                    <Ionicons name="person" size={26} color="rgba(0,0,0,0.35)" />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.sub}>{item.title}</Text>
                                </View>

                                <View style={[styles.radio, selected && styles.radioSelected]}>
                                    {selected ? <View style={styles.radioDot} /> : null}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                />
            </View>

            {/* ✅ 如果你这页以后要加底部输入框/按钮条，就用这个 */}
            {/* 
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 10 }]}>
        <Text style={{ fontWeight: "800" }}>Input Bar / Bottom Actions</Text>
      </View>
      */}
        </SafeAreaView>
    );
}

const COLORS = {
    primary: "#1E63FF",
    bg: "#EAF1FF",
    card: "#FFFFFF",
    border: "rgba(0,0,0,0.06)",
    text: "#111827",
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: COLORS.bg },

    header: {
        backgroundColor: COLORS.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingBottom: 12,
    },
    headerIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
        marginRight: 36,
    },
    createBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: "rgba(0,0,0,0.18)",
    },
    createText: { color: "#fff", fontWeight: "800", fontSize: 13 },

    segmentWrap: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingBottom: 12,
    },
    segment: {
        borderRadius: 999,
        backgroundColor: "rgba(0,0,0,0.18)",
        padding: 4,
        flexDirection: "row",
        gap: 6,
    },
    segmentItem: {
        flex: 1,
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    segmentItemActive: { backgroundColor: "#fff" },
    segmentText: { color: "#EAF1FF", fontWeight: "800", fontSize: 13 },
    segmentTextActive: { color: COLORS.primary },

    content: { flex: 1, paddingHorizontal: 14, paddingTop: 12 },

    search: {
        height: 44,
        borderRadius: 999,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

    hint: {
        marginTop: 12,
        marginBottom: 10,
        color: "rgba(0,0,0,0.55)",
        fontSize: 13,
    },

    card: {
        backgroundColor: COLORS.card,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(0,0,0,0.06)",
        alignItems: "center",
        justifyContent: "center",
    },
    name: { fontSize: 15, fontWeight: "900", color: COLORS.text },
    sub: { marginTop: 2, fontSize: 12, color: "rgba(0,0,0,0.40)", fontWeight: "600" },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.18)",
        alignItems: "center",
        justifyContent: "center",
    },
    radioSelected: { borderColor: COLORS.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

    // 可选：底部输入框/按钮条样式
    inputBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 10,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "rgba(0,0,0,0.06)",
    },
});
