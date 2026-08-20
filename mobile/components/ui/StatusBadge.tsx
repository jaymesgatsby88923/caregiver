import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Icon } from "@/components/ui/Icon";
import { colors, radius, type } from "@/theme/tokens";
import { statusLabel } from "@/lib/format";
import type { ShiftStatus as Status } from "@/types";

type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const active = status === "in_progress";

  return (
    <View style={[styles.badge, active ? styles.active : styles.muted]}>
      {active ? <Icon name="pulse-dot" /> : null}
      <AppText
        style={[
          styles.label,
          { color: active ? colors.teal : colors.muted },
        ]}
      >
        {statusLabel(status)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  active: {
    backgroundColor: colors.tealBadge,
    borderWidth: 1,
    borderColor: colors.tealBorder,
    paddingLeft: 10,
  },
  muted: {
    backgroundColor: colors.slate,
  },
  label: {
    fontFamily: type.semibold,
    fontSize: 12,
  },
});
