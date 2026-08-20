import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/api";
import { authService } from "@/services/authService";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { TextField } from "@/components/ui/TextField";
import { colors, space, type } from "@/theme/tokens";

export default function ForgotPasswordScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Redirect href="/" />;
  }

  async function handleSend() {
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      await authService.forgotPassword(email.trim());
      setNotice(
        "If that email is on file, we sent a reset link. Open it in your browser to choose a new password, then come back here to sign in.",
      );
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to send a reset email. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          <View style={styles.brand}>
            <Logo />
          </View>
          <View style={styles.header}>
            <AppText variant="title">Forgot password</AppText>
            <AppText>
              We’ll email a reset link if this address has an account. The link
              opens on the website.
            </AppText>
          </View>
          <View style={styles.form}>
            <TextField
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
            />
            {error ? (
              <View style={styles.errorBox}>
                <AppText color={colors.error}>{error}</AppText>
              </View>
            ) : null}
            {notice ? (
              <View style={styles.noticeBox}>
                <AppText color={colors.navy}>{notice}</AppText>
              </View>
            ) : null}
            <Button
              label="Send reset link"
              onPress={handleSend}
              loading={submitting}
              disabled={!email}
            />
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <AppText style={styles.back} center>
                ← Back to sign in
              </AppText>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 28,
    gap: 36,
    paddingTop: 20,
  },
  brand: {
    alignItems: "center",
  },
  header: {
    gap: 8,
  },
  form: {
    gap: 16,
  },
  errorBox: {
    backgroundColor: colors.errorBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  noticeBox: {
    backgroundColor: colors.tealSoft,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  back: {
    fontFamily: type.semibold,
    fontSize: 14,
    color: colors.navy,
    marginTop: space.sm,
  },
});
