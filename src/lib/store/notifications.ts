"use client";

import { create } from "zustand";

interface NotificationCounts {
  newTickets: number;
  unpaidInvoices: number;
  setNewTickets: (count: number) => void;
  setUnpaidInvoices: (count: number) => void;
}

export const useNotificationStore = create<NotificationCounts>((set) => ({
  newTickets: 0,
  unpaidInvoices: 0,
  setNewTickets: (count) => set({ newTickets: count }),
  setUnpaidInvoices: (count) => set({ unpaidInvoices: count }),
}));
