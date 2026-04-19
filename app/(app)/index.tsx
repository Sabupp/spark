import { useEffect, useRef } from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { FadeInView } from "@/components/FadeInView";
import { useAuthStore } from "@/store/useAuthStore";
import { useChallengeStore } from "@/store/useChallengeStore";
import { theme } from "@/theme";

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const streak = useChallengeStore((state) => state.streak);
  const dailyChallenge = useChallengeStore((state) => state.dailyChallenge);
  const completedToday = useChallengeStore((state) => state.completedToday);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true
        })
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <LinearGradient
          colors={["rgba(230,57,70,0.28)", "rgba(230,57,70,0.08)", "#111111"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.eyebrow}>Good evening</Text>
          <Text style={styles.title}>
            {user?.name ?? "You"}, today is made for softness and surprise.
          </Text>
          <Text style={styles.subtitle}>
            Keep your ritual alive with one thoughtful move tonight.
          </Text>
        </LinearGradient>
      </FadeInView>

      <FadeInView delay={120}>
        <View style={styles.metricsRow}>
          <Animated.View style={[styles.metricCard, { transform: [{ scale: pulse }] }]}>
            <Text style={styles.metricValue}>{streak}</Text>
            <Text style={styles.metricLabel}>Day Streak</Text>
          </Animated.View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{completedToday ? "Done" : "Live"}</Text>
            <Text style={styles.metricLabel}>Daily Spark</Text>
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={180}>
        <LinearGradient
          colors={["#2A1518", "#1D1A1A", "#151515"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.challengeCard}
        >
          <Text style={styles.cardEyebrow}>Daily Challenge</Text>
          <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
          <Text style={styles.challengeCopy}>{dailyChallenge.description}</Text>
          <View style={styles.challengeMeta}>
            <Text style={styles.challengeBadge}>{dailyChallenge.category}</Text>
            <Text style={styles.challengeTime}>{dailyChallenge.duration}</Text>
          </View>
        </LinearGradient>
      </FadeInView>

      <FadeInView delay={240}>
        <View style={styles.noteCard}>
          <Text style={styles.cardEyebrow}>Tonight's Mood</Text>
          <Text style={styles.noteTitle}>Slow burn with playful tension</Text>
          <Text style={styles.noteCopy}>
            Suggestion: dim lights, one shared playlist and ten uninterrupted minutes
            together.
          </Text>
        </View>
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
    gap: theme.spacing.md
  },
  hero: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    ...theme.shadows.card
  },
  eyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontFamily: theme.typography.semibold,
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30,
    lineHeight: 36
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
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
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
    ...theme.shadows.card
  },
  metricValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28,
    letterSpacing: -0.5
  },
  metricLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 14
  },
  challengeCard: {
    borderRadius: theme.radii.lg,
    gap: theme.spacing.md,
    overflow: "hidden",
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  cardEyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontFamily: theme.typography.semibold,
    letterSpacing: 2,
    textTransform: "uppercase"
  },
  challengeTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 24,
    letterSpacing: -0.3
  },
  challengeCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  challengeMeta: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  challengeBadge: {
    color: theme.colors.accent,
    fontFamily: theme.typography.semibold,
    fontSize: 14,
    textTransform: "uppercase"
  },
  challengeTime: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 14
  },
  noteCard: {
    backgroundColor: theme.colors.cardElevated,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  noteTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 22,
    letterSpacing: -0.2
  },
  noteCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  }
});
