import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";

export default function IndexScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);
  const isConnected = useCoupleStore((state) => state.isConnected);

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
