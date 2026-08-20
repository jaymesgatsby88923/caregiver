import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Avatar } from "@/components/ui/Avatar";
import { colors, type } from "@/theme/tokens";

type GreetingHeaderProps = {
  kicker: string;
  name: string;
  initials: string;
  onPressAvatar?: () => void;
};

export function GreetingHeader({
  kicker,
  name,
  initials,
  onPressAvatar,
}: GreetingHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <AppText style={styles.kicker}>{kicker}</AppText>
        <AppText variant="heading">{name}</AppText>
      </View>
      <Pressable onPress={onPressAvatar} disabled={!onPressAvatar}>
        <Avatar initials={initials} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    gap: 4,
    flex: 1,
    paddingRight: 16,
  },
  kicker: {
    fontFamily: type.semibold,
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
