import { StyleSheet, TextInput, View, type TextInputProps } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, radius, type } from "@/theme/tokens";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.field, error ? styles.invalid : null, style]}
        {...props}
      />
      {error ? (
        <AppText style={styles.error}>{error}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    width: "100%",
  },
  field: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    fontFamily: type.regular,
    fontSize: 15,
    color: colors.navy,
    backgroundColor: colors.white,
  },
  invalid: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontFamily: type.medium,
  },
});
