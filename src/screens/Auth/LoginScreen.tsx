// src/screens/auth/LoginScreen.tsx
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
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

// 你截图是“手机号+密码”，这里用一个简单的手机号校验（可按你后端规则改）
const phoneRegex = /^[0-9]{8,15}$/;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const phoneTrimmed = useMemo(() => phone.trim(), [phone]);

  const canSubmit = useMemo(() => {
    if (!phoneTrimmed || !password) return false;
    if (password.length < 6) return false;
    if (!phoneRegex.test(phoneTrimmed)) return false;
    return true;
  }, [phoneTrimmed, password]);

  const handleLogin = async () => {
    if (!canSubmit) {
      Alert.alert("提示", "请输入正确的手机号和密码");
      return;
    }

    try {
      setLoading(true);
      // 如果你后端 signIn 仍然是 email/password，你就在 AuthContext 内部做映射
      await signIn(phoneTrimmed as any, password);
    } catch (e: any) {
      Alert.alert("登录失败", e?.message ?? "手机号或密码不正确");
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
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Top bar */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Header center icon + text */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <View style={styles.logoInner}>
                <Ionicons name="chatbubble-ellipses" size={28} color="#2F7BFF" />
              </View>
            </View>

            <Text style={styles.title}>欢迎回来</Text>
            <Text style={styles.subtitle}>请登录</Text>
          </View>

          {/* White card */}
          <View style={styles.card}>
            {/* Phone */}
            <Text style={styles.label}>手机号码</Text>
            <View style={styles.inputWrap}>
              <View style={styles.leftIcon}>
                <Ionicons name="call-outline" size={18} color="#9AA6B2" />
              </View>
              <TextInput
                value={phone}
                onChangeText={(t) => setPhone(t.replace(/[^\d]/g, ""))}
                keyboardType="phone-pad"
                placeholder="请输入您的手机号码"
                placeholderTextColor="#A8B0BA"
                style={styles.input}
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <Text style={[styles.label, { marginTop: 14 }]}>密码</Text>
            <View style={styles.inputWrap}>
              <View style={styles.leftIcon}>
                <Ionicons name="lock-closed-outline" size={18} color="#9AA6B2" />
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="请输入您的密码"
                placeholderTextColor="#A8B0BA"
                style={[styles.input, { paddingRight: 44 }]}
                secureTextEntry={secure}
                autoCapitalize="none"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setSecure((s) => !s)}
                style={styles.rightIconBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9AA6B2"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword")}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>忘记密码？</Text>
            </TouchableOpacity>

            {/* Login button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={!canSubmit || loading}
              style={[
                styles.loginBtn,
                (!canSubmit || loading) && styles.loginBtnDisabled,
              ]}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>登录</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Bottom */}
          <View style={styles.bottomArea}>
            <Text style={styles.bottomHint}>没有账号？</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.bottomLink}>创建账号</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#2F7BFF" },
  bg: { flex: 1 },

  topRow: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  header: {
    alignItems: "center",
    marginTop: 26,
    marginBottom: 18,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },

  card: {
    marginTop: 6,
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    // shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    // elevation (Android)
    elevation: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#263238",
    marginBottom: 8,
  },

  inputWrap: {
    position: "relative",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6ECF4",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  leftIcon: {
    position: "absolute",
    left: 12,
    width: 22,
    alignItems: "center",
  },
  input: {
    height: 48,
    paddingLeft: 42,
    paddingRight: 12,
    fontSize: 14,
    color: "#111827",
  },
  rightIconBtn: {
    position: "absolute",
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 14,
  },
  forgotText: {
    color: "#2F7BFF",
    fontWeight: "700",
    fontSize: 13,
  },

  loginBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F7BFF",
  },
  loginBtnDisabled: {
    opacity: 0.55,
  },
  loginText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },

  bottomArea: {
    alignItems: "center",
    marginTop: 18,
  },
  bottomHint: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    fontSize: 12,
  },
  bottomLink: {
    marginTop: 6,
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
});
