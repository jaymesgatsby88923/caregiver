import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { colors, type } from "@/theme/tokens";

type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<
    string,
    { options: { tabBarLabel?: unknown; title?: string } }
  >;
  navigation: { navigate: (name: string) => void };
};

export function AppTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const options = descriptors[route.key].options;
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            onPress={() => navigation.navigate(route.name)}
            style={styles.item}
          >
            <AppText
              style={[
                styles.label,
                { color: focused ? colors.navy : colors.muted },
                focused && { fontFamily: type.bold },
              ]}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  label: {
    fontFamily: type.medium,
    fontSize: 11,
    textAlign: "center",
  },
});
