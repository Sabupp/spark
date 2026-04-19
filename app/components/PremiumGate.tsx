import { Modal, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { InteractiveCard } from "@/components/InteractiveCard";
import { theme } from "@/theme";

type PremiumGateProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

const premiumBenefits = [
  "Unlimited daily challenges",
  "All six challenge categories unlocked",
  "Partner sync and shared progress",
  "Detailed analytics and deeper insights"
];

export function PremiumGate({
  visible,
  onClose,
  title = "Upgrade to Premium",
  message = "This feature is part of Spark Premium."
}: PremiumGateProps) {
  const router = useRouter();

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.benefits}>
            {premiumBenefits.map((benefit) => (
              <Text key={benefit} style={styles.benefit}>
                • {benefit}
              </Text>
            ))}
          </View>

          <InteractiveCard
            style={styles.primaryButton}
            onPress={() => {
              onClose();
              router.push("/(app)/paywall");
            }}
          >
            <Text style={styles.primaryButtonText}>Upgrade to Premium</Text>
          </InteractiveCard>

          <InteractiveCard style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Maybe later</Text>
          </InteractiveCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    padding: theme.spacing.md
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
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28
  },
  message: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  benefits: {
    gap: 6
  },
  benefit: {
    color: theme.colors.textPrimary,
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
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  secondaryButtonText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 15
  }
});
