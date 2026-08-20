import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors } from "@/theme/tokens";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops" }} />
      <View style={styles.container}>
        <AppText variant="heading">This screen doesn't exist.</AppText>
        <Link href="/" style={styles.link}>
          <AppText color={colors.navy}>Go home</AppText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.background,
    gap: 12,
  },
  link: {
    marginTop: 8,
    paddingVertical: 12,
  },
});
