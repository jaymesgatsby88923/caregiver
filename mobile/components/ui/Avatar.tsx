import { StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, type } from "@/theme/tokens";

type AvatarProps = {
  initials: string;
  size?: number;
};

export function Avatar({ initials, size = 48 }: AvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <AppText style={[styles.initials, { fontSize: size < 40 ? 12 : 15 }]}>
        {initials}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.tealSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontFamily: type.bold,
    color: colors.teal,
  },
});
