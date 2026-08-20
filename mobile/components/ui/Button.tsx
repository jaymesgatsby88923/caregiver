import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, radius, type } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "navy" | "compact";

type ButtonProps = Omit<PressableProps, "style"> & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const variantStyles = {
  primary: { backgroundColor: colors.red, label: colors.white },
  secondary: { backgroundColor: colors.white, label: colors.navy },
  navy: { backgroundColor: colors.navy, label: colors.white },
  compact: { backgroundColor: colors.navy, label: colors.white },
};

export function Button({
  label,
  variant = "primary",
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const palette = variantStyles[variant];
  const compact = variant === "compact";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        compact ? styles.compact : styles.full,
        variant === "secondary" ? styles.outline : null,
        {
          backgroundColor: palette.backgroundColor,
          opacity: pressed || disabled || loading ? 0.8 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={palette.label} />
      ) : (
        <AppText
          style={{
            fontFamily: type.bold,
            fontSize: compact ? 13 : 16,
            color: palette.label,
          }}
        >
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  full: {
    height: 52,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
  },
  compact: {
    height: 32,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.navy,
  },
});
