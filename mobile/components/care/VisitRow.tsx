import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { colors, radius, type } from "@/theme/tokens";
import type { ShiftStatus } from "@/types";

type VisitRowProps = {
  title: string;
  subtitle?: string;
  detail?: string | null;
  status?: ShiftStatus;
  onPress?: () => void;
};

export function VisitRow({ title, subtitle, detail, status, onPress }: VisitRowProps) {
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={styles.row}>
      <View style={styles.header}>
        <AppText style={styles.title}>{title}</AppText>
        {status ? <StatusBadge status={status} /> : null}
      </View>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
      {detail ? <AppText style={styles.detail}>{detail}</AppText> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontFamily: type.bold,
    fontSize: 16,
    color: colors.navy,
    flex: 1,
  },
  subtitle: {
    fontFamily: type.medium,
    fontSize: 13,
    color: colors.muted,
  },
  detail: {
    fontFamily: type.regular,
    fontSize: 13,
    color: colors.navy,
  },
});
