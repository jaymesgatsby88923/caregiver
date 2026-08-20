import { StyleSheet, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Avatar } from "@/components/ui/Avatar";
import { colors, radius, type } from "@/theme/tokens";
import { initials } from "@/lib/format";

export function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Screen>
      <View style={styles.hero}>
        <Avatar initials={initials(user.first_name)} size={72} />
        <AppText variant="heading">{user.first_name}</AppText>
        <View style={styles.role}>
          <AppText style={styles.roleText}>{user.role}</AppText>
        </View>
      </View>
      <Button label="Log out" variant="secondary" onPress={() => logout()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  role: {
    backgroundColor: colors.tealSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roleText: {
    fontFamily: type.semibold,
    fontSize: 13,
    color: colors.teal,
    textTransform: "capitalize",
  },
});
