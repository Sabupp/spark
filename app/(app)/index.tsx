import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuthStore } from "@/store/useAuthStore";
import { useChallengeStore } from "@/store/useChallengeStore";
import { theme } from "@/theme";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const streak = useChallengeStore((state) => state.streak);
  const dailyChallenge = useChallengeStore((state) => state.dailyChallenge);
  const completedToday = useChallengeStore((state) => state.completedToday);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Good evening</Text>
        <Text style={styles.title}>
          {user?.name ?? "You"}, today is made for softness and surprise.
        </Text>
        <Text style={styles.subtitle}>
          Keep your ritual alive with one thoughtful move tonight.
        </Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{streak}</Text>
          <Text style={styles.metricLabel}>Day Streak</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{completedToday ? "Done" : "Live"}</Text>
          <Text style={styles.metricLabel}>Daily Spark</Text>
        </View>
      </View>

      <View style={styles.challengeCard}>
        <Text style={styles.cardEyebrow}>Daily Challenge</Text>
        <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
        <Text style={styles.challengeCopy}>{dailyChallenge.description}</Text>
        <View style={styles.challengeMeta}>
          <Text style={styles.challengeBadge}>{dailyChallenge.category}</Text>
          <Text style={styles.challengeTime}>{dailyChallenge.duration}</Text>
        </View>
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.cardEyebrow}>Tonight's Mood</Text>
        <Text style={styles.noteTitle}>Slow burn with playful tension</Text>
        <Text style={styles.noteCopy}>
          Suggestion: dim lights, one shared playlist and ten uninterrupted minutes
          together.
        </Text>
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
    padding: theme.spacing.lg,
    gap: theme.spacing.lg
  },
  hero: {
    gap: theme.spacing.sm
  },
  eyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  metricsRow: {
    flexDirection: "row",
    gap: theme.spacing.md
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.lg,
    gap: 6
  },
  metricValue: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "700"
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14
  },
  challengeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radii.lg,
    gap: theme.spacing.md,
    overflow: "hidden",
    padding: theme.spacing.lg
  },
  cardEyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  challengeTitle: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "700"
  },
  challengeCopy: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  challengeMeta: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  challengeBadge: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: "700"
  },
  challengeTime: {
    color: theme.colors.textSecondary,
    fontSize: 14
  },
  noteCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  noteTitle: {
    color: theme.colors.textPrimary,
    fontSize: 22,
    fontWeight: "700"
  },
  noteCopy: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  }
});
