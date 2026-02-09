// src/screens/auth/ForgotPasswordScreen.tsx
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgetPassword">;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets(); // 用于动态处理全屏下的安全边距
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    if (!phone || !code || !password || !confirmPwd) return false;
    if (password.length < 6) return false;
    if (password !== confirmPwd) return false;
    return true;
  }, [phone, code, password, confirmPwd]);

  const handleConfirm = async () => {
    if (!canSubmit) {
      Alert.alert("提示", "请完整填写信息");
      return;
    }

    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800)); // mock API call
      Alert.alert("成功", "密码已重置", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert("失败", e?.message ?? "请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. 全屏背景渐变层 */}
      <LinearGradient
        colors={["#2F7BFF", "#2D69FF", "#3A58FF"]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill} // 铺满整个屏幕，包括状态栏
      />

      {/* 2. 内容层 - 使用 insets 手动避开危险区域 */}
      <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Back Button */}
          <View style={styles.topRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoWrap}>
              <View style={styles.logoInner}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={26}
                  color="#2F7BFF"
                />
              </View>
            </View>
            <Text style={styles.title}>忘记密码</Text>
            <Text style={styles.subtitle}>重置您的密码以继续使用</Text>
          </View>

          {/* Input Card */}
          <View style={styles.card}>
            {/* Phone Input */}
            <View style={styles.inputWrap}>
              <Ionicons
                name="call-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                placeholder="请输入您的手机号码"
                placeholderTextColor="#A0A8B0"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
              />
            </View>

            {/* Verification Code */}
            <View style={[styles.inputWrap, { marginTop: 12 }]}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                placeholder="验证码"
                placeholderTextColor="#A0A8B0"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                style={[styles.input, { paddingRight: 110 }]}
              />
              <TouchableOpacity style={styles.codeBtn}>
                <Text style={styles.codeText}>获取验证码</Text>
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View style={[styles.inputWrap, { marginTop: 12 }]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                placeholder="请输入新密码"
                placeholderTextColor="#A0A8B0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure1}
                style={[styles.input, { paddingRight: 42 }]}
              />
              <TouchableOpacity
                onPress={() => setSecure1(!secure1)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={secure1 ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9AA6B2"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={[styles.inputWrap, { marginTop: 12 }]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9AA6B2"
                style={styles.leftIcon}
              />
              <TextInput
                placeholder="请再次确认密码"
                placeholderTextColor="#A0A8B0"
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                secureTextEntry={secure2}
                style={[styles.input, { paddingRight: 42 }]}
              />
              <TouchableOpacity
                onPress={() => setSecure2(!secure2)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={secure2 ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9AA6B2"
                />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!canSubmit || loading}
              style={[
                styles.submitBtn,
                (!canSubmit || loading) && { opacity: 0.6 },
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>确认重置</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Links */}
          <View style={styles.bottom}>
            <Text style={styles.bottomHint}>记起密码了？</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.bottomLink}>立即登录</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F7BFF", // 兜底颜色
  },
  topRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginVertical: 15,
  },
  logoWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    // 增加一点柔和阴影
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    borderRadius: 28,
    padding: 24,
    // 提升卡片质感
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  inputWrap: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#1E293B",
  },
  eyeBtn: {
    paddingHorizontal: 12,
    height: "100%",
    justifyContent: "center",
  },
  codeBtn: {
    position: "absolute",
    right: 8,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#2F7BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  codeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 24,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#2F7BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2F7BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  bottom: {
    alignItems: "center",
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bottomHint: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  bottomLink: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    textDecorationLine: 'underline'
  },
});