export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthActionResult = {
  success: boolean;
  error?: string;
};

export type AuthPreferences = {
  notificationsEnabled: boolean;
  eveningModeEnabled: boolean;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCheckedSession: boolean;
  onboardingCompleted: boolean;
  preferences: AuthPreferences;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<AuthActionResult>;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
  completeOnboarding: () => Promise<AuthActionResult>;
  toggleNotifications: () => void;
  toggleEveningMode: () => void;
};

export type ChallengeCategory =
  | "start"
  | "spicy"
  | "hot"
  | "extreme"
  | "date_night"
  | "communication";

export type ChallengeFilter = "All" | ChallengeCategory;

export type Challenge = {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: string;
  points: number;
  completed?: boolean;
};

export type UserChallenge = {
  id: string;
  user_id: string;
  challenge_id: string;
  completed_at: string;
  partner_id?: string;
  rating?: number;
  notes?: string;
};

export type ChallengeActionResult = {
  success: boolean;
  error?: string;
};

export type ChallengeState = {
  challenges: Challenge[];
  dailyChallenge: Challenge | null;
  completedChallenges: UserChallenge[];
  streak: number;
  totalPoints: number;
  isLoading: boolean;
  activeFilter: ChallengeFilter;
  completedToday: boolean;
  loadChallenges: () => void;
  fetchCompletedChallenges: () => Promise<void>;
  getDailyChallenge: () => Challenge | null;
  completeChallenge: (
    challengeId: string,
    rating?: number,
    notes?: string
  ) => Promise<ChallengeActionResult>;
  calculateStreak: () => number;
  getChallengesByCategory: (category: ChallengeCategory) => Challenge[];
  getChallengesByDifficulty: (difficulty: number) => Challenge[];
  getRecommendedDifficulty: () => 1 | 2 | 3 | 4 | 5;
  incrementStreak: () => void;
  setActiveFilter: (filter: ChallengeFilter) => void;
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
