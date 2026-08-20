import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Icon } from "@/components/ui/Icon";
import { colors, radius, type } from "@/theme/tokens";
import { formatClockTime } from "@/lib/format";
import type { ShiftActivity } from "@/types";

type ActivityTimelineProps = {
  items: ShiftActivity[];
  onRemove?: (item: ShiftActivity) => void;
};

export function ActivityTimeline({ items, onRemove }: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <View style={styles.card}>
        <AppText>No activities logged yet.</AppText>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {items.map((item) => (
        <View key={item.shift_activity_id} style={styles.row}>
          <View style={styles.dot} />
          <AppText style={styles.time}>{formatClockTime(item.logged_at)}</AppText>
          <AppText style={styles.name}>{item.activity_name}</AppText>
          {onRemove ? (
            <Pressable onPress={() => onRemove(item)} hitSlop={8}>
              <Icon name="circle-x" size={16} />
            </Pressable>
          ) : (
            <Icon name="check-square" size={16} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 16,
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.tealBorder,
  },
  time: {
    fontFamily: type.semibold,
    fontSize: 13,
    color: colors.muted,
    width: 72,
  },
  name: {
    flex: 1,
    fontFamily: type.semibold,
    fontSize: 14,
    color: colors.text,
  },
});
