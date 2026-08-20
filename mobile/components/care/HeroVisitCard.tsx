import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { colors, radius, type } from "@/theme/tokens";
import { formatTimeRange } from "@/lib/format";
import type { Shift } from "@/types";

type HeroVisitCardProps = {
  eyebrow: string;
  title: string;
  shift: Shift;
  address?: string | null;
  actionLabel: string;
  onPress: () => void;
};

export function HeroVisitCard({
  eyebrow,
  title,
  shift,
  address,
  actionLabel,
  onPress,
}: HeroVisitCardProps) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.body}>
        <View style={styles.header}>
          <AppText style={styles.eyebrow}>{eyebrow}</AppText>
          <StatusBadge status={shift.status} />
        </View>
        <AppText style={styles.title}>{title}</AppText>
        <View style={styles.details}>
          <View style={styles.detail}>
            <Icon name="clock" size={14} />
            <AppText style={styles.detailText}>
              {formatTimeRange(shift.scheduled_start_at, shift.scheduled_end_at)}
            </AppText>
          </View>
          {address ? (
            <View style={styles.detail}>
              <Icon name="map-pin" size={14} />
              <AppText style={styles.address}>{address}</AppText>
            </View>
          ) : null}
        </View>
      </Pressable>
      <Button label={actionLabel} variant="navy" onPress={onPress} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: 20,
    gap: 16,
    shadowColor: "#0A2540",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  body: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eyebrow: {
    fontFamily: type.bold,
    fontSize: 12,
    color: colors.red,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: type.extraBold,
    fontSize: 20,
    color: colors.navy,
  },
  details: {
    gap: 10,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontFamily: type.semibold,
    fontSize: 13,
    color: colors.navy,
  },
  address: {
    fontFamily: type.medium,
    fontSize: 13,
    color: colors.muted,
    flex: 1,
  },
  cta: {
    height: 40,
    borderRadius: radius.sm,
  },
});
