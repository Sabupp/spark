import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { useAuthStore } from "@/store/useAuthStore";
import { theme } from "@/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const notificationsEnabled = useAuthStore(
    (state) => state.preferences.notificationsEnabled
  );
  const eveningModeEnabled = useAuthStore(
    (state) => state.preferences.eveningModeEnabled
  );
  const toggleNotifications = useAuthStore(
    (state) => state.toggleNotifications
  );
  const toggleEveningMode = useAuthStore((state) => state.toggleEveningMode);
  const signOut = useAuthStore((state) => state.signOut);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.heroCard}>
          <Text style={styles.title}>{user?.name ?? "Spark User"}</Text>
          <Text style={styles.subtitle}>{user?.email ?? "mock@spark.app"}</Text>
        </View>
      </FadeInView>

      <FadeInView delay={120}>
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Push reminders</Text>
              <Text style={styles.settingCopy}>Gentle prompts for daily rituals.</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent
              }}
              thumbColor={theme.colors.textPrimary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Evening mode</Text>
              <Text style={styles.settingCopy}>A softer mood after 8 PM.</Text>
            </View>
            <Switch
              value={eveningModeEnabled}
              onValueChange={toggleEveningMode}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent
              }}
              thumbColor={theme.colors.textPrimary}
            />
          </View>
        </View>
      </FadeInView>

      <FadeInView delay={200}>
        <InteractiveCard style={styles.outlineButton} onPress={handleSignOut}>
          <Text style={styles.outlineButtonText}>Logout</Text>
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
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 16
  },
  settingsCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 22,
    letterSpacing: -0.2
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
    fontSize: 16,
    letterSpacing: 0.1
  },
  settingCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 20
  },
  outlineButton: {
    alignItems: "center",
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.md
  },
  outlineButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.semibold,
    fontSize: 16,
    letterSpacing: 0.2
  }
});
