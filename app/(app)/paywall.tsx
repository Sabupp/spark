import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { FadeInView } from "@/components/FadeInView";
import { InteractiveCard } from "@/components/InteractiveCard";
import { usePremiumStore } from "@/store/usePremiumStore";
import { theme } from "@/theme";

const benefits = [
  "Unlimited challenges every day",
  "Access to spicy, hot, extreme and date night categories",
  "Partner sync and premium couple features",
  "Detailed analytics and richer progress tracking"
];

export default function PaywallScreen() {
  const router = useRouter();
  const {
    isPremium,
    subscriptionStatus,
    expiryDate,
    offerings,
    isLoading,
    purchasePremium,
    restorePurchases
  } = usePremiumStore();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const packageLabel = useMemo(() => {
    const packages = offerings?.current?.availablePackages ?? [];
    const match = packages.find((item) => {
      const identifier = item.identifier.toLowerCase();
      return billingCycle === "monthly"
        ? identifier.includes("month")
        : identifier.includes("year") || identifier.includes("annual");
    });

    return match?.product.priceString ?? (billingCycle === "monthly" ? "Monthly" : "Yearly");
  }, [billingCycle, offerings]);

  const handlePurchase = async () => {
    setErrorMessage(null);
    const result = await purchasePremium(billingCycle);
    if (!result.success) {
      setErrorMessage(result.error ?? "Purchase failed.");
      return;
    }

    router.back();
  };

  const handleRestore = async () => {
    setErrorMessage(null);
    const result = await restorePurchases();
    if (!result.success) {
      setErrorMessage(result.error ?? "Restore failed.");
      return;
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <FadeInView delay={40}>
        <View style={styles.header}>
          <Text style={styles.title}>Spark Premium</Text>
          <Text style={styles.subtitle}>
            Unlock the full private playground for you and your partner.
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={100}>
        <View style={styles.toggleRow}>
          <InteractiveCard
            style={[styles.toggleButton, billingCycle === "monthly" && styles.toggleActive]}
            onPress={() => setBillingCycle("monthly")}
          >
            <Text style={[styles.toggleText, billingCycle === "monthly" && styles.toggleTextActive]}>
              Monthly
            </Text>
          </InteractiveCard>
          <InteractiveCard
            style={[styles.toggleButton, billingCycle === "yearly" && styles.toggleActive]}
            onPress={() => setBillingCycle("yearly")}
          >
            <Text style={[styles.toggleText, billingCycle === "yearly" && styles.toggleTextActive]}>
              Yearly
            </Text>
          </InteractiveCard>
        </View>
      </FadeInView>

      <FadeInView delay={140}>
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>{packageLabel}</Text>
          <Text style={styles.priceCopy}>
            {isPremium
              ? `Active subscription${expiryDate ? ` until ${new Date(expiryDate).toLocaleDateString("en-US")}` : ""}.`
              : "Choose the plan that fits your rhythm and unlock everything."}
          </Text>
        </View>
      </FadeInView>

      <FadeInView delay={180}>
        <View style={styles.benefitsCard}>
          <Text style={styles.sectionTitle}>Premium benefits</Text>
          {benefits.map((benefit) => (
            <Text key={benefit} style={styles.benefit}>
              • {benefit}
            </Text>
          ))}
        </View>
      </FadeInView>

      {errorMessage ? (
        <FadeInView delay={220}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </FadeInView>
      ) : null}

      <FadeInView delay={240}>
        <InteractiveCard style={styles.primaryButton} onPress={() => void handlePurchase()}>
          {isLoading ? (
            <ActivityIndicator color={theme.colors.textPrimary} />
          ) : (
            <Text style={styles.primaryButtonText}>
              {subscriptionStatus === "premium" ? "Premium active" : "Purchase Premium"}
            </Text>
          )}
        </InteractiveCard>
      </FadeInView>

      <FadeInView delay={280}>
        <InteractiveCard style={styles.secondaryButton} onPress={() => void handleRestore()}>
          <Text style={styles.secondaryButtonText}>Restore Purchases</Text>
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
  toggleRow: {
    flexDirection: "row",
    gap: theme.spacing.xs
  },
  toggleButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingVertical: theme.spacing.sm
  },
  toggleActive: {
    backgroundColor: theme.colors.accent
  },
  toggleText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.medium,
    fontSize: 15
  },
  toggleTextActive: {
    color: theme.colors.textPrimary
  },
  priceCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  priceTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bold,
    fontSize: 28
  },
  priceCopy: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22
  },
  benefitsCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    ...theme.shadows.card
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.semibold,
    fontSize: 22
  },
  benefit: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
    lineHeight: 21
  },
  errorText: {
    color: theme.colors.accentLight,
    fontFamily: theme.typography.body,
    fontSize: 14
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
