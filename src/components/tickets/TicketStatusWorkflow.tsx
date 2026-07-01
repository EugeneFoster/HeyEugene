"use client";

import { useRouter } from "next/navigation";
import type { TicketStatus } from "@/lib/types";

const WORKFLOW: Partial<
  Record<TicketStatus, { label: string; next: TicketStatus }>
> = {
  new: { label: "Start Review", next: "in_review" },
  in_review: { label: "Begin Work", next: "in_progress" },
  in_progress: { label: "Mark Done", next: "done" },
};

interface TicketStatusWorkflowProps {
  ticketId: string;
  status: TicketStatus;
}

export function TicketStatusWorkflow({
  ticketId,
  status,
}: TicketStatusWorkflowProps) {
  const router = useRouter();
  const step = WORKFLOW[status];

  async function updateStatus(next: TicketStatus) {
    await fetch(`/api/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  if (status === "done") {
    return (
      <a
        href={`/invoices/new?ticket=${ticketId}`}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Create Invoice
      </a>
    );
  }

  if (!step) return null;

  return (
    <button
      type="button"
      onClick={() => updateStatus(step.next)}
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      {step.label}
    </button>
  );
}
