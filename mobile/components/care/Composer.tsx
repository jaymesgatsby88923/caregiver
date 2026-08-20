import { StyleSheet, TextInput, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { colors, type } from "@/theme/tokens";

type ComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  sending?: boolean;
};

export function Composer({ value, onChangeText, onSend, sending }: ComposerProps) {
  return (
    <View style={styles.bar}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Write a comment…"
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
      <Button
        label="Send"
        variant="compact"
        onPress={onSend}
        loading={sending}
        disabled={!value.trim()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.slate,
    paddingHorizontal: 12,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: type.regular,
    fontSize: 14,
    color: colors.navy,
    paddingVertical: 8,
  },
});
