import { Text, type TextProps, type TextStyle } from "react-native";
import { colors, type } from "@/theme/tokens";

type Variant =
  | "title"
  | "heading"
  | "body"
  | "label"
  | "muted"
  | "section"
  | "caption"
  | "tab";

const variants: Record<Variant, TextStyle> = {
  title: {
    fontFamily: type.extraBold,
    fontSize: 28,
    color: colors.navy,
    letterSpacing: -0.5,
  },
  heading: {
    fontFamily: type.extraBold,
    fontSize: 24,
    color: colors.navy,
  },
  body: {
    fontFamily: type.regular,
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
  },
  label: {
    fontFamily: type.semibold,
    fontSize: 14,
    color: colors.navy,
  },
  muted: {
    fontFamily: type.medium,
    fontSize: 13,
    color: colors.muted,
  },
  section: {
    fontFamily: type.bold,
    fontSize: 12,
    color: colors.navy,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: type.regular,
    fontSize: 13,
    color: colors.muted,
  },
  tab: {
    fontFamily: type.medium,
    fontSize: 11,
    color: colors.muted,
  },
};

type AppTextProps = TextProps & {
  variant?: Variant;
  color?: string;
  center?: boolean;
};

export function AppText({
  variant = "body",
  color,
  center,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        variants[variant],
        color ? { color } : null,
        center ? { textAlign: "center" } : null,
        style,
      ]}
      {...props}
    />
  );
}
