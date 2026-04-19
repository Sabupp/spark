import { Stack } from "expo-router";

import { theme } from "@/theme";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontFamily: theme.typography.semibold,
          fontSize: 18
        },
        contentStyle: {
          backgroundColor: theme.colors.background
        }
      }}
    />
  );
}
