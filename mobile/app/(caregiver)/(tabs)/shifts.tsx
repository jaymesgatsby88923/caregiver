import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { caregiverService } from "@/services/caregiverService";
import { AppText } from "@/components/ui/AppText";
import { Screen } from "@/components/ui/Screen";
import { EmptyState } from "@/components/care/EmptyState";
import { VisitRow } from "@/components/care/VisitRow";
import { formatDayRange, fullName } from "@/lib/format";
import type { Shift } from "@/types";

export default function CaregiverShifts() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      caregiverService
        .listShifts()
        .then((rows) => {
          if (active) setShifts(rows);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  const visible = shifts.filter((shift) => shift.status !== "cancelled");

  return (
    <Screen loading={loading}>
      <AppText variant="heading">My shifts</AppText>
      {visible.length === 0 ? (
        <EmptyState
          title="No shifts yet"
          body="Assigned visits will appear in this list."
        />
      ) : (
        <View style={{ gap: 12 }}>
          {visible.map((shift) => (
            <VisitRow
              key={shift.shift_id}
              title={fullName(shift.client_first_name, shift.client_last_name)}
              subtitle={formatDayRange(
                shift.scheduled_start_at,
                shift.scheduled_end_at,
              )}
              status={shift.status}
              onPress={() => router.push(`/(caregiver)/shift/${shift.shift_id}`)}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
