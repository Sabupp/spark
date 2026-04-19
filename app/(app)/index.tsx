import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useChallengeStore } from "@/store/useChallengeStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { ChallengeCategory } from "@/types";
import { theme } from "@/theme";

const categoryColors: Record<ChallengeCategory, string> = {
  start: "#7DDF9B",
  spicy: "#FF9F43",
  hot: "#E63946",
  extreme: "#9B5DE5",
  date_night: "#FF6FAE",
  communication: "#4D96FF"
};

const categoryLabels: Record<ChallengeCategory, string> = {
  start: "Start",
  spicy: "Spicy",
  hot: "Hot",
  extreme: "Extreme",
  date_night: "Date Night",
  communication: "Communication"
};

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    streak,
    totalPoints,
    dailyChallenge,
    completedToday,
    isLoading,
    loadChallenges,
    fetchCompletedChallenges,
    getDailyChallenge,
    completeChallenge
  } = useChallengeStore();
  const { isConnected, partner } = useCoupleStore();

  const [celebrating, setCelebrating] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0.92)).current;
  const successOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: theme.animation.pulseScale,
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

  useEffect(() => {
    loadChallenges();
    void fetchCompletedChallenges().then(() => {
      getDailyChallenge();
    });
  }, [fetchCompletedChallenges, getDailyChallenge, loadChallenges]);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  }, []);

  const partnerStatus = isConnected
    ? `Connected with ${partner?.name ?? "your partner"}`
    : "Waiting to connect";

  const handleCompleteChallenge = async () => {
    if (!dailyChallenge || completedToday || isLoading) {
      return;
    }

    const result = await completeChallenge(dailyChallenge.id);
    if (!result.success) {
      return;
    }

    successScale.setValue(0.92);
    successOpacity.setValue(0);
    setCelebrating(true);

    Animated.parallel([
      Animated.spring(successScale, {
        toValue: 1,
        tension: 180,
        friction: 10,
        useNativeDriver: true
      }),
      Animated.timing(successOpacity, {
        toValue: 1,
        duration: theme.animation.medium,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(() => setCelebrating(false), 1800);
    });

    await fetchCompletedChallenges();
    getDailyChallenge();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <LinearGradient
          colors={["rgba(230,57,70,0.24)", "rgba(230,57,70,0.08)", "#111111"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>Good evening, {user?.name ?? "lover"}</Text>
          <Text style={styles.heroDate}>{formattedDate}</Text>
          <Text style={styles.heroSubtitle}>
            Tonight feels like a good night to keep your ritual alive and build a
            little more momentum together.
          </Text>
        </LinearGradient>
      </FadeInView>

      <FadeInView delay={100}>
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Daily Challenge</Text>

          {!dailyChallenge ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={theme.colors.accent} />
              <Text style={styles.loadingText}>Loading your daily spark...</Text>
            </View>
          ) : (
            <InteractiveCard style={styles.dailyCard}>
              <LinearGradient
                colors={
                  completedToday
                    ? ["#1D2A22", "#1A1A1A", "#151515"]
                    : ["#2A1518", "#1D1A1A", "#151515"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dailyCardInner}
              >
                <View style={styles.cardTop}>
                  <View
                    style={[
                      styles.categoryBadge,
                      { backgroundColor: categoryColors[dailyChallenge.category] }
                    ]}
                  >
                    <Text style={styles.categoryBadgeText}>
                      {categoryLabels[dailyChallenge.category]}
                    </Text>
                  </View>
                  <Text style={styles.starsText}>
                    {"⭐".repeat(dailyChallenge.difficulty)}
                  </Text>
                </View>

                <Text style={styles.challengeTitle}>{dailyChallenge.title}</Text>
                <Text numberOfLines={3} style={styles.challengeDescription}>
                  {dailyChallenge.description}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>{dailyChallenge.duration}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>
                      {dailyChallenge.points} pts
                    </Text>
                  </View>
                </View>

                {completedToday ? (
                  <View style={styles.completedState}>
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✓ Completed</Text>
                    </View>
                    <Text style={styles.completedMessage}>Great job!</Text>
                  </View>
                ) : (
                  <InteractiveCard
                    style={styles.completeButton}
                    onPress={() => {
                      void handleCompleteChallenge();
                    }}
                  >
                    <Text style={styles.completeButtonText}>
                      Complete Today's Challenge
                    </Text>
                  </InteractiveCard>
                )}

                {celebrating ? (
                  <Animated.View
                    style={[
                      styles.successOverlay,
                      {
                        opacity: successOpacity,
                        transform: [{ scale: successScale }]
                      }
                    ]}
                  >
                    <Text style={styles.successEmoji}>🎉</Text>
                    <Text style={styles.successText}>Challenge completed</Text>
                  </Animated.View>
                ) : null}
              </LinearGradient>
            </InteractiveCard>
          )}
        </View>
      </FadeInView>

      <FadeInView delay={180}>
        <View style={styles.statsRow}>
          <InteractiveCard style={styles.statCard}>
            <Animated.View style={[styles.statValueWrap, { transform: [{ scale: pulse }] }]}>
              <Text style={styles.statIcon}>🔥</Text>
              <Text style={styles.statValue}>{streak}</Text>
            </Animated.View>
            <Text style={styles.statLabel}>Current streak</Text>
          </InteractiveCard>

          <InteractiveCard style={styles.statCard}>
            <Text style={styles.statValue}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total points earned</Text>
          </InteractiveCard>

          <InteractiveCard style={styles.statCard}>
            <Text style={styles.partnerValue}>{isConnected ? "Connected" : "Pending"}</Text>
            <Text style={styles.statLabel}>{partnerStatus}</Text>
          </InteractiveCard>
        </View>
      </FadeInView>

      {isConnected ? (
        <FadeInView delay={210}>
          <InteractiveCard style={styles.partnerCard}>
            <Text style={styles.sectionEyebrow}>Partner Activity</Text>
            <Text style={styles.partnerActivityTitle}>
              {partner?.name ?? "Your partner"} completed today's challenge
            </Text>
            <Text style={styles.partnerActivityCopy}>
              Shared streak progress is looking strong. Keep the chain alive tonight.
            </Text>
          </InteractiveCard>
        </FadeInView>
      ) : null}

      <FadeInView delay={240}>
        <View style={styles.quickActions}>
          <InteractiveCard
            style={styles.quickActionPrimary}
            onPress={() => router.push("/(app)/challenges")}
          >
            <Text style={styles.quickActionPrimaryText}>Browse Challenges</Text>
          </InteractiveCard>
          <InteractiveCard
            style={styles.quickActionSecondary}
            onPress={() => router.push("/(app)/profile")}
          >
            <Text style={styles.quickActionSecondaryText}>View History</Text>
          </InteractiveCard>
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
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xxl
  },
  hero: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    ...theme.shadows.card
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 32,
    lineHeight: 38
  },
  heroDate: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.medium,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.2
  },
  heroSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  section: {
    gap: theme.spacing.xs
  },
  sectionEyebrow: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: "uppercase"
  },
  loadingCard: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    ...theme.shadows.card
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15
  },
  dailyCard: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...theme.shadows.card
  },
  dailyCardInner: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.xs
  },
  categoryBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontFamily: theme.typography.semibold,
    fontSize: 11,
    textTransform: "uppercase"
  },
  starsText: {
    color: theme.colors.textPrimary,
    fontSize: 14
  },
  challengeTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 26,
    lineHeight: 32
  },
  challengeDescription: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 23
  },
  metaRow: {
    flexDirection: "row",
    gap: theme.spacing.xs
  },
  metaBadge: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  metaBadgeText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 12
  },
  completeButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  completeButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16
  },
  completedState: {
    gap: theme.spacing.xs
  },
  completedBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(125,223,155,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  completedBadgeText: {
    color: theme.colors.success,
    fontFamily: theme.typography.semibold,
    fontSize: 13
  },
  completedMessage: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 18
  },
  successOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(13,13,13,0.9)",
    borderRadius: theme.radii.md,
    bottom: theme.spacing.md,
    justifyContent: "center",
    left: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    position: "absolute",
    right: theme.spacing.md
  },
  successEmoji: {
    fontSize: 24
  },
  successText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 15,
    marginTop: 6
  },
  statsRow: {
    gap: theme.spacing.sm
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  statValueWrap: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  statIcon: {
    fontSize: 22
  },
  statValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30
  },
  partnerValue: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.bold,
    fontSize: 22
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  partnerCard: {
    backgroundColor: theme.colors.cardElevated,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  partnerActivityTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 20,
    lineHeight: 26
  },
  partnerActivityCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  quickActions: {
    gap: theme.spacing.sm
  },
  quickActionPrimary: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  quickActionPrimaryText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16
  },
  quickActionSecondary: {
    alignItems: "center",
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  quickActionSecondaryText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 15
  }
});
