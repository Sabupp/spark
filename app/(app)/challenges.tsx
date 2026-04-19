import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useChallengeStore } from "@/store/useChallengeStore";
import { Challenge, ChallengeCategory } from "@/types";
import { theme } from "@/theme";

const categoryFilters: Array<ChallengeCategory | "All"> = [
  "All",
  "start",
  "spicy",
  "hot",
  "extreme",
  "date_night",
  "communication"
];

const categoryLabels: Record<ChallengeCategory | "All", string> = {
  All: "All",
  start: "Start",
  spicy: "Spicy",
  hot: "Hot",
  extreme: "Extreme",
  date_night: "Date Night",
  communication: "Communication"
};

const categoryColors: Record<ChallengeCategory, string> = {
  start: "#7DDF9B",
  spicy: "#FF9F43",
  hot: "#E63946",
  extreme: "#9B5DE5",
  date_night: "#FF6FAE",
  communication: "#4D96FF"
};

const difficultyOptions = [1, 2, 3, 4, 5] as const;

export default function ChallengesScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const activeFilter = useChallengeStore((state) => state.activeFilter);
  const setActiveFilter = useChallengeStore((state) => state.setActiveFilter);
  const filteredChallenges = useChallengeStore((state) => state.filteredChallenges);
  const getChallengesByCategory = useChallengeStore(
    (state) => state.getChallengesByCategory
  );
  const completeChallenge = useChallengeStore((state) => state.completeChallenge);
  const dailyChallenge = useChallengeStore((state) => state.dailyChallenge);
  const loadChallenges = useChallengeStore((state) => state.loadChallenges);
  const fetchCompletedChallenges = useChallengeStore(
    (state) => state.fetchCompletedChallenges
  );
  const isLoading = useChallengeStore((state) => state.isLoading);

  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const columns = width >= 768 ? 2 : 1;

  useEffect(() => {
    loadChallenges();
    void fetchCompletedChallenges();
  }, [fetchCompletedChallenges, loadChallenges]);

  const baseChallenges = useMemo(() => {
    if (activeFilter === "All") {
      return filteredChallenges();
    }

    return getChallengesByCategory(activeFilter);
  }, [activeFilter, filteredChallenges, getChallengesByCategory]);

  const visibleChallenges = useMemo(() => {
    if (selectedDifficulty == null) {
      return baseChallenges;
    }

    return baseChallenges.filter(
      (challenge) => challenge.difficulty === selectedDifficulty
    );
  }, [baseChallenges, selectedDifficulty]);

  const openChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const resetFilters = () => {
    setActiveFilter("All");
    setSelectedDifficulty(null);
  };

  const handleAcceptChallenge = async () => {
    if (!selectedChallenge || selectedChallenge.completed) {
      setSelectedChallenge(null);
      return;
    }

    const result = await completeChallenge(selectedChallenge.id);
    if (result.success) {
      setSelectedChallenge(null);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView delay={40}>
          <View style={styles.header}>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>Find your next spark together</Text>
          </View>
        </FadeInView>

        <FadeInView delay={100}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {categoryFilters.map((filter) => {
                const active = activeFilter === filter;
                return (
                  <InteractiveCard
                    key={filter}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setActiveFilter(filter)}
                  >
                    <Text
                      style={[styles.filterLabel, active && styles.filterLabelActive]}
                    >
                      {categoryLabels[filter]}
                    </Text>
                  </InteractiveCard>
                );
              })}
            </View>
          </ScrollView>
        </FadeInView>

        <FadeInView delay={140}>
          <View style={styles.difficultySection}>
            <Text style={styles.difficultyTitle}>Difficulty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.difficultyRow}>
                <InteractiveCard
                  style={[
                    styles.difficultyChip,
                    selectedDifficulty == null && styles.difficultyChipActive
                  ]}
                  onPress={() => setSelectedDifficulty(null)}
                >
                  <Text
                    style={[
                      styles.difficultyLabel,
                      selectedDifficulty == null && styles.difficultyLabelActive
                    ]}
                  >
                    Any difficulty
                  </Text>
                </InteractiveCard>
                {difficultyOptions.map((difficulty) => {
                  const active = selectedDifficulty === difficulty;
                  return (
                    <InteractiveCard
                      key={difficulty}
                      style={[
                        styles.difficultyChip,
                        active && styles.difficultyChipActive
                      ]}
                      onPress={() => setSelectedDifficulty(difficulty)}
                    >
                      <Text
                        style={[
                          styles.difficultyLabel,
                          active && styles.difficultyLabelActive
                        ]}
                      >
                        {"⭐".repeat(difficulty)}
                      </Text>
                    </InteractiveCard>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </FadeInView>

        {visibleChallenges.length === 0 ? (
          <FadeInView delay={180}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>✨</Text>
              <Text style={styles.emptyTitle}>No challenges match your filters</Text>
              <Text style={styles.emptyCopy}>
                Try another category or difficulty and we will surface new ideas.
              </Text>
              <InteractiveCard style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetButtonText}>Reset filters</Text>
              </InteractiveCard>
            </View>
          </FadeInView>
        ) : (
          <View style={styles.grid}>
            {visibleChallenges.map((challenge, index) => (
              <FadeInView
                key={challenge.id}
                delay={180 + index * 45}
                style={[
                  styles.gridItem,
                  columns === 2 ? styles.gridItemHalf : styles.gridItemFull
                ]}
              >
                <InteractiveCard
                  style={styles.challengeCard}
                  onPress={() => openChallenge(challenge)}
                >
                  <LinearGradient
                    colors={
                      challenge.completed
                        ? ["#1D2A22", "#1A1A1A"]
                        : ["#231719", "#1C1A1A", "#151515"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.challengeCardInner}
                  >
                    <View style={styles.cardTop}>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: categoryColors[challenge.category] }
                        ]}
                      >
                        <Text style={styles.categoryBadgeText}>
                          {categoryLabels[challenge.category]}
                        </Text>
                      </View>
                      <View style={styles.durationBadge}>
                        <Text style={styles.durationBadgeText}>{challenge.duration}</Text>
                      </View>
                    </View>

                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text numberOfLines={2} style={styles.challengeDescription}>
                      {challenge.description}
                    </Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.starsText}>
                        {"⭐".repeat(challenge.difficulty)}
                      </Text>
                      <View style={styles.pointsBadge}>
                        <Text style={styles.pointsBadgeText}>
                          {challenge.points} pts
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </InteractiveCard>
              </FadeInView>
            ))}
          </View>
        )}

        <FadeInView delay={220}>
          <InteractiveCard
            style={styles.dailyCtaCard}
            onPress={() => router.push("/(app)")}
          >
            <LinearGradient
              colors={["rgba(230,57,70,0.22)", "#1B1B1B", "#151515"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.dailyCtaInner}
            >
              <Text style={styles.dailyCtaEyebrow}>Daily Challenge</Text>
              <Text style={styles.dailyCtaTitle}>
                {dailyChallenge?.title ?? "See today's curated spark"}
              </Text>
              <Text style={styles.dailyCtaCopy}>
                Jump back home for your featured couple ritual.
              </Text>
            </LinearGradient>
          </InteractiveCard>
        </FadeInView>
      </ScrollView>

      <Modal
        visible={selectedChallenge != null}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedChallenge(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {selectedChallenge?.title ?? "Challenge"}
            </Text>
            <Text style={styles.modalDescription}>
              {selectedChallenge?.description ?? ""}
            </Text>

            <View style={styles.modalMetaRow}>
              <Text style={styles.modalMeta}>
                {selectedChallenge
                  ? categoryLabels[selectedChallenge.category]
                  : "Category"}
              </Text>
              <Text style={styles.modalMeta}>
                {selectedChallenge
                  ? "⭐".repeat(selectedChallenge.difficulty)
                  : "⭐"}
              </Text>
            </View>
            <View style={styles.modalMetaRow}>
              <Text style={styles.modalMeta}>
                {selectedChallenge?.duration ?? "10 min"}
              </Text>
              <Text style={styles.modalMeta}>
                {selectedChallenge?.points ?? 0} pts
              </Text>
            </View>

            <InteractiveCard
              style={styles.acceptButton}
              onPress={() => {
                void handleAcceptChallenge();
              }}
            >
              <Text style={styles.acceptButtonText}>
                {selectedChallenge?.completed
                  ? "Challenge Completed"
                  : isLoading
                    ? "Saving..."
                    : "Accept Challenge"}
              </Text>
            </InteractiveCard>

            <InteractiveCard
              style={styles.closeButton}
              onPress={() => setSelectedChallenge(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </InteractiveCard>
          </View>
        </View>
      </Modal>
    </>
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
  header: {
    gap: theme.spacing.xs
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 34,
    letterSpacing: -0.4
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  filterRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingRight: theme.spacing.sm
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
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent
  },
  filterLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 13,
    textTransform: "uppercase"
  },
  filterLabelActive: {
    color: theme.colors.textPrimary
  },
  difficultySection: {
    gap: theme.spacing.xs
  },
  difficultyTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16
  },
  difficultyRow: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    paddingRight: theme.spacing.sm
  },
  difficultyChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs
  },
  difficultyChipActive: {
    backgroundColor: theme.colors.accentMuted,
    borderColor: "rgba(255,107,107,0.35)"
  },
  difficultyLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 13
  },
  difficultyLabelActive: {
    color: theme.colors.textPrimary
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm
  },
  gridItem: {},
  gridItemFull: {
    width: "100%"
  },
  gridItemHalf: {
    width: "48%"
  },
  challengeCard: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...theme.shadows.card
  },
  challengeCardInner: {
    minHeight: 224,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.sm
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  durationBadge: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  durationBadgeText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 11
  },
  challengeTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 20,
    lineHeight: 24
  },
  challengeDescription: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  cardFooter: {
    marginTop: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  starsText: {
    color: theme.colors.textPrimary,
    fontSize: 14
  },
  pointsBadge: {
    backgroundColor: theme.colors.accentMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  pointsBadgeText: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 11,
    textTransform: "uppercase"
  },
  emptyState: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.lg,
    ...theme.shadows.card
  },
  emptyIcon: {
    fontSize: 28
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 20
  },
  emptyCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center"
  },
  resetButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs
  },
  resetButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 14
  },
  dailyCtaCard: {
    borderRadius: theme.radii.lg,
    overflow: "hidden",
    ...theme.shadows.card
  },
  dailyCtaInner: {
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md
  },
  dailyCtaEyebrow: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.semibold,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase"
  },
  dailyCtaTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 22,
    lineHeight: 28
  },
  dailyCtaCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: theme.spacing.md
  },
  modalCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  modalTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28,
    lineHeight: 34
  },
  modalDescription: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 23
  },
  modalMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm
  },
  modalMeta: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.medium,
    fontSize: 14
  },
  acceptButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  acceptButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16
  },
  closeButton: {
    alignItems: "center",
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  closeButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 15
  }
});
