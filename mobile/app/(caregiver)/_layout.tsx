import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function CaregiverLayout() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user?.role !== "caregiver") {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="shift/[id]" />
    </Stack>
  );
}
