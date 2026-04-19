export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthPreferences = {
  notificationsEnabled: boolean;
  eveningModeEnabled: boolean;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  preferences: AuthPreferences;
  signIn: (user: User) => void;
  signOut: () => void;
  completeOnboarding: () => void;
  toggleNotifications: () => void;
  toggleEveningMode: () => void;
};

export type ChallengeCategory = "All" | "Flirty" | "Emotional" | "Intimate";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: Exclude<ChallengeCategory, "All">;
  duration: string;
  completed: boolean;
};

export type ChallengeState = {
  streak: number;
  activeFilter: ChallengeCategory;
  completedToday: boolean;
  challenges: Challenge[];
  dailyChallenge: Challenge;
  setActiveFilter: (filter: ChallengeCategory) => void;
  toggleChallengeComplete: (id: string) => void;
  filteredChallenges: () => Challenge[];
};

export type ConnectionStatus = "Pending" | "Connected";

export type Partner = {
  id: string;
  name: string;
  connectedSince: string;
};

export type PartnerState = {
  connectionStatus: ConnectionStatus;
  pendingInviteCode: string;
  partner: Partner | null;
  toggleConnection: () => void;
};
