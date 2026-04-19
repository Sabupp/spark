import { create } from "zustand";
import * as Notifications from "expo-notifications";

import {
  cancelAllNotifications,
  cancelNotification,
  getPushToken,
  registerPushToken,
  requestPermissions,
  scheduleNotification
} from "@/lib/notifications";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

type NotificationSettings = {
  dailyReminderEnabled?: boolean;
  partnerActivityEnabled?: boolean;
  streakRemindersEnabled?: boolean;
};

type NotificationStore = {
  hasPermission: boolean;
  pushToken: string | null;
  dailyReminderEnabled: boolean;
  partnerActivityEnabled: boolean;
  streakRemindersEnabled: boolean;
  scheduledDailyReminderId: string | null;
  isLoading: boolean;
  initializeNotifications: () => Promise<void>;
  scheduleDailyReminder: (time?: { hour: number; minute: number }) => Promise<void>;
  cancelDailyReminder: () => Promise<void>;
  scheduleStreakReminder: () => Promise<void>;
  updateSettings: (settings: NotificationSettings) => Promise<void>;
  sendTestNotification: () => Promise<void>;
};

async function persistNotificationSettings(settings: NotificationSettings) {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) {
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      notification_settings: settings
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  hasPermission: false,
  pushToken: null,
  dailyReminderEnabled: false,
  partnerActivityEnabled: true,
  streakRemindersEnabled: true,
  scheduledDailyReminderId: null,
  isLoading: false,
  initializeNotifications: async () => {
    const user = useAuthStore.getState().user;
    if (!user) {
      return;
    }

    set({ isLoading: true });
    const granted = await requestPermissions();
    if (!granted) {
      set({ hasPermission: false, isLoading: false });
      return;
    }

    const token = await getPushToken();

    if (token) {
      await registerPushToken(user.id, token, {
        dailyReminderEnabled: get().dailyReminderEnabled,
        partnerActivityEnabled: get().partnerActivityEnabled,
        streakRemindersEnabled: get().streakRemindersEnabled
      });
    }

    set({
      hasPermission: true,
      pushToken: token,
      isLoading: false
    });
  },
  scheduleDailyReminder: async (time = { hour: 20, minute: 0 }) => {
    if (!get().hasPermission) {
      return;
    }

    if (get().scheduledDailyReminderId) {
      await cancelNotification(get().scheduledDailyReminderId as string);
    }

    const id = await scheduleNotification({
      title: "Your daily spark is ready",
      body: "Take a few minutes tonight to keep your couple streak glowing.",
      data: {
        url: "/(app)"
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.hour,
        minute: time.minute
      }
    });

    set({
      dailyReminderEnabled: true,
      scheduledDailyReminderId: id
    });

    await persistNotificationSettings({
      dailyReminderEnabled: true,
      partnerActivityEnabled: get().partnerActivityEnabled,
      streakRemindersEnabled: get().streakRemindersEnabled
    });
  },
  cancelDailyReminder: async () => {
    const currentId = get().scheduledDailyReminderId;
    if (currentId) {
      await cancelNotification(currentId);
    }

    set({
      dailyReminderEnabled: false,
      scheduledDailyReminderId: null
    });

    await persistNotificationSettings({
      dailyReminderEnabled: false,
      partnerActivityEnabled: get().partnerActivityEnabled,
      streakRemindersEnabled: get().streakRemindersEnabled
    });
  },
  scheduleStreakReminder: async () => {
    if (!get().hasPermission || !get().streakRemindersEnabled) {
      return;
    }

    await scheduleNotification({
      title: "Protect your streak",
      body: "You are one ritual away from keeping your streak alive tonight.",
      data: {
        url: "/(app)"
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60 * 60 * 2
      }
    });
  },
  updateSettings: async (settings: NotificationSettings) => {
    set((state) => ({
      dailyReminderEnabled:
        settings.dailyReminderEnabled ?? state.dailyReminderEnabled,
      partnerActivityEnabled:
        settings.partnerActivityEnabled ?? state.partnerActivityEnabled,
      streakRemindersEnabled:
        settings.streakRemindersEnabled ?? state.streakRemindersEnabled
    }));

    await persistNotificationSettings({
      dailyReminderEnabled: get().dailyReminderEnabled,
      partnerActivityEnabled: get().partnerActivityEnabled,
      streakRemindersEnabled: get().streakRemindersEnabled
    });
  },
  sendTestNotification: async () => {
    if (!get().hasPermission) {
      return;
    }

    await scheduleNotification({
      title: "Spark test notification",
      body: "Notifications are working beautifully on this device.",
      data: {
        url: "/(app)"
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1
      }
    });
  }
}));
