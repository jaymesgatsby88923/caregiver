import { StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { colors, radius } from "@/theme/tokens";

export default function AdminScreen() {
  const { user, logout } = useAuth();

  if (user && user.role !== "admin") {
    return <Redirect href="/" />;
  }

  return (
    <Screen>
      <View style={styles.card}>
        <AppText variant="heading">Admin is on the web</AppText>
        <AppText>
          Use caringangels.io to manage clients, caregivers, and shifts. This app
          is for caregivers and clients.
        </AppText>
      </View>
      <Button label="Log out" variant="secondary" onPress={() => logout()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
  },
});
