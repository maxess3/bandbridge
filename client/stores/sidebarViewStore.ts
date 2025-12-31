"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Band } from "@/types/Band";

interface SidebarViewStore {
  view: "user" | "band";
  activeBand: Band | null;
  setView: (view: "user" | "band") => void;
  setActiveBand: (band: Band | null) => void;
  reset: () => void;
}

export const useSidebarViewStore = create<SidebarViewStore>()(
  persist(
    (set) => ({
      view: "user",
      activeBand: null,
      setView: (view) => set({ view }),
      setActiveBand: (band) =>
        set({ activeBand: band, view: band ? "band" : "user" }),
      reset: () => set({ view: "user", activeBand: null }),
    }),
    {
      name: "sidebar-view-storage",
    }
  )
);
