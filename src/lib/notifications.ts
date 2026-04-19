import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

import { supabase } from "@/lib/supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export type NotificationScheduleOptions = {
  title: string;
  body: string;
  data?: Record<string, string>;
  trigger:
    | Notifications.NotificationTriggerInput
    | null;
};

function getProjectId() {
  return (
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    undefined
  );
}

export async function requestPermissions() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true
    }
  });

  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function getPushToken() {
  if (!Device.isDevice) {
    return null;
  }

  const projectId = getProjectId();
  const token = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );

  return token.data;
}

export async function registerPushToken(
  userId: string,
  token: string,
  notificationSettings?: Record<string, unknown>
) {
  const updatePayload: Record<string, unknown> = {
    push_token: token
  };

  if (notificationSettings) {
    updatePayload.notification_settings = notificationSettings;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function scheduleNotification(options: NotificationScheduleOptions) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: options.title,
      body: options.body,
      data: options.data
    },
    trigger: options.trigger
  });
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function sendPartnerActivityNotificationSkeleton(params: {
  actorName: string;
  challengeTitle: string;
  partnerId: string;
}) {
  console.info("TODO send partner activity push via Edge Function", {
    partnerId: params.partnerId,
    message: `${params.actorName} completed today's challenge! 🔥`,
    challengeTitle: params.challengeTitle
  });
}
