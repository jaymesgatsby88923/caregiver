import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/tokens";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.navy} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role === "caregiver") {
    return <Redirect href="/(caregiver)" />;
  }

  if (user.role === "client") {
    return <Redirect href="/(client)" />;
  }

  return <Redirect href="/admin" />;
}
