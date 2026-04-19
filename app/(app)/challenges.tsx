import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useChallengeStore } from "@/store/useChallengeStore";
import { ChallengeCategory } from "@/types";
import { theme } from "@/theme";

const filters: ChallengeCategory[] = ["All", "Flirty", "Emotional", "Intimate"];

export default function ChallengesScreen() {
  const items = useChallengeStore((state) => state.filteredChallenges());
  const activeFilter = useChallengeStore((state) => state.activeFilter);
  const setActiveFilter = useChallengeStore((state) => state.setActiveFilter);
  const toggleChallenge = useChallengeStore((state) => state.toggleChallengeComplete);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.header}>
          <Text style={styles.title}>Challenges</Text>
          <Text style={styles.subtitle}>
            Findet den richtigen Vibe fur heute Abend.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={120}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterRow}>
            {filters.map((filter) => {
              const active = filter === activeFilter;
              return (
                <InteractiveCard
                  key={filter}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      active && styles.filterLabelActive
                    ]}
                  >
                    {filter}
                  </Text>
                </InteractiveCard>
              );
            })}
          </View>
        </ScrollView>
      </FadeInView>

      <View style={styles.list}>
        {items.map((challenge, index) => (
          <FadeInView key={challenge.id} delay={180 + index * 70}>
            <InteractiveCard
              style={styles.challengeCard}
              onPress={() => toggleChallenge(challenge.id)}
            >
              <LinearGradient
                colors={
                  challenge.completed
                    ? ["#1E251F", "#1A1A1A"]
                    : ["#291518", "#1D1A1A", "#171717"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.challengeGradient}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.challengeCategory}>{challenge.category}</Text>
                  <Text style={styles.challengeDuration}>{challenge.duration}</Text>
                </View>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeCopy}>{challenge.description}</Text>
                <Text
                  style={[
                    styles.challengeState,
                    challenge.completed && styles.challengeStateDone
                  ]}
                >
                  {challenge.completed ? "Completed" : "Tap to mark complete"}
                </Text>
              </LinearGradient>
            </InteractiveCard>
          </FadeInView>
        ))}
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
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  header: {
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  filterRow: {
    flexDirection: "row",
    gap: theme.spacing.sm
  },
  filterChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs
  },
  filterChipActive: {
    backgroundColor: theme.colors.accentMuted,
    borderColor: "rgba(255,107,107,0.4)"
  },
  filterLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 14,
    textTransform: "uppercase"
  },
  filterLabelActive: {
    color: theme.colors.textPrimary
  },
  list: {
    gap: theme.spacing.md
  },
  challengeCard: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...theme.shadows.card
  },
  challengeGradient: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  challengeCategory: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontFamily: theme.typography.semibold,
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  challengeDuration: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 14
  },
  challengeTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 20,
    letterSpacing: -0.2
  },
  challengeCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  challengeState: {
    color: theme.colors.accent,
    fontFamily: theme.typography.medium,
    fontSize: 14,
    textTransform: "uppercase"
  },
  challengeStateDone: {
    color: theme.colors.success
  }
});
