import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/services/clientService";
import { AppText } from "@/components/ui/AppText";
import { Screen } from "@/components/ui/Screen";
import { EmptyState } from "@/components/care/EmptyState";
import { GreetingHeader } from "@/components/care/GreetingHeader";
import { HeroVisitCard } from "@/components/care/HeroVisitCard";
import { VisitRow } from "@/components/care/VisitRow";
import {
  formatDayRange,
  fullName,
  greetingForNow,
  initials,
  splitHomeShifts,
} from "@/lib/format";
import type { Shift } from "@/types";

export default function ClientHome() {
  const { user } = useAuth();
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

  if (!user) return null;

  const { hero, rest } = splitHomeShifts(shifts);

  return (
    <Screen loading={loading}>
      <GreetingHeader
        kicker={greetingForNow()}
        name={user.first_name}
        initials={initials(user.first_name)}
        onPressAvatar={() => router.push("/(client)/(tabs)/profile")}
      />
      {hero ? (
        <HeroVisitCard
          eyebrow={hero.status === "in_progress" ? "Today's visit" : "Next visit"}
          title={fullName(hero.caregiver_first_name, hero.caregiver_last_name)}
          shift={hero}
          actionLabel="View Visit Details"
          onPress={() => router.push(`/(client)/visit/${hero.shift_id}`)}
        />
      ) : (
        <EmptyState
          title="No visits scheduled"
          body="When your administrator schedules your next care visit, caregiver details will appear here."
        />
      )}
      {rest.length > 0 ? (
        <View style={{ gap: 12 }}>
          <AppText variant="section">Upcoming visits</AppText>
          {rest.map((shift) => (
            <VisitRow
              key={shift.shift_id}
              title={fullName(shift.caregiver_first_name, shift.caregiver_last_name)}
              subtitle={formatDayRange(
                shift.scheduled_start_at,
                shift.scheduled_end_at,
              )}
              status={shift.status}
              onPress={() => router.push(`/(client)/visit/${shift.shift_id}`)}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
