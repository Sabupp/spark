import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { theme } from "@/theme";

export default function IndexScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasCheckedSession = useAuthStore((state) => state.hasCheckedSession);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);
  const getSession = useAuthStore((state) => state.getSession);
  const isConnected = useCoupleStore((state) => state.isConnected);

  useEffect(() => {
    void getSession();
  }, [getSession]);

  if (!hasCheckedSession || isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isConnected) {
    return <Redirect href="/(app)/partner" />;
  }

  return <Redirect href="/(app)" />;
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.background,
    justifyContent: "center"
  }
});
