import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOfferings,
  PurchasesPackage
} from "react-native-purchases";

const REVENUECAT_API_KEY = "test_LFtAqNngCkiizihWgGbwLqWDrbQ";
const PREMIUM_ENTITLEMENT_ID = "premium";

let isConfigured = false;

export async function initializeRevenueCat(userId: string) {
  if (Platform.OS === "web") {
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.INFO);

  if (!isConfigured) {
    Purchases.configure({
      apiKey: REVENUECAT_API_KEY,
      appUserID: userId
    });
    isConfigured = true;
    return;
  }

  await Purchases.logIn(userId);
}

export function getPremiumEntitlementStatus(customerInfo: CustomerInfo) {
  return typeof customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID] !== "undefined";
}

export async function fetchCustomerInfo() {
  if (Platform.OS === "web") {
    return null;
  }

  return Purchases.getCustomerInfo();
}

export async function fetchOfferings(): Promise<PurchasesOfferings | null> {
  if (Platform.OS === "web") {
    return null;
  }

  return Purchases.getOfferings();
}

export async function purchaseRevenueCatPackage(aPackage: PurchasesPackage) {
  return Purchases.purchasePackage(aPackage);
}

export async function restoreRevenueCatPurchases() {
  return Purchases.restorePurchases();
}

export { PREMIUM_ENTITLEMENT_ID };
