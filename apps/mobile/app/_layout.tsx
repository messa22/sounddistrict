import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../src/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.ink },
        headerTintColor: colors.white,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.ink },
        headerBackButtonDisplayMode: "minimal"
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="book" options={{ title: "Book your session", presentation: "modal" }} />
      </Stack>
    </>
  );
}
