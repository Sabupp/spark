import { create } from "zustand";

import { PartnerState } from "@/types";

export const usePartnerStore = create<PartnerState>((set) => ({
  connectionStatus: "Pending",
  pendingInviteCode: "SPARK-7281",
  partner: {
    id: "partner-1",
    name: "Jamie",
    connectedSince: "March 2026"
  },
  toggleConnection: () =>
    set((state) => ({
      connectionStatus:
        state.connectionStatus === "Connected" ? "Pending" : "Connected"
    }))
}));
