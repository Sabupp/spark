import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>
          Findet den richtigen Vibe fur heute Abend.
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <Pressable
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
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.list}>
        {items.map((challenge) => (
          <Pressable
            key={challenge.id}
            style={styles.challengeCard}
            onPress={() => toggleChallenge(challenge.id)}
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
          </Pressable>
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
    padding: theme.spacing.lg,
    gap: theme.spacing.lg
  },
  header: {
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "700"
  },
  subtitle: {
    color: theme.colors.textSecondary,
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10
  },
  filterChipActive: {
    backgroundColor: theme.colors.accent
  },
  filterLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "600"
  },
  filterLabelActive: {
    color: theme.colors.textPrimary
  },
  list: {
    gap: theme.spacing.md
  },
  challengeCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  challengeCategory: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  challengeDuration: {
    color: theme.colors.textSecondary,
    fontSize: 14
  },
  challengeTitle: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: "700"
  },
  challengeCopy: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  challengeState: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: "600"
  },
  challengeStateDone: {
    color: theme.colors.success
  }
});
