"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { TicketStatus } from "@/lib/types";
import { IconPlayerPlay, IconCheck } from "@tabler/icons-react";

const START_WORK_STATUSES: TicketStatus[] = ["new", "in_review", "approved"];

interface TicketActionBarProps {
  ticketId: string;
  status: TicketStatus;
  hasEstimate: boolean;
}

export function TicketActionBar({
  ticketId,
  status,
  hasEstimate,
}: TicketActionBarProps) {
  const router = useRouter();

  async function updateStatus(next: TicketStatus) {
    await fetch(`/api/tickets/${ticketId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  const canStartWork = START_WORK_STATUSES.includes(status);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      {canStartWork ? (
        <button
          type="button"
          disabled={!hasEstimate}
          onClick={() => updateStatus("in_progress")}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <IconPlayerPlay size={18} />
          Start work
        </button>
      ) : null}

      {status === "in_progress" ? (
        <button
          type="button"
          onClick={() => updateStatus("done")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <IconCheck size={18} />
          Mark done
        </button>
      ) : null}

      {status === "done" ? (
        <Link
          href={`/invoices/new?ticket=${ticketId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Create invoice
        </Link>
      ) : null}

      {canStartWork && !hasEstimate ? (
        <p className="text-sm text-amber-700">
          Set an estimate above before starting work.
        </p>
      ) : null}

      {canStartWork ? (
        <Link
          href={`/proposals/new?ticket=${ticketId}`}
          className="ml-auto text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          Need client approval? → Proposal
        </Link>
      ) : null}
    </div>
  );
}
