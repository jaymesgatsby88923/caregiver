import { useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { caregiverService } from "@/services/caregiverService";
import { AppText } from "@/components/ui/AppText";
import { Screen } from "@/components/ui/Screen";
import { EmptyState } from "@/components/care/EmptyState";
import { VisitRow } from "@/components/care/VisitRow";
import { fullName } from "@/lib/format";
import type { CaregiverClient } from "@/types";

export default function CaregiverClients() {
  const [clients, setClients] = useState<CaregiverClient[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      caregiverService
        .listClients()
        .then((rows) => {
          if (active) setClients(rows);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen loading={loading}>
      <AppText variant="heading">Clients</AppText>
      {clients.length === 0 ? (
        <EmptyState
          title="No clients assigned"
          body="People on your care team will show up here with contact details."
        />
      ) : (
        <View style={{ gap: 12 }}>
          {clients.map((client) => (
            <VisitRow
              key={client.client_id}
              title={fullName(client.first_name, client.last_name)}
              subtitle={client.phone ?? undefined}
              detail={client.address ?? client.notes}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
