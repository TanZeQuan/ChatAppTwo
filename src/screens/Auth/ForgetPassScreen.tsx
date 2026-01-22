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
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "ForgetPassword">;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailTrimmed = useMemo(() => email.trim(), [email]);

  const canSubmit = useMemo(() => {
    return emailRegex.test(emailTrimmed);
  }, [emailTrimmed]);

  const handleSend = async () => {
    if (!canSubmit) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Replace with your real API call:
      // await forgotPasswordApi({ email: emailTrimmed });

      await new Promise((r) => setTimeout(r, 900)); // demo delay

      Alert.alert(
        "Check your email",
        "If an account exists, a reset link has been sent.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert("Failed", e?.message ?? "Please try again.");
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
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we’ll send a reset link.
          </Text>

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
              returnKeyType="done"
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity
              onPress={handleSend}
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
                <Text style={styles.primaryText}>Send reset link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.secondaryBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryText}>Back to login</Text>
            </TouchableOpacity>
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

  secondaryBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121A24",
    borderWidth: 1,
    borderColor: "#1F2A37",
  },
  secondaryText: { color: "#CFE3FF", fontWeight: "700", fontSize: 14 },
});
