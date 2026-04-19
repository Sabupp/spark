import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { usePartnerStore } from "@/store/usePartnerStore";
import { theme } from "@/theme";

export default function PartnerScreen() {
  const partner = usePartnerStore((state) => state.partner);
  const connectionStatus = usePartnerStore((state) => state.connectionStatus);
  const pendingInviteCode = usePartnerStore((state) => state.pendingInviteCode);
  const toggleConnection = usePartnerStore((state) => state.toggleConnection);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.header}>
          <Text style={styles.title}>Partner Space</Text>
          <Text style={styles.subtitle}>
            Everything here is mocked, but the connection flow is ready for Supabase later.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={120}>
        <LinearGradient
          colors={["rgba(230,57,70,0.14)", "#1A1A1A", "#141414"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.eyebrow}>Connection Status</Text>
          <Text style={styles.mainValue}>{connectionStatus}</Text>
          <Text style={styles.copy}>
            {connectionStatus === "Connected"
              ? `Linked with ${partner?.name} since ${partner?.connectedSince}.`
              : "No live pairing yet. Invite your person with the mock code below."}
          </Text>
        </LinearGradient>
      </FadeInView>

      <FadeInView delay={200}>
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Invite Code</Text>
          <Text style={styles.code}>{pendingInviteCode}</Text>
          <Text style={styles.copy}>
            Use this later as the basis for a real partner connect flow.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={280}>
        <InteractiveCard style={styles.primaryButton} onPress={toggleConnection}>
          <Text style={styles.primaryButtonText}>
            {connectionStatus === "Connected"
              ? "Mock disconnect"
              : "Mock connect partner"}
          </Text>
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
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 30
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
  eyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontFamily: theme.typography.semibold,
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  mainValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28,
    letterSpacing: -0.3
  },
  copy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  code: {
    color: theme.colors.accent,
    fontFamily: theme.typography.bold,
    fontSize: 26,
    letterSpacing: 4
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
    fontSize: 16,
    letterSpacing: 0.2
  }
});
