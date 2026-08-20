import { Tabs } from "expo-router";
import { AppTabBar } from "@/components/ui/AppTabBar";

export default function CaregiverTabs() {
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="shifts" options={{ title: "Shifts" }} />
      <Tabs.Screen name="clients" options={{ title: "Clients" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
