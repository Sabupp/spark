import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";
import { theme } from "@/theme";

const highlights = [
  {
    eyebrow: "Daily Spark",
    title: "Tägliche Challenges fur echte Momente",
    copy: "Von leichten Flirts bis zu tieferen Gesprächsimpulsen."
  },
  {
    eyebrow: "Private Energy",
    title: "Diskret, warm und bewusst gestaltet",
    copy: "Mehr Intimität ohne billige Optik oder awkwardes UX."
  },
  {
    eyebrow: "Playful Ritual",
    title: "Streaks, Rituale und kleine Belohnungen",
    copy: "So entsteht aus Nähe eine Gewohnheit, auf die man sich freut."
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAuthStore(
    (state) => state.completeOnboarding
  );

  const handleContinue = () => {
    completeOnboarding();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>Spark</Text>
        <Text style={styles.title}>A private playground for modern couples.</Text>
        <Text style={styles.subtitle}>
          Elegant, dark, flirty and designed to strengthen connection one ritual
          at a time.
        </Text>
      </View>

      <View style={styles.stack}>
        {highlights.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.eyebrow}>{item.eyebrow}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardCopy}>{item.copy}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={handleContinue}>
        <Text style={styles.primaryButtonText}>Experience starten</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl
  },
  header: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xxl
  },
  logo: {
    color: theme.colors.accentLight,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 4,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 42
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  stack: {
    gap: theme.spacing.md
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm
  },
  eyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "700"
  },
  cardCopy: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.xxl,
    paddingVertical: theme.spacing.md
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  }
});
