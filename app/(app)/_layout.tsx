import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { theme } from "@/theme";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background
        },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: {
          fontFamily: theme.typography.semibold,
          fontSize: 18
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 82,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.medium,
          fontSize: 12,
          paddingBottom: 6
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        sceneStyle: {
          backgroundColor: theme.colors.background
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flame" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          title: "Partner",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
