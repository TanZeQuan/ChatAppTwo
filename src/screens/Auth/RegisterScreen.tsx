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
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailTrimmed = useMemo(() => email.trim(), [email]);
  const nameTrimmed = useMemo(() => name.trim(), [name]);

  const passwordOk = password.length >= 6;
  const confirmOk = confirm.length >= 6 && confirm === password;

  const canSubmit = useMemo(() => {
    if (!nameTrimmed) return false;
    if (!emailRegex.test(emailTrimmed)) return false;
    if (!passwordOk) return false;
    if (!confirmOk) return false;
    return true;
  }, [nameTrimmed, emailTrimmed, passwordOk, confirmOk]);

  const handleRegister = async () => {
    if (!canSubmit) {
      Alert.alert("Invalid info", "Please check your inputs and try again.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Replace with your real API call:
      // await registerApi({
      //   name: nameTrimmed,
      //   email: emailTrimmed,
      //   password,
      // });

      await new Promise((r) => setTimeout(r, 900)); // demo delay

      Alert.alert("Account created", "You can now log in.", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (e: any) {
      Alert.alert("Register failed", e?.message ?? "Please try again.");
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 14 }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              returnKeyType="next"
            />

            <Text style={[styles.label, { marginTop: 14 }]}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="At least 6 characters"
                placeholderTextColor="#9AA0A6"
                style={[styles.input, styles.passwordInput]}
                secureTextEntry={secure}
                autoCapitalize="none"
                returnKeyType="next"
              />
              <TouchableOpacity
                onPress={() => setSecure((s) => !s)}
                style={styles.eyeBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.eyeText}>{secure ? "Show" : "Hide"}</Text>
              </TouchableOpacity>
            </View>
            {!passwordOk ? (
              <Text style={styles.hint}>Password must be at least 6 characters.</Text>
            ) : null}

            <Text style={[styles.label, { marginTop: 14 }]}>Confirm password</Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Repeat password"
              placeholderTextColor="#9AA0A6"
              style={styles.input}
              secureTextEntry={secure}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
            {confirm.length > 0 && !confirmOk ? (
              <Text style={styles.hint}>Passwords do not match.</Text>
            ) : null}

            <TouchableOpacity
              onPress={handleRegister}
              disabled={!canSubmit || loading}
              style={[
                styles.primaryBtn,
                (!canSubmit || loading) && styles.btnDisabled,
              ]}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.primaryText}>Create account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.replace("Login")}
                activeOpacity={0.8}
              >
                <Text style={styles.linkText}> Login</Text>
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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },

  title: { fontSize: 28, fontWeight: "800", color: "#FFFFFF" },
  subtitle: { marginTop: 8, fontSize: 14, color: "#B8C0CC" },

  form: { marginTop: 28 },
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

  passwordRow: { flexDirection: "row", alignItems: "center" },
  passwordInput: { flex: 1, paddingRight: 72 },
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
  eyeText: { color: "#CFE3FF", fontWeight: "700", fontSize: 12 },

  hint: { marginTop: 8, color: "#FFB4B4", fontSize: 12, fontWeight: "600" },

  primaryBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2D7DFF",
  },
  btnDisabled: { opacity: 0.55 },
  primaryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  bottomText: { color: "#B8C0CC" },
  linkText: { color: "#8AB4FF", fontWeight: "800" },
});
