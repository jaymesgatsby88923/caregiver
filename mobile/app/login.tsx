import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/api";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { TextField } from "@/components/ui/TextField";
import { colors, space } from "@/theme/tokens";
import type { UserRole } from "@/types";

function homeFor(role: UserRole) {
  if (role === "caregiver") return "/(caregiver)";
  if (role === "client") return "/(client)";
  return "/admin";
}

export default function LoginScreen() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Redirect href={homeFor(user.role)} />;
  }

  async function handleSignIn() {
    setError("");
    setSubmitting(true);
    try {
      const current = await login(email.trim(), password);
      router.replace(homeFor(current.role));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Please try again.",
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
            <AppText variant="title">Welcome back</AppText>
            <AppText>
              Sign in to your care dashboard to view today's assignments and
              client updates.
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
            <TextField
              label="Password"
              secureTextEntry
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
            />
            {error ? (
              <View style={styles.errorBox}>
                <AppText color={colors.error}>{error}</AppText>
              </View>
            ) : null}
            <Button
              label="Sign In"
              onPress={handleSignIn}
              loading={submitting}
              disabled={!email || !password}
            />
          </View>
        </View>
        <AppText variant="muted" center style={styles.footer}>
          Protected by secure care network
        </AppText>
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
    justifyContent: "space-between",
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
  footer: {
    paddingBottom: space.xl,
  },
});
