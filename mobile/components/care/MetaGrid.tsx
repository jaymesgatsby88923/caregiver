import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Icon, type IconName } from "@/components/ui/Icon";
import { colors, radius, type } from "@/theme/tokens";

export type MetaItem = {
  icon: IconName;
  label: string;
  value: string;
};

type MetaGridProps = {
  items: MetaItem[];
};

export function MetaGrid({ items }: MetaGridProps) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.tile}>
          <Icon name={item.icon} size={18} />
          <View style={styles.copy}>
            <AppText style={styles.label}>{item.label}</AppText>
            <AppText style={styles.value} numberOfLines={1}>
              {item.value}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: type.semibold,
    fontSize: 10,
    color: colors.muted,
    textTransform: "uppercase",
  },
  value: {
    fontFamily: type.bold,
    fontSize: 12,
    color: colors.navy,
  },
});
