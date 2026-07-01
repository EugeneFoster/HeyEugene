"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectFilterState {
  tenantId: string | null;
  tenantName: string | null;
  tenantEmoji: string | null;
  setProject: (id: string, name: string, emoji: string) => void;
  clearProject: () => void;
}

export const useProjectFilter = create<ProjectFilterState>()(
  persist(
    (set) => ({
      tenantId: null,
      tenantName: null,
      tenantEmoji: null,
      setProject: (id, name, emoji) =>
        set({ tenantId: id, tenantName: name, tenantEmoji: emoji }),
      clearProject: () =>
        set({ tenantId: null, tenantName: null, tenantEmoji: null }),
    }),
    { name: "heyeugene-project-filter" }
  )
);
