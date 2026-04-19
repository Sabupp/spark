import { useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useNotificationStore } from "@/store/useNotificationStore";
import { theme } from "@/theme";

export default function NotificationSettingsScreen() {
  const {
    hasPermission,
    dailyReminderEnabled,
    partnerActivityEnabled,
    streakRemindersEnabled,
    initializeNotifications,
    scheduleDailyReminder,
    cancelDailyReminder,
    updateSettings,
    sendTestNotification
  } = useNotificationStore();
  const [timeLabel, setTimeLabel] = useState("20:00");

  useEffect(() => {
    void initializeNotifications();
  }, [initializeNotifications]);

  const toggleDaily = async (value: boolean) => {
    if (value) {
      await scheduleDailyReminder({ hour: 20, minute: 0 });
      setTimeLabel("20:00");
      return;
    }

    await cancelDailyReminder();
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Keep your rituals alive with reminders, streak nudges and partner updates.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={100}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Permission</Text>
          <Text style={styles.statusText}>
            {hasPermission ? "Granted" : "Not granted"}
          </Text>
          {!hasPermission ? (
            <InteractiveCard
              style={styles.secondaryButton}
              onPress={() => {
                void initializeNotifications();
              }}
            >
              <Text style={styles.secondaryButtonText}>Enable notifications</Text>
            </InteractiveCard>
          ) : null}
          {!hasPermission ? (
            <InteractiveCard
              style={styles.outlineButton}
              onPress={() => {
                void Linking.openSettings();
              }}
            >
              <Text style={styles.outlineButtonText}>Open system settings</Text>
            </InteractiveCard>
          ) : null}
        </View>
      </FadeInView>

      <FadeInView delay={140}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Daily reminders</Text>
              <Text style={styles.settingCopy}>Scheduled for {timeLabel} by default.</Text>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={(value) => {
                void toggleDaily(value);
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.textPrimary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Partner activity</Text>
              <Text style={styles.settingCopy}>
                Alerts when your partner completes today's challenge.
              </Text>
            </View>
            <Switch
              value={partnerActivityEnabled}
              onValueChange={(value) => {
                void updateSettings({ partnerActivityEnabled: value });
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.textPrimary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Streak reminders</Text>
              <Text style={styles.settingCopy}>
                Nudge me before my couple streak slips.
              </Text>
            </View>
            <Switch
              value={streakRemindersEnabled}
              onValueChange={(value) => {
                void updateSettings({ streakRemindersEnabled: value });
              }}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.textPrimary}
            />
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={180}>
        <InteractiveCard
          style={styles.primaryButton}
          onPress={() => {
            void sendTestNotification();
          }}
        >
          <Text style={styles.primaryButtonText}>Send Test Notification</Text>
        </InteractiveCard>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.md
  },
  header: {
    gap: theme.spacing.xs
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 34
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 22
  },
  statusText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15
  },
  settingRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  settingText: {
    flex: 1,
    gap: 4,
    paddingRight: theme.spacing.md
  },
  settingTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.medium,
    fontSize: 16
  },
  settingCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 20
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 16
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.sm
  },
  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 15
  },
  outlineButton: {
    alignItems: "center",
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  outlineButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 15
  }
});
