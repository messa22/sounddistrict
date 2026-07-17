import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../src/theme";

const icons = {
  index: ["home-outline", "home"],
  rooms: ["diamond-outline", "diamond"],
  bookings: ["calendar-outline", "calendar"],
  profile: ["person-outline", "person"]
} as const;

export default function TabsLayout() {
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        height: 86,
        paddingTop: 8,
        paddingBottom: 22,
        backgroundColor: "#070809",
        borderTopColor: colors.line
      },
      tabBarActiveTintColor: colors.gold,
      tabBarInactiveTintColor: "#696B6D",
      tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      tabBarIcon: ({ color, focused, size }) => {
        const pair = icons[route.name as keyof typeof icons] ?? icons.index;
        return <Ionicons name={pair[focused ? 1 : 0]} size={size} color={color} />;
      }
    })}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="rooms" options={{ title: "Rooms" }} />
      <Tabs.Screen name="bookings" options={{ title: "Sessions" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
