import { create } from "zustand";

import { CoupleState } from "@/types";

const ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function createCode() {
  return Array.from({ length: 6 }, () => {
    const index = Math.floor(Math.random() * ALPHANUMERIC.length);
    return ALPHANUMERIC[index];
  }).join("");
}

function futureExpiryDate() {
  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24);
  return expiry.toISOString();
}

function partnerFromCode(code: string) {
  const knownPartners: Record<string, { name: string; email: string }> = {
    SPARK1: { name: "Jamie", email: "jamie@spark.app" },
    LOVERS: { name: "Taylor", email: "taylor@spark.app" },
    HEART6: { name: "Jordan", email: "jordan@spark.app" }
  };

  const match = knownPartners[code];

  return {
    id: `partner-${code.toLowerCase()}`,
    name: match?.name ?? `Partner ${code.slice(0, 2)}`,
    email: match?.email ?? `${code.toLowerCase()}@spark.app`
  };
}

const initialCode = createCode();

export const useCoupleStore = create<CoupleState>((set, get) => ({
  coupleId: null,
  partner: null,
  inviteCode: initialCode,
  isConnected: false,
  pendingInvite: {
    from: "You",
    code: initialCode,
    expiresAt: futureExpiryDate()
  },
  connectedAt: null,
  sharedChallengesCompleted: 0,
  generateInviteCode: () => {
    const nextCode = createCode();

    set({
      inviteCode: nextCode,
      pendingInvite: {
        from: "You",
        code: nextCode,
        expiresAt: futureExpiryDate()
      }
    });

    return nextCode;
  },
  acceptInvite: (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized.length !== 6) {
      return false;
    }

    set({
      coupleId: `couple-${normalized.toLowerCase()}`,
      partner: partnerFromCode(normalized),
      isConnected: true,
      pendingInvite: null,
      connectedAt: new Date().toISOString(),
      sharedChallengesCompleted: 18
    });

    return true;
  },
  disconnectCouple: () => {
    const nextCode = createCode();

    set({
      coupleId: null,
      partner: null,
      inviteCode: nextCode,
      isConnected: false,
      pendingInvite: {
        from: "You",
        code: nextCode,
        expiresAt: futureExpiryDate()
      },
      connectedAt: null,
      sharedChallengesCompleted: 0
    });
  },
  getCoupleStatus: () => {
    const { isConnected, partner } = get();

    return {
      isConnected,
      label: isConnected ? "Connected" : "Waiting for connection",
      partnerName: partner?.name ?? null
    };
  }
}));
