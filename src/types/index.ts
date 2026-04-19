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
  onboardingCompleted: boolean;
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

export type CouplePartner = {
  id: string;
  name: string;
  email: string;
};

export type PendingInvite = {
  from: string;
  code: string;
  expiresAt: string;
};

export type CoupleStatus = {
  isConnected: boolean;
  label: string;
  partnerName: string | null;
};

export type CoupleState = {
  coupleId: string | null;
  partner: CouplePartner | null;
  inviteCode: string;
  isConnected: boolean;
  pendingInvite: PendingInvite | null;
  connectedAt: string | null;
  sharedChallengesCompleted: number;
  generateInviteCode: () => string;
  acceptInvite: (code: string) => boolean;
  disconnectCouple: () => void;
  getCoupleStatus: () => CoupleStatus;
};
