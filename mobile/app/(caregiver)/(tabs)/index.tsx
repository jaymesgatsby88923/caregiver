import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { caregiverService } from "@/services/caregiverService";
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
import type { CaregiverClient, Shift } from "@/types";

export default function CaregiverHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [clients, setClients] = useState<CaregiverClient[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      async function load() {
        try {
          const [shiftRows, clientRows] = await Promise.all([
            caregiverService.listShifts(),
            caregiverService.listClients(),
          ]);
          if (!active) return;
          setShifts(shiftRows);
          setClients(clientRows);
        } finally {
          if (active) setLoading(false);
        }
      }
      load();
      return () => {
        active = false;
      };
    }, []),
  );

  if (!user) return null;

  const addressByClient = Object.fromEntries(
    clients.map((client) => [client.client_id, client.address]),
  );
  const { hero, rest } = splitHomeShifts(shifts);
  const restToday = rest.filter((shift) => {
    const start = new Date(shift.scheduled_start_at);
    const now = new Date();
    return (
      start.getFullYear() === now.getFullYear() &&
      start.getMonth() === now.getMonth() &&
      start.getDate() === now.getDate()
    );
  });

  return (
    <Screen loading={loading}>
      <GreetingHeader
        kicker="Today's Schedule"
        name={user.first_name}
        initials={initials(user.first_name)}
        onPressAvatar={() => router.push("/(caregiver)/(tabs)/profile")}
      />
      {hero ? (
        <HeroVisitCard
          eyebrow={hero.status === "in_progress" ? "Current shift" : "Next shift"}
          title={fullName(hero.client_first_name, hero.client_last_name)}
          shift={hero}
          address={addressByClient[hero.client_id]}
          actionLabel="View Shift"
          onPress={() => router.push(`/(caregiver)/shift/${hero.shift_id}`)}
        />
      ) : (
        <EmptyState
          title="No shifts today"
          body="When a visit is assigned to you, it will show up here."
        />
      )}
      {restToday.length > 0 ? (
        <View style={{ gap: 12 }}>
          <AppText variant="section">Rest of today</AppText>
          {restToday.map((shift) => (
            <VisitRow
              key={shift.shift_id}
              title={fullName(shift.client_first_name, shift.client_last_name)}
              subtitle={formatDayRange(
                shift.scheduled_start_at,
                shift.scheduled_end_at,
              )}
              detail={addressByClient[shift.client_id]}
              status={shift.status}
              onPress={() => router.push(`/(caregiver)/shift/${shift.shift_id}`)}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
