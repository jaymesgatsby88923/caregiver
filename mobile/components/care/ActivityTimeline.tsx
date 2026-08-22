import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { colors, radius, type } from "@/theme/tokens";
import { formatClockTime } from "@/lib/format";
import type { ShiftActivity } from "@/types";

type ActivityTimelineProps = {
  items: ShiftActivity[];
  onRemove?: (item: ShiftActivity) => void;
};

export function ActivityTimeline({ items, onRemove }: ActivityTimelineProps) {
  const [openNote, setOpenNote] = useState<ShiftActivity | null>(null);

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
          <Pressable
            style={styles.nameWrap}
            onPress={item.notes ? () => setOpenNote(item) : undefined}
            disabled={!item.notes}
          >
            <AppText style={styles.name}>{item.activity_name}</AppText>
          </Pressable>
          {item.notes ? (
            <Pressable onPress={() => setOpenNote(item)} hitSlop={8}>
              <Icon name="note" size={16} />
            </Pressable>
          ) : onRemove ? null : (
            <Icon name="check-square" size={16} />
          )}
          {onRemove ? (
            <Pressable onPress={() => onRemove(item)} hitSlop={8}>
              <Icon name="circle-x" size={16} />
            </Pressable>
          ) : null}
        </View>
      ))}

      <Modal visible={Boolean(openNote)} animationType="fade" transparent>
        <View style={styles.noteOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setOpenNote(null)}
          />
          <View style={styles.noteSheet}>
            <AppText variant="heading">{openNote?.activity_name}</AppText>
            <AppText variant="muted">
              {openNote ? formatClockTime(openNote.logged_at) : ""}
            </AppText>
            <AppText>{openNote?.notes}</AppText>
            <Button label="Close" variant="secondary" onPress={() => setOpenNote(null)} />
          </View>
        </View>
      </Modal>
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
  nameWrap: {
    flex: 1,
  },
  name: {
    fontFamily: type.semibold,
    fontSize: 14,
    color: colors.text,
  },
  noteOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "rgba(10,37,64,0.35)",
  },
  noteSheet: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 24,
    gap: 12,
  },
});
