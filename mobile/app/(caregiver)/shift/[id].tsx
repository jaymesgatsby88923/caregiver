import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { caregiverService } from "@/services/caregiverService";
import { ApiError } from "@/services/api";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { ActivityTimeline } from "@/components/care/ActivityTimeline";
import { BackHeader } from "@/components/care/BackHeader";
import { CommentThread } from "@/components/care/CommentThread";
import { Composer } from "@/components/care/Composer";
import { MetaGrid } from "@/components/care/MetaGrid";
import { colors, radius } from "@/theme/tokens";
import {
  formatClockTime,
  formatDateLabel,
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
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [shift, setShift] = useState<Shift | null>(null);
  const [activities, setActivities] = useState<ShiftActivity[]>([]);
  const [comments, setComments] = useState<ShiftComment[]>([]);
  const [catalog, setCatalog] = useState<CatalogActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftActivity, setDraftActivity] = useState<CatalogActivity | null>(null);
  const [draftAt, setDraftAt] = useState(new Date());
  const [draftNotes, setDraftNotes] = useState("");
  const [datePart, setDatePart] = useState<"date" | "time" | null>(null);
  const [savingLog, setSavingLog] = useState(false);

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

  function closePicker() {
    setPickerOpen(false);
    setDraftActivity(null);
    setDraftNotes("");
    setDatePart(null);
  }

  function selectActivity(activity: CatalogActivity) {
    setDraftActivity(activity);
    setDraftAt(new Date());
    setDraftNotes("");
    setDatePart(null);
  }

  async function saveLog() {
    if (!shift || !draftActivity) return;
    setSavingLog(true);
    try {
      await caregiverService.logActivity(shift.shift_id, draftActivity.activity_id, {
        logged_at: draftAt.toISOString(),
        notes: draftNotes.trim() || undefined,
      });
      closePicker();
      await load();
    } catch (err) {
      Alert.alert(
        "Could not log activity",
        err instanceof ApiError ? err.message : "Please try again.",
      );
    } finally {
      setSavingLog(false);
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
              closePicker();
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
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closePicker} />
          <View
            style={[
              styles.sheet,
              {
                maxHeight: windowHeight * 0.8,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            {draftActivity ? (
              <>
                <Pressable onPress={() => setDraftActivity(null)} hitSlop={8}>
                  <AppText style={styles.back}>Activities</AppText>
                </Pressable>
                <AppText variant="heading">{draftActivity.name}</AppText>
                <View style={styles.whenRow}>
                  <Pressable
                    style={styles.whenField}
                    onPress={() => setDatePart("date")}
                  >
                    <AppText variant="label">Date</AppText>
                    <AppText>{formatDateLabel(draftAt)}</AppText>
                  </Pressable>
                  <Pressable
                    style={styles.whenField}
                    onPress={() => setDatePart("time")}
                  >
                    <AppText variant="label">Time</AppText>
                    <AppText>
                      {formatClockTime(draftAt.toISOString())}
                    </AppText>
                  </Pressable>
                </View>
                {datePart ? (
                  <DateTimePicker
                    value={draftAt}
                    mode={datePart}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                      const mode = datePart;
                      if (Platform.OS === "android") setDatePart(null);
                      if (event.type === "dismissed" || !date) return;
                      setDraftAt((current) => {
                        const next = new Date(current);
                        if (mode === "date") {
                          next.setFullYear(
                            date.getFullYear(),
                            date.getMonth(),
                            date.getDate(),
                          );
                        } else {
                          next.setHours(date.getHours(), date.getMinutes(), 0, 0);
                        }
                        return next;
                      });
                    }}
                  />
                ) : null}
                <TextField
                  label="Notes (optional)"
                  value={draftNotes}
                  onChangeText={setDraftNotes}
                  multiline
                  style={styles.notes}
                />
                <Button
                  label="Save"
                  onPress={saveLog}
                  loading={savingLog}
                  disabled={savingLog}
                />
              </>
            ) : (
              <>
                <AppText variant="heading">Activities</AppText>
                <ScrollView
                  style={[
                    styles.sheetList,
                    { maxHeight: windowHeight * 0.8 - 96 },
                  ]}
                  keyboardShouldPersistTaps="handled"
                >
                  {catalog.map((activity) => (
                    <Pressable
                      key={activity.activity_id}
                      style={styles.option}
                      onPress={() => selectActivity(activity)}
                    >
                      <AppText variant="label">{activity.name}</AppText>
                    </Pressable>
                  ))}
                  {catalog.length === 0 ? (
                    <AppText>No active activities in the catalog.</AppText>
                  ) : null}
                </ScrollView>
              </>
            )}
          </View>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  sheetList: {
    flexGrow: 0,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  back: {
    color: colors.navy,
    fontSize: 14,
  },
  whenRow: {
    flexDirection: "row",
    gap: 12,
  },
  whenField: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    gap: 4,
  },
  notes: {
    height: 96,
    paddingTop: 12,
    textAlignVertical: "top",
  },
});
