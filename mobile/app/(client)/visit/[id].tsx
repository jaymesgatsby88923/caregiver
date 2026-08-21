import { useCallback, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { clientService } from "@/services/clientService";
import { ApiError } from "@/services/api";
import { AppText } from "@/components/ui/AppText";
import { Screen } from "@/components/ui/Screen";
import { ActivityTimeline } from "@/components/care/ActivityTimeline";
import { BackHeader } from "@/components/care/BackHeader";
import { CommentThread } from "@/components/care/CommentThread";
import { Composer } from "@/components/care/Composer";
import { MetaGrid } from "@/components/care/MetaGrid";
import { colors } from "@/theme/tokens";
import {
  formatClockTime,
  formatTimeRange,
  fullName,
} from "@/lib/format";
import type { Shift, ShiftActivity, ShiftComment, ShiftStatus } from "@/types";

function visitTitle(status: ShiftStatus) {
  if (status === "in_progress") return "Today's visit";
  if (status === "completed") return "Past visit";
  return "Upcoming visit";
}

export default function ClientVisitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [shift, setShift] = useState<Shift | null>(null);
  const [activities, setActivities] = useState<ShiftActivity[]>([]);
  const [comments, setComments] = useState<ShiftComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const [shiftRow, activityRows, commentRows] = await Promise.all([
      clientService.getShift(id),
      clientService.listActivities(id),
      clientService.listComments(id),
    ]);
    setShift(shiftRow);
    setActivities(activityRows);
    setComments(commentRows);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      load()
        .catch((err) => {
          Alert.alert(
            "Unable to load visit",
            err instanceof ApiError ? err.message : "Try again.",
          );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, [load]),
  );

  async function sendComment() {
    if (!id || !comment.trim()) return;
    setSending(true);
    try {
      await clientService.addComment(id, comment.trim());
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

  const canComment = ["open", "assigned", "in_progress", "completed"].includes(
    shift.status,
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen loading={loading} contentContainerStyle={{ paddingBottom: 16 }}>
        <BackHeader label="Back" status={shift.status} />
        <AppText variant="heading">{visitTitle(shift.status)}</AppText>
        <MetaGrid
          items={[
            {
              icon: "clock",
              label: "Time",
              value: formatTimeRange(shift.scheduled_start_at, shift.scheduled_end_at),
            },
            {
              icon: "user",
              label: "Caregiver",
              value: fullName(shift.caregiver_first_name, shift.caregiver_last_name),
            },
            {
              icon: "check",
              label: "Clocked in",
              value: formatClockTime(shift.actual_start_at),
            },
            {
              icon: "map-pin",
              label: "Status",
              value: shift.status.replace("_", " "),
            },
          ]}
        />
        <AppText variant="section">Activities timeline</AppText>
        <ActivityTimeline items={activities} />
        <AppText variant="section">Visit discussion</AppText>
        <CommentThread comments={comments} currentRole="client" />
      </Screen>
      {canComment ? (
        <Composer
          value={comment}
          onChangeText={setComment}
          onSend={sendComment}
          sending={sending}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
});
