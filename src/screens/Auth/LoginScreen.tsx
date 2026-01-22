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

import { AuthStackParamList } from "../../navigation/types";
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth(); // ✅ move hook to top

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailTrimmed = useMemo(() => email.trim(), [email]);

  const canSubmit = useMemo(() => {
    if (!emailTrimmed || !password) return false;
    if (password.length < 6) return false;
    if (!emailRegex.test(emailTrimmed)) return false;
    return true;
  }, [emailTrimmed, password]);

  const handleLogin = async () => {
    if (!canSubmit) {
      Alert.alert("Invalid info", "Please enter a valid email and password.");
      return;
    }

    try {
      setLoading(true);

      // ✅ REAL login
      await signIn(email, password);

      // ❌ DO NOT navigate here
      // AuthContext + RootNavigator will handle it
    } catch (e: any) {
      Alert.alert(
        "Login failed",
        e?.message ?? "Email or password is incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
            />

            <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9AA0A6"
                style={[styles.input, styles.passwordInput]}
                secureTextEntry={secure}
                autoCapitalize="none"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                onPress={() => setSecure(s => !s)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeText}>
                  {secure ? "Show" : "Hide"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgetPassword")}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={!canSubmit || loading}
              style={[
                styles.loginBtn,
                (!canSubmit || loading) && styles.loginBtnDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>No account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.linkText}> Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: "#0B0F14" },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#B8C0CC",
  },
  form: {
    marginTop: 28,
  },
  label: {
    color: "#D6DCE6",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#1F2A37",
    backgroundColor: "#0F1720",
    color: "#FFFFFF",
    fontSize: 15,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 72,
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#142033",
  },
  eyeText: {
    color: "#CFE3FF",
    fontWeight: "700",
    fontSize: 12,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 18,
  },
  forgotText: {
    color: "#8AB4FF",
    fontWeight: "600",
  },
  loginBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7DFF",
  },
  loginBtnDisabled: {
    opacity: 0.55,
  },
  loginText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  bottomText: {
    color: "#B8C0CC",
  },
  linkText: {
    color: "#8AB4FF",
    fontWeight: "800",
  },
});
