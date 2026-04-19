import { create } from "zustand";

import { AuthPreferences, AuthState, User } from "@/types";

const defaultPreferences: AuthPreferences = {
  notificationsEnabled: true,
  eveningModeEnabled: true
};

const initialUser: User | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: false,
  onboardingCompleted: false,
  preferences: defaultPreferences,
  signIn: (user: User) =>
    set({
      user,
      isAuthenticated: true
    }),
  signOut: () =>
    set({
      user: null,
      isAuthenticated: false
    }),
  completeOnboarding: () =>
    set({
      onboardingCompleted: true
    }),
  toggleNotifications: () =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        notificationsEnabled: !state.preferences.notificationsEnabled
      }
    })),
  toggleEveningMode: () =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        eveningModeEnabled: !state.preferences.eveningModeEnabled
      }
    }))
}));
