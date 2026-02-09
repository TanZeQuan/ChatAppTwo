// src/screens/auth/RegisterScreen.tsx
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{8,15}$/;

export default function RegisterScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const nameTrimmed = useMemo(() => fullName.trim(), [fullName]);
  const phoneTrimmed = useMemo(() => phone.trim(), [phone]);
  const emailTrimmed = useMemo(() => email.trim(), [email]);

  const canSubmit = useMemo(() => {
    if (!nameTrimmed) return false;
    if (!phoneRegex.test(phoneTrimmed)) return false;
    if (!emailRegex.test(emailTrimmed)) return false;
    if (password.length < 6) return false;
    if (confirm !== password) return false;
    return true;
  }, [nameTrimmed, phoneTrimmed, emailTrimmed, password, confirm]);

  const handleRegister = async () => {
    if (!canSubmit) {
      Alert.alert("提示", "请检查输入内容");
      return;
    }

    try {
      setLoading(true);

      // TODO: 这里换成你真实 API
      // await registerApi({ name: nameTrimmed, phone: phoneTrimmed, email: emailTrimmed, password });

      await new Promise((r) => setTimeout(r, 900));

      Alert.alert("创建成功", "你现在可以登录了", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (e: any) {
      Alert.alert("创建失败", e?.message ?? "请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <LinearGradient
        colors={["#2F7BFF", "#2D69FF", "#3A58FF"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.bg}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Top bar */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>

            {/* progress dots */}
            <View style={styles.dotsRow}>
              <View style={[styles.dot, { opacity: 0.35 }]} />
              <View style={[styles.dot, { opacity: 0.35 }]} />
              <View style={styles.dotActive} />
            </View>

            <View style={{ width: 34 }} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarInner}>
                <Ionicons name="person" size={26} color="#2F7BFF" />
              </View>
            </View>

            <Text style={styles.title}>完成账号创建</Text>
            <Text style={styles.subtitle}>完善资料</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Name */}
            <Text style={styles.label}>您的名字</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="person-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="请输入您的名字"
                placeholderTextColor="#A0A8B0"
                style={styles.input}
                returnKeyType="next"
              />
            </View>

            {/* Phone */}
            <Text style={[styles.label, { marginTop: 12 }]}>手机号码</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="call-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/[^\d]/g, ""))}
                placeholder="请输入您的手机号码"
                placeholderTextColor="#A0A8B0"
                keyboardType="phone-pad"
                style={styles.input}
                returnKeyType="next"
              />
            </View>

            {/* Email */}
            <Text style={[styles.label, { marginTop: 12 }]}>邮箱</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="请输入您的邮箱"
                placeholderTextColor="#A0A8B0"
                style={styles.input}
                returnKeyType="next"
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { marginTop: 12 }]}>密码</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="请输入您的密码"
                placeholderTextColor="#A0A8B0"
                secureTextEntry={secure1}
                style={[styles.input, { paddingRight: 42 }]}
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setSecure1((s) => !s)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={secure1 ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9AA6B2"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm */}
            <Text style={[styles.label, { marginTop: 12 }]}>确认密码</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="请确认您的密码"
                placeholderTextColor="#A0A8B0"
                secureTextEntry={secure2}
                style={[styles.input, { paddingRight: 42 }]}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
              <TouchableOpacity
                onPress={() => setSecure2((s) => !s)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={secure2 ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9AA6B2"
                />
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={!canSubmit || loading}
              style={[
                styles.submitBtn,
                (!canSubmit || loading) && { opacity: 0.55 },
              ]}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>创建账号</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#2F7BFF" },
  bg: { flex: 1 },

  topRow: {
    paddingHorizontal: 18,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  dotsRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },
  dotActive: {
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },

  header: {
    alignItems: "center",
    marginTop: 18,
    marginBottom: 12,
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "900", color: "#FFFFFF" },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },

  card: {
    marginTop: 10,
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#263238",
    marginBottom: 6,
  },

  inputWrap: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6ECF4",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    position: "relative",
  },
  leftIcon: { position: "absolute", left: 12 },
  input: {
    height: 46,
    paddingLeft: 42,
    paddingRight: 12,
    fontSize: 14,
    color: "#111827",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  submitBtn: {
    marginTop: 16,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#8DB7FF", // 截图是偏浅蓝按钮
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
});
