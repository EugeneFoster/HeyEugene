"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
export function setupRealtimeSubscriptions(
  onTicketInsert?: () => void,
  onInvoicePaid?: () => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel("developer-feed")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "support_tickets" },
      (payload) => {
        const ticket = payload.new as { title?: string; tenant_id?: string };
        toast.info(`New ticket: ${ticket.title ?? "Untitled"}`);
        onTicketInsert?.();
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "support_invoices",
        filter: "status=eq.paid",
      },
      (payload) => {
        const invoice = payload.new as { invoice_number?: string };
        toast.success(`Invoice ${invoice.invoice_number ?? ""} paid! 🎉`);
        onInvoicePaid?.();
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "support_messages" },
      () => {
        toast.info("New message on a ticket");
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
