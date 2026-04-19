import { create } from "zustand";

import { Challenge, ChallengeCategory, ChallengeState } from "@/types";

const challengeSeed: Challenge[] = [
  {
    id: "1",
    title: "Three compliments, no repeats",
    description: "Each of you gives three specific compliments that feel fresh and true.",
    category: "Flirty",
    duration: "5 min",
    completed: false
  },
  {
    id: "2",
    title: "Slow eye contact",
    description: "Sit close, hold eye contact for sixty seconds, then share one desire.",
    category: "Intimate",
    duration: "3 min",
    completed: true
  },
  {
    id: "3",
    title: "Memory lane",
    description: "Tell the story of a moment when you felt especially chosen by your partner.",
    category: "Emotional",
    duration: "8 min",
    completed: false
  },
  {
    id: "4",
    title: "Phone-free reset",
    description: "Put both phones away for fifteen minutes and focus only on touch and conversation.",
    category: "Intimate",
    duration: "15 min",
    completed: false
  }
];

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  streak: 12,
  activeFilter: "All",
  completedToday: false,
  challenges: challengeSeed,
  dailyChallenge: challengeSeed[0],
  setActiveFilter: (filter: ChallengeCategory) =>
    set({
      activeFilter: filter
    }),
  toggleChallengeComplete: (id: string) =>
    set((state) => {
      const updatedChallenges = state.challenges.map((challenge) =>
        challenge.id === id
          ? { ...challenge, completed: !challenge.completed }
          : challenge
      );

      const dailyChallenge =
        updatedChallenges.find(
          (challenge) => challenge.id === state.dailyChallenge.id
        ) ?? updatedChallenges[0];

      return {
        challenges: updatedChallenges,
        dailyChallenge,
        completedToday: dailyChallenge.completed
      };
    }),
  filteredChallenges: () => {
    const { activeFilter, challenges } = get();
    if (activeFilter === "All") {
      return challenges;
    }

    return challenges.filter((challenge) => challenge.category === activeFilter);
  }
}));
