import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Icon, type IconName } from "@/components/ui/Icon";
import { colors, radius } from "@/theme/tokens";

type EmptyStateProps = {
  icon?: IconName;
  title: string;
  body: string;
};

export function EmptyState({ icon = "house", title, body }: EmptyStateProps) {
  return (
    <View style={styles.card}>
      <View style={styles.ring}>
        <Icon name={icon} size={36} />
      </View>
      <AppText variant="heading" style={styles.title} center>
        {title}
      </AppText>
      <AppText center>{body}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 28,
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tealBadge,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
  },
});
