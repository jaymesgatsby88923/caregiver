import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function ClientLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user?.role !== "client") {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="visit/[id]" />
    </Stack>
  );
}
