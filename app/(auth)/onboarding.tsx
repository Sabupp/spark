import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
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
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleContinue = () => {
    completeOnboarding();
    router.replace(isAuthenticated ? "/(app)/partner" : "/(auth)/login");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.header}>
          <Text style={styles.logo}>Spark</Text>
          <Text style={styles.title}>A private playground for modern couples.</Text>
          <Text style={styles.subtitle}>
            Elegant, dark, flirty and designed to strengthen connection one ritual
            at a time.
          </Text>
        </View>
      </FadeInView>

      <View style={styles.stack}>
        {highlights.map((item, index) => (
          <FadeInView key={item.title} delay={120 + index * 80}>
            <LinearGradient
              colors={["rgba(230,57,70,0.12)", "#191919", "#141414"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <Text style={styles.eyebrow}>{item.eyebrow}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardCopy}>{item.copy}</Text>
            </LinearGradient>
          </FadeInView>
        ))}
      </View>

      <FadeInView delay={360}>
        <InteractiveCard style={styles.primaryButton} onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Experience starten</Text>
        </InteractiveCard>
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
    padding: theme.spacing.md,
    gap: theme.spacing.lg
  },
  header: {
    gap: theme.spacing.md,
    paddingTop: theme.spacing.xxl
  },
  logo: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    letterSpacing: 4,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 36,
    lineHeight: 42
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  stack: {
    gap: theme.spacing.md
  },
  card: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    ...theme.shadows.card
  },
  eyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontFamily: theme.typography.semibold,
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  cardTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 20,
    letterSpacing: -0.2
  },
  cardCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.xxl,
    paddingVertical: theme.spacing.sm
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    letterSpacing: 0.2
  }
});
