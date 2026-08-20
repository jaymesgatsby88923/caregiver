import type { ReactNode } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, space } from "@/theme/tokens";

type ScreenProps = {
  children?: ReactNode;
  scroll?: boolean;
  loading?: boolean;
  padded?: boolean;
  contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
};

export function Screen({
  children,
  scroll = true,
  loading = false,
  padded = true,
  contentContainerStyle,
}: ScreenProps) {
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.navy} />
        </View>
      </SafeAreaView>
    );
  }

  if (!scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={[styles.body, padded && styles.padded]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          padded && styles.padded,
          styles.scroll,
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: space.screen,
  },
  scroll: {
    paddingBottom: 32,
    gap: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
