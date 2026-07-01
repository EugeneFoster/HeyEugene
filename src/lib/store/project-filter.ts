"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectFilterState {
  tenantId: string | null;
  tenantName: string | null;
  tenantEmoji: string | null;
  tenantColor: string | null;
  setProject: (
    id: string,
    name: string,
    emoji: string,
    color: string
  ) => void;
  clearProject: () => void;
}

export const useProjectFilter = create<ProjectFilterState>()(
  persist(
    (set) => ({
      tenantId: null,
      tenantName: null,
      tenantEmoji: null,
      tenantColor: null,
      setProject: (id, name, emoji, color) =>
        set({
          tenantId: id,
          tenantName: name,
          tenantEmoji: emoji,
          tenantColor: color,
        }),
      clearProject: () =>
        set({
          tenantId: null,
          tenantName: null,
          tenantEmoji: null,
          tenantColor: null,
        }),
    }),
    { name: "heyeugene-project-filter" }
  )
);
