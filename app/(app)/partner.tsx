import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
      <View style={styles.header}>
        <Text style={styles.title}>Partner Space</Text>
        <Text style={styles.subtitle}>
          Everything here is mocked, but the connection flow is ready for Supabase later.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Connection Status</Text>
        <Text style={styles.mainValue}>{connectionStatus}</Text>
        <Text style={styles.copy}>
          {connectionStatus === "Connected"
            ? `Linked with ${partner?.name} since ${partner?.connectedSince}.`
            : "No live pairing yet. Invite your person with the mock code below."}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>Invite Code</Text>
        <Text style={styles.code}>{pendingInviteCode}</Text>
        <Text style={styles.copy}>
          Use this later as the basis for a real partner connect flow.
        </Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={toggleConnection}>
        <Text style={styles.primaryButtonText}>
          {connectionStatus === "Connected"
            ? "Mock disconnect"
            : "Mock connect partner"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg
  },
  header: {
    gap: theme.spacing.sm
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 30,
    fontWeight: "700"
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.sm,
    padding: theme.spacing.lg
  },
  eyebrow: {
    color: theme.colors.accentLight,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase"
  },
  mainValue: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "700"
  },
  copy: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22
  },
  code: {
    color: theme.colors.accent,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 4
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md
  },
  primaryButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  }
});
