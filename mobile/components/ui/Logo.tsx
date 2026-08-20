import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Icon } from "@/components/ui/Icon";
import { colors, radius, type } from "@/theme/tokens";

export function Logo() {
  return (
    <View style={styles.chip}>
      <Icon name="logo-mark" size={40} />
      <View>
        <AppText style={styles.name}>Caring Angels</AppText>
        <AppText style={styles.sub}>HOMECARE</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  name: {
    fontFamily: type.extraBold,
    fontSize: 16,
    color: colors.navy,
    letterSpacing: -0.5,
  },
  sub: {
    fontFamily: type.bold,
    fontSize: 10,
    color: colors.red,
    letterSpacing: 1.5,
  },
});
