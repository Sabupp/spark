import { create } from "zustand";

import { supabase } from "@/lib/supabase";
import { AuthPreferences, AuthState, User } from "@/types";

const defaultPreferences: AuthPreferences = {
  notificationsEnabled: true,
  eveningModeEnabled: true
};

const initialUser: User | null = null;

type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
  onboarding_completed: boolean | null;
};

async function upsertProfile(user: User, onboardingCompleted = false) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      onboarding_completed: onboardingCompleted
    },
    {
      onConflict: "id"
    }
  );

  if (error) {
    throw error;
  }
}

async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, onboarding_completed")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw error;
  }

  return data;
}

function mapUser(
  authUser: { id: string; email?: string | null; user_metadata?: { name?: string | null } },
  profile: ProfileRow | null
): User {
  return {
    id: authUser.id,
    email: profile?.email ?? authUser.email ?? "",
    name: profile?.name ?? authUser.user_metadata?.name ?? "Spark User"
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: false,
  isLoading: false,
  hasCheckedSession: false,
  onboardingCompleted: false,
  preferences: defaultPreferences,
  signUp: async (email: string, password: string, name: string) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    });

    if (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.message
      };
    }

    const authUser = data.user;

    if (!authUser) {
      set({ isLoading: false });
      return {
        success: false,
        error: "Account could not be created."
      };
    }

    const user = mapUser(
      {
        id: authUser.id,
        email: authUser.email,
        user_metadata: { name }
      },
      null
    );

    try {
      await upsertProfile(user, false);
    } catch (profileError) {
      set({ isLoading: false });
      return {
        success: false,
        error:
          profileError instanceof Error
            ? profileError.message
            : "Profile could not be created."
      };
    }

    set({
      user,
      isAuthenticated: true,
      onboardingCompleted: false,
      isLoading: false,
      hasCheckedSession: true
    });

    return {
      success: true
    };
  },
  signIn: async (email: string, password: string) => {
    set({ isLoading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error.message
      };
    }

    const authUser = data.user;

    if (!authUser) {
      set({ isLoading: false });
      return {
        success: false,
        error: "No user session returned."
      };
    }

    try {
      const profile = await fetchProfile(authUser.id);
      const user = mapUser(authUser, profile);

      if (!profile) {
        await upsertProfile(user, false);
      }

      set({
        user,
        isAuthenticated: true,
        onboardingCompleted: profile?.onboarding_completed ?? false,
        isLoading: false,
        hasCheckedSession: true
      });

      return {
        success: true
      };
    } catch (profileError) {
      set({ isLoading: false });
      return {
        success: false,
        error:
          profileError instanceof Error
            ? profileError.message
            : "Could not load your profile."
      };
    }
  },
  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({
      user: null,
      isAuthenticated: false,
      onboardingCompleted: false,
      isLoading: false,
      hasCheckedSession: true
    });
  },
  getSession: async () => {
    set({ isLoading: true });

    const {
      data: { session },
      error
    } = await supabase.auth.getSession();

    if (error || !session?.user) {
      set({
        user: null,
        isAuthenticated: false,
        onboardingCompleted: false,
        isLoading: false,
        hasCheckedSession: true
      });
      return;
    }

    try {
      const profile = await fetchProfile(session.user.id);
      const user = mapUser(session.user, profile);

      if (!profile) {
        await upsertProfile(user, false);
      }

      set({
        user,
        isAuthenticated: true,
        onboardingCompleted: profile?.onboarding_completed ?? false,
        isLoading: false,
        hasCheckedSession: true
      });
    } catch {
      set({
        user: {
          id: session.user.id,
          email: session.user.email ?? "",
          name: session.user.user_metadata?.name ?? "Spark User"
        },
        isAuthenticated: true,
        onboardingCompleted: false,
        isLoading: false,
        hasCheckedSession: true
      });
    }
  },
  completeOnboarding: async () => {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
      return {
        success: false,
        error: "No authenticated user found."
      };
    }

    set({ isLoading: true });

    try {
      await upsertProfile(currentUser, true);
      set({
        onboardingCompleted: true,
        isLoading: false
      });

      return {
        success: true
      };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Could not save onboarding."
      };
    }
  },
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
