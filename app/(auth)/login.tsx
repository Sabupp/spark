import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { theme } from "@/theme";

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const onboardingCompleted = useAuthStore((state) => state.onboardingCompleted);
  const isConnected = useCoupleStore((state) => state.isConnected);
  const [email, setEmail] = useState("alex@spark.app");
  const [password, setPassword] = useState("spark123");

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length >= 6,
    [email, password]
  );

  const handleLogin = () => {
    if (!canSubmit) {
      return;
    }

    signIn({
      id: "mock-user-1",
      name: "Alex",
      email
    });

    if (!onboardingCompleted) {
      router.replace("/(auth)/onboarding");
      return;
    }

    if (!isConnected) {
      router.replace("/(app)/partner");
      return;
    }

    router.replace("/(app)");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Spark</Text>
          <Text style={styles.title}>Eure elegante Spielwiese fur Nahe.</Text>
          <Text style={styles.subtitle}>
            Tägliche Impulse, spielerische Herausforderungen und ein Raum nur fur
            euch zwei.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={120}>
        <LinearGradient
          colors={["rgba(230,57,70,0.18)", "rgba(26,26,26,0.96)", "#161616"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Einloggen</Text>
          <Text style={styles.cardCopy}>
            Nutze den Mock-Login und spring direkt in die Experience.
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="E-Mail"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Passwort"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            style={styles.input}
          />

          <InteractiveCard
            style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]}
            onPress={handleLogin}
          >
            <Text style={styles.primaryButtonText}>Weiter zu Spark</Text>
          </InteractiveCard>

          <Link href="/(auth)/register" asChild>
            <InteractiveCard style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Neu hier? Account anlegen</Text>
            </InteractiveCard>
          </Link>
        </LinearGradient>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.lg
  },
  hero: {
    gap: theme.spacing.md
  },
  kicker: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    letterSpacing: 3,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 34,
    lineHeight: 40
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 24,
    letterSpacing: -0.2
  },
  cardCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  input: {
    backgroundColor: "rgba(34,34,34,0.84)",
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  buttonDisabled: {
    opacity: 0.6
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    letterSpacing: 0.2
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 15,
    letterSpacing: 0.1
  }
});
