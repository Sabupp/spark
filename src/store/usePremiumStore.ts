import { create } from "zustand";
import { CustomerInfo, PurchasesOfferings, PurchasesPackage } from "react-native-purchases";

import {
  fetchCustomerInfo,
  fetchOfferings,
  getPremiumEntitlementStatus,
  initializeRevenueCat,
  PREMIUM_ENTITLEMENT_ID,
  restoreRevenueCatPurchases,
  purchaseRevenueCatPackage
} from "@/lib/revenuecat";
import { useAuthStore } from "@/store/useAuthStore";
import { useChallengeStore } from "@/store/useChallengeStore";
import { ChallengeCategory } from "@/types";

type SubscriptionStatus = "free" | "premium" | "expired";

type PremiumStore = {
  isPremium: boolean;
  subscriptionStatus: SubscriptionStatus;
  expiryDate: string | null;
  remainingTrials: number;
  isLoading: boolean;
  offerings: PurchasesOfferings | null;
  customerInfo: CustomerInfo | null;
  initializePurchases: () => Promise<void>;
  purchasePremium: (billingCycle?: "monthly" | "yearly") => Promise<{ success: boolean; error?: string }>;
  restorePurchases: () => Promise<{ success: boolean; error?: string }>;
  checkPremiumStatus: () => Promise<void>;
  canAccessCategory: (category: ChallengeCategory) => boolean;
  canUseUnlimitedChallenges: () => boolean;
};

function getTodayCompletionCount() {
  const now = new Date();
  return useChallengeStore
    .getState()
    .completedChallenges.filter((entry) => {
      const completedDate = new Date(entry.completed_at);
      return (
        completedDate.getFullYear() === now.getFullYear() &&
        completedDate.getMonth() === now.getMonth() &&
        completedDate.getDate() === now.getDate()
      );
    }).length;
}

function findPackage(
  offerings: PurchasesOfferings | null,
  billingCycle: "monthly" | "yearly"
) {
  const packages = offerings?.current?.availablePackages ?? [];
  const packageMatch = packages.find((item) => {
    const identifier = item.identifier.toLowerCase();
    const productId = item.product.identifier.toLowerCase();

    if (billingCycle === "monthly") {
      return identifier.includes("month") || productId.includes("month");
    }

    return (
      identifier.includes("year") ||
      identifier.includes("annual") ||
      productId.includes("year") ||
      productId.includes("annual")
    );
  });

  return packageMatch ?? packages[0] ?? null;
}

function applyCustomerInfo(customerInfo: CustomerInfo | null) {
  const isPremium = customerInfo ? getPremiumEntitlementStatus(customerInfo) : false;
  const entitlement = customerInfo?.entitlements.active[PREMIUM_ENTITLEMENT_ID];
  const todayCount = getTodayCompletionCount();
  const subscriptionStatus: SubscriptionStatus = isPremium
    ? "premium"
    : customerInfo != null
      ? "expired"
      : "free";

  return {
    isPremium,
    customerInfo,
    subscriptionStatus,
    expiryDate: entitlement?.expirationDate ?? null,
    remainingTrials: isPremium ? 999 : Math.max(0, 3 - todayCount)
  };
}

export const usePremiumStore = create<PremiumStore>((set, get) => ({
  isPremium: false,
  subscriptionStatus: "free",
  expiryDate: null,
  remainingTrials: 3,
  isLoading: false,
  offerings: null,
  customerInfo: null,
  initializePurchases: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      return;
    }

    set({ isLoading: true });

    try {
      await initializeRevenueCat(userId);
      const [customerInfo, offerings] = await Promise.all([
        fetchCustomerInfo(),
        fetchOfferings()
      ]);

      set({
        offerings,
        isLoading: false,
        ...applyCustomerInfo(customerInfo)
      });
    } catch {
      set({ isLoading: false });
    }
  },
  purchasePremium: async (billingCycle = "monthly") => {
    const offerings = get().offerings ?? (await fetchOfferings());
    const targetPackage = findPackage(offerings, billingCycle);

    if (!targetPackage) {
      return {
        success: false,
        error: "No RevenueCat package is available for purchase yet."
      };
    }

    set({ isLoading: true, offerings });

    try {
      const result = await purchaseRevenueCatPackage(targetPackage as PurchasesPackage);
      set({
        isLoading: false,
        ...applyCustomerInfo(result.customerInfo)
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Purchase failed."
      };
    }
  },
  restorePurchases: async () => {
    set({ isLoading: true });

    try {
      const customerInfo = await restoreRevenueCatPurchases();
      set({
        isLoading: false,
        ...applyCustomerInfo(customerInfo)
      });

      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return {
        success: false,
        error: error instanceof Error ? error.message : "Restore failed."
      };
    }
  },
  checkPremiumStatus: async () => {
    const customerInfo = await fetchCustomerInfo();
    set(applyCustomerInfo(customerInfo));
  },
  canAccessCategory: (category: ChallengeCategory) => {
    if (get().isPremium) {
      return true;
    }

    return category === "start" || category === "communication";
  },
  canUseUnlimitedChallenges: () => get().isPremium
}));
