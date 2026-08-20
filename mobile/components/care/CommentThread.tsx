import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, radius, type } from "@/theme/tokens";
import { formatClockTime } from "@/lib/format";
import type { ShiftComment } from "@/types";

type CommentThreadProps = {
  comments: ShiftComment[];
  currentRole: "caregiver" | "client";
};

export function CommentThread({ comments, currentRole }: CommentThreadProps) {
  if (comments.length === 0) {
    return <AppText>No comments yet.</AppText>;
  }

  return (
    <View style={styles.thread}>
      {comments.map((comment) => {
        const mine = comment.author_role === currentRole;
        return (
          <View
            key={comment.shift_comment_id}
            style={[styles.bubble, mine ? styles.mine : styles.theirs]}
          >
            <View style={styles.meta}>
              <AppText style={[styles.name, mine && { color: colors.teal }]}>
                {comment.author_first_name}
              </AppText>
              <AppText style={[styles.time, mine && { color: colors.teal }]}>
                {formatClockTime(comment.created_at)}
              </AppText>
            </View>
            <AppText style={styles.body}>{comment.body}</AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    gap: 12,
  },
  bubble: {
    maxWidth: "85%",
    padding: 12,
    gap: 4,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomRightRadius: radius.md,
    borderBottomLeftRadius: 4,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: colors.tealSoft,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: 4,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    fontFamily: type.bold,
    fontSize: 11,
    color: colors.navy,
  },
  time: {
    fontFamily: type.regular,
    fontSize: 10,
    color: colors.muted,
  },
  body: {
    fontFamily: type.regular,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
});
