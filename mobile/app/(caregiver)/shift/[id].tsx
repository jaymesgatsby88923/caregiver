import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { caregiverService } from "@/services/caregiverService";
import { ApiError } from "@/services/api";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { ActivityTimeline } from "@/components/care/ActivityTimeline";
import { BackHeader } from "@/components/care/BackHeader";
import { CommentThread } from "@/components/care/CommentThread";
import { Composer } from "@/components/care/Composer";
import { MetaGrid } from "@/components/care/MetaGrid";
import { colors, radius } from "@/theme/tokens";
import {
  formatClockTime,
  formatTimeRange,
  fullName,
} from "@/lib/format";
import type {
  CatalogActivity,
  Shift,
  ShiftActivity,
  ShiftComment,
} from "@/types";

export default function CaregiverShiftDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [shift, setShift] = useState<Shift | null>(null);
  const [activities, setActivities] = useState<ShiftActivity[]>([]);
  const [comments, setComments] = useState<ShiftComment[]>([]);
  const [catalog, setCatalog] = useState<CatalogActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const shiftRow = await caregiverService.getShift(id);
    setShift(shiftRow);
    setActivities(shiftRow.activities ?? []);
    setComments(shiftRow.comments ?? []);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      load()
        .catch((err) => {
          Alert.alert("Unable to load shift", err instanceof ApiError ? err.message : "Try again.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [load]),
  );

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    try {
      await action();
      await load();
    } catch (err) {
      Alert.alert(
        "Action failed",
        err instanceof ApiError ? err.message : "Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function sendComment() {
    if (!id || !comment.trim()) return;
    setSending(true);
    try {
      await caregiverService.addComment(id, comment.trim());
      setComment("");
      await load();
    } catch (err) {
      Alert.alert(
        "Could not send",
        err instanceof ApiError ? err.message : "Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (!shift) {
    return <Screen loading={loading} />;
  }

  const address = shift.address;
  const canClockIn = shift.status === "assigned";
  const canClockOut = shift.status === "in_progress";
  const canLog = shift.status === "in_progress";
  const canComment = shift.status === "in_progress" || shift.status === "completed";

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen
        loading={loading}
        contentContainerStyle={{ paddingBottom: canComment ? 16 : 32 }}
      >
        <BackHeader status={shift.status} />
        <View>
          <AppText variant="heading">
            {fullName(shift.client_first_name, shift.client_last_name)}
          </AppText>
        </View>
        <MetaGrid
          items={[
            {
              icon: "clock",
              label: "Time",
              value: formatTimeRange(shift.scheduled_start_at, shift.scheduled_end_at),
            },
            {
              icon: "user",
              label: "Client",
              value: fullName(shift.client_first_name, shift.client_last_name),
            },
            {
              icon: "check",
              label: "Clocked in",
              value: formatClockTime(shift.actual_start_at),
            },
            {
              icon: "map-pin",
              label: "Address",
              value: address || "—",
            },
          ]}
        />
        {canClockIn || canClockOut ? (
          <View style={styles.actions}>
            {canClockIn ? (
              <Button
                label="Clock in"
                variant="secondary"
                loading={busy}
                onPress={() => run(() => caregiverService.clockIn(shift.shift_id))}
              />
            ) : null}
            {canClockOut ? (
              <Button
                label="Clock out"
                loading={busy}
                onPress={() => run(() => caregiverService.clockOut(shift.shift_id))}
              />
            ) : null}
          </View>
        ) : null}
        <AppText variant="section">Activities timeline</AppText>
        <ActivityTimeline
          items={activities}
          onRemove={
            canLog
              ? (item) =>
                  run(() =>
                    caregiverService.deleteActivity(
                      shift.shift_id,
                      item.shift_activity_id,
                    ),
                  )
              : undefined
          }
        />
        {canLog ? (
          <Button
            label="Log activity"
            variant="secondary"
            onPress={async () => {
              setPickerOpen(true);
              if (catalog.length > 0) return;
              try {
                setCatalog(await caregiverService.listCatalog());
              } catch (err) {
                Alert.alert(
                  "Unable to load activities",
                  err instanceof ApiError ? err.message : "Try again.",
                );
              }
            }}
          />
        ) : null}
        <AppText variant="section">Visit discussion</AppText>
        <CommentThread comments={comments} currentRole="caregiver" />
      </Screen>
      {canComment ? (
        <Composer
          value={comment}
          onChangeText={setComment}
          onSend={sendComment}
          sending={sending}
        />
      ) : null}

      <Modal visible={pickerOpen} animationType="slide" transparent>
        <Pressable style={styles.overlay} onPress={() => setPickerOpen(false)}>
          <SafeAreaView style={styles.sheet}>
            <AppText variant="heading">Log activity</AppText>
            {catalog.map((activity) => (
              <Pressable
                key={activity.activity_id}
                style={styles.option}
                onPress={() => {
                  setPickerOpen(false);
                  run(() =>
                    caregiverService.logActivity(shift.shift_id, activity.activity_id),
                  );
                }}
              >
                <AppText variant="label">{activity.name}</AppText>
              </Pressable>
            ))}
            {catalog.length === 0 ? (
              <AppText>No active activities in the catalog.</AppText>
            ) : null}
          </SafeAreaView>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  actions: { gap: 12 },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(10,37,64,0.35)",
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 24,
    gap: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
