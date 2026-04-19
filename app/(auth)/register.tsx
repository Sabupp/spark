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

export default function RegisterScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);
  const [name, setName] = useState("Mia");
  const [email, setEmail] = useState("mia@spark.app");
  const [password, setPassword] = useState("spark123");

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      email.trim().length > 0 &&
      password.trim().length >= 6
    );
  }, [email, name, password]);

  const handleRegister = () => {
    if (!canSubmit) {
      return;
    }

    signIn({
      id: "mock-user-2",
      name,
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
        <Text style={styles.kicker}>Join Spark</Text>
        <Text style={styles.title}>Startet euer Ritual fur mehr Verbindung.</Text>
        <Text style={styles.subtitle}>
          Noch kein echtes Backend, aber eine vollständige Premium-Mock-Experience.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Registrieren</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Vorname"
          placeholderTextColor={theme.colors.textSecondary}
          style={styles.input}
        />
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
          onPress={handleRegister}
        >
          <Text style={styles.primaryButtonText}>Mock-Account erstellen</Text>
        </Pressable>

        <Link href="/(auth)/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Ich habe schon einen Zugang</Text>
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
