import { Stack } from "expo-router";
import Colors from "@/constants/colors";

const C = Colors.dark;

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerStyle: { backgroundColor: C.background },
        headerTintColor: C.text,
        headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
        contentStyle: { backgroundColor: C.background },
      }}
    >
      <Stack.Screen name="login" options={{ title: "Sign In" }} />
      <Stack.Screen name="register" options={{ title: "Create Account" }} />
    </Stack>
  );
}
