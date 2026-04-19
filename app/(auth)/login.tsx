import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Link, useRouter } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";
import { theme } from "@/theme";

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
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

    router.replace("/(app)");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.kicker}>Spark</Text>
        <Text style={styles.title}>Eure elegante Spielwiese fur Nahe.</Text>
        <Text style={styles.subtitle}>
          Tägliche Impulse, spielerische Herausforderungen und ein Raum nur fur
          euch zwei.
        </Text>
      </View>

      <View style={styles.card}>
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

        <Pressable
          style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>Weiter zu Spark</Text>
        </Pressable>

        <Link href="/(auth)/register" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Neu hier? Account anlegen</Text>
          </Pressable>
        </Link>
      </View>
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
    padding: theme.spacing.lg,
    gap: theme.spacing.xl
  },
  hero: {
    gap: theme.spacing.md
  },
  kicker: {
    color: theme.colors.accentLight,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 40
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.24,
    shadowRadius: 24
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "700"
  },
  cardCopy: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  input: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontSize: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md
  },
  buttonDisabled: {
    opacity: 0.6
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.md
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    fontWeight: "600"
  }
});
