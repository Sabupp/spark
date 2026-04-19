import { create } from "zustand";

import { CHALLENGES } from "@/data/challenges";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import {
  Challenge,
  ChallengeActionResult,
  ChallengeCategory,
  ChallengeFilter,
  ChallengeState,
  UserChallenge
} from "@/types";

function mapChallenges(completedChallenges: UserChallenge[]) {
  const completedIds = new Set(completedChallenges.map((entry) => entry.challenge_id));

  return CHALLENGES.map((challenge) => ({
    ...challenge,
    completed: completedIds.has(challenge.id)
  }));
}

function isSameDay(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function sortNewestFirst(entries: UserChallenge[]) {
  return [...entries].sort(
    (left, right) =>
      new Date(right.completed_at).getTime() - new Date(left.completed_at).getTime()
  );
}

function calculateStreakFromCompletions(entries: UserChallenge[]) {
  if (entries.length === 0) {
    return 0;
  }

  const dates = Array.from(
    new Set(
      entries.map((entry) => new Date(entry.completed_at).toISOString().slice(0, 10))
    )
  ).sort((left, right) => (left < right ? 1 : -1));

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let index = 0; index < 7; index += 1) {
    const dayKey = cursor.toISOString().slice(0, 10);
    if (!dates.includes(dayKey)) {
      if (index === 0) {
        cursor.setDate(cursor.getDate() - 1);
        const yesterdayKey = cursor.toISOString().slice(0, 10);
        if (dates.includes(yesterdayKey)) {
          streak += 1;
          continue;
        }
      }
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getWeightedCategory(recommendedDifficulty: number) {
  if (recommendedDifficulty <= 2) {
    return ["start", "communication", "date_night"] as ChallengeCategory[];
  }

  if (recommendedDifficulty === 3) {
    return ["spicy", "date_night", "communication"] as ChallengeCategory[];
  }

  if (recommendedDifficulty === 4) {
    return ["hot", "spicy", "communication"] as ChallengeCategory[];
  }

  return ["extreme", "hot", "spicy"] as ChallengeCategory[];
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: CHALLENGES.map((challenge) => ({ ...challenge, completed: false })),
  dailyChallenge: CHALLENGES[0] ?? null,
  completedChallenges: [],
  streak: 0,
  totalPoints: 0,
  isLoading: false,
  activeFilter: "All",
  completedToday: false,
  loadChallenges: () => {
    const completedChallenges = get().completedChallenges;
    const challenges = mapChallenges(completedChallenges);

    set((state) => ({
      challenges,
      dailyChallenge:
        state.dailyChallenge &&
        challenges.find((challenge) => challenge.id === state.dailyChallenge?.id)
          ? challenges.find((challenge) => challenge.id === state.dailyChallenge?.id) ?? null
          : challenges[0] ?? null,
      completedToday: completedChallenges.some((entry) => isSameDay(entry.completed_at))
    }));
  },
  fetchCompletedChallenges: async () => {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
      set({
        completedChallenges: [],
        streak: 0,
        totalPoints: 0,
        completedToday: false
      });
      get().loadChallenges();
      return;
    }

    set({ isLoading: true });

    const { data, error } = await supabase
      .from("user_challenges")
      .select("id, user_id, challenge_id, completed_at, partner_id, rating, notes")
      .eq("user_id", currentUser.id)
      .order("completed_at", { ascending: false });

    if (error) {
      set({ isLoading: false });
      return;
    }

    const completedChallenges = (data ?? []) as UserChallenge[];
    const mappedChallenges = mapChallenges(completedChallenges);
    const totalPoints = completedChallenges.reduce((sum, entry) => {
      const challenge = CHALLENGES.find((item) => item.id === entry.challenge_id);
      return sum + (challenge?.points ?? 0);
    }, 0);

    set({
      completedChallenges,
      challenges: mappedChallenges,
      streak: calculateStreakFromCompletions(completedChallenges),
      totalPoints,
      completedToday: completedChallenges.some((entry) => isSameDay(entry.completed_at)),
      isLoading: false
    });

    if (!get().dailyChallenge) {
      get().getDailyChallenge();
    }
  },
  getDailyChallenge: () => {
    const recommendedDifficulty = get().getRecommendedDifficulty();
    const preferredCategories = getWeightedCategory(recommendedDifficulty);
    const pool = get().challenges.filter(
      (challenge) =>
        preferredCategories.includes(challenge.category) &&
        challenge.difficulty <= recommendedDifficulty + 1
    );
    const fallbackPool = pool.length > 0 ? pool : get().challenges;
    const randomIndex = Math.floor(Math.random() * fallbackPool.length);
    const dailyChallenge = fallbackPool[randomIndex] ?? null;

    set({ dailyChallenge });
    return dailyChallenge;
  },
  completeChallenge: async (
    challengeId: string,
    rating?: number,
    notes?: string
  ): Promise<ChallengeActionResult> => {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
      return {
        success: false,
        error: "You need to be logged in to complete a challenge."
      };
    }

    const { partner } = useCoupleStore.getState();

    set({ isLoading: true });

    const payload = {
      user_id: currentUser.id,
      challenge_id: challengeId,
      completed_at: new Date().toISOString(),
      partner_id: partner?.id,
      rating,
      notes
    };

    const { data, error } = await supabase
      .from("user_challenges")
      .insert(payload)
      .select("id, user_id, challenge_id, completed_at, partner_id, rating, notes")
      .single();

    if (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.message
      };
    }

    const completedChallenges = sortNewestFirst([
      data as UserChallenge,
      ...get().completedChallenges
    ]);
    const challenges = mapChallenges(completedChallenges);
    const totalPoints = completedChallenges.reduce((sum, entry) => {
      const challenge = CHALLENGES.find((item) => item.id === entry.challenge_id);
      return sum + (challenge?.points ?? 0);
    }, 0);
    const dailyChallenge =
      get().dailyChallenge &&
      challenges.find((challenge) => challenge.id === get().dailyChallenge?.id)
        ? challenges.find((challenge) => challenge.id === get().dailyChallenge?.id) ?? null
        : get().dailyChallenge;

    set({
      completedChallenges,
      challenges,
      dailyChallenge,
      totalPoints,
      completedToday: true,
      streak: calculateStreakFromCompletions(completedChallenges),
      isLoading: false
    });

    return {
      success: true
    };
  },
  calculateStreak: () => {
    const streak = calculateStreakFromCompletions(get().completedChallenges);
    set({ streak });
    return streak;
  },
  getChallengesByCategory: (category: ChallengeCategory) =>
    get().challenges.filter((challenge) => challenge.category === category),
  getChallengesByDifficulty: (difficulty: number) =>
    get().challenges.filter((challenge) => challenge.difficulty === difficulty),
  getRecommendedDifficulty: () => {
    const completed = get().completedChallenges;

    if (completed.length === 0) {
      return 1;
    }

    const totalDifficulty = completed.reduce((sum, entry) => {
      const challenge = CHALLENGES.find((item) => item.id === entry.challenge_id);
      return sum + (challenge?.difficulty ?? 1);
    }, 0);

    const averageDifficulty = totalDifficulty / completed.length;

    if (averageDifficulty < 1.8) {
      return 2;
    }
    if (averageDifficulty < 2.8) {
      return 3;
    }
    if (averageDifficulty < 3.8) {
      return 4;
    }

    return 5;
  },
  incrementStreak: () =>
    set((state) => ({
      streak: state.streak + 1
    })),
  setActiveFilter: (filter: ChallengeFilter) =>
    set({
      activeFilter: filter
    }),
  toggleChallengeComplete: (id: string) => {
    void get().completeChallenge(id);
  },
  filteredChallenges: () => {
    const { activeFilter } = get();
    if (activeFilter === "All") {
      return get().challenges;
    }

    return get().getChallengesByCategory(activeFilter);
  }
}));
