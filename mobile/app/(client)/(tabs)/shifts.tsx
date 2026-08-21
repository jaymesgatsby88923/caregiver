import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { clientService } from "@/services/clientService";
import { AppText } from "@/components/ui/AppText";
import { Screen } from "@/components/ui/Screen";
import { EmptyState } from "@/components/care/EmptyState";
import { VisitRow } from "@/components/care/VisitRow";
import { formatDayRange, fullName, splitUpcomingAndPast } from "@/lib/format";
import type { Shift } from "@/types";

export default function ClientShifts() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      clientService
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

  const { upcoming, past } = splitUpcomingAndPast(shifts);
  const empty = upcoming.length === 0 && past.length === 0;

  return (
    <Screen loading={loading}>
      <AppText variant="heading">My shifts</AppText>
      {empty ? (
        <EmptyState
          title="No visits yet"
          body="When visits are scheduled for you, upcoming and past care will show up here."
        />
      ) : (
        <>
          <ShiftGroup
            title="Upcoming"
            shifts={upcoming}
            emptyText="Nothing scheduled right now."
            onPress={(id) => router.push(`/(client)/visit/${id}`)}
          />
          <ShiftGroup
            title="Past"
            shifts={past}
            emptyText="Completed visits will appear here."
            onPress={(id) => router.push(`/(client)/visit/${id}`)}
          />
        </>
      )}
    </Screen>
  );
}

function ShiftGroup({
  title,
  shifts,
  emptyText,
  onPress,
}: {
  title: string;
  shifts: Shift[];
  emptyText: string;
  onPress: (id: string) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <AppText variant="section">{title}</AppText>
      {shifts.length === 0 ? (
        <AppText>{emptyText}</AppText>
      ) : (
        shifts.map((shift) => (
          <VisitRow
            key={shift.shift_id}
            title={fullName(shift.caregiver_first_name, shift.caregiver_last_name)}
            subtitle={formatDayRange(
              shift.scheduled_start_at,
              shift.scheduled_end_at,
            )}
            status={shift.status}
            onPress={() => onPress(shift.shift_id)}
          />
        ))
      )}
    </View>
  );
}
