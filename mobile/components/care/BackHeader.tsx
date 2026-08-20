import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { AppText } from "@/components/ui/AppText";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { colors, type } from "@/theme/tokens";
import type { ShiftStatus } from "@/types";

type BackHeaderProps = {
  label?: string;
  status?: ShiftStatus;
};

export function BackHeader({ label = "Home", status }: BackHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={8}>
        <Icon name="arrow-left" size={16} />
        <AppText style={styles.label}>{label}</AppText>
      </Pressable>
      {status ? <StatusBadge status={status} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontFamily: type.semibold,
    fontSize: 14,
    color: colors.navy,
  },
});
