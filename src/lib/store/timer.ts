"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActiveTimer {
  entryId: string;
  tenantId: string;
  tenantName: string;
  tenantEmoji: string;
  ticketId: string | null;
  ticketTitle: string | null;
  startedAt: string;
  description: string | null;
}

interface TimerState {
  activeTimer: ActiveTimer | null;
  setActiveTimer: (timer: ActiveTimer) => void;
  clearActiveTimer: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set) => ({
      activeTimer: null,
      setActiveTimer: (timer) => set({ activeTimer: timer }),
      clearActiveTimer: () => set({ activeTimer: null }),
    }),
    { name: "heyeugene-timer" }
  )
);
