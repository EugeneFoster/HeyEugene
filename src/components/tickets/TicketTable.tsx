"use client";

import type { Ticket } from "@/lib/types";
import {
  formatCurrency,
  formatRelative,
  ticketTypeEmoji,
  ticketTypeLabel,
} from "@/lib/utils/format";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import { IconPlayerPlay } from "@tabler/icons-react";

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--text-secondary)]">
        No tickets found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase text-[var(--text-secondary)]">
          <tr>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">AI Est.</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="border-b border-gray-50 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <ProjectBadge tenant={ticket.tenant} />
              </td>
              <td className="px-4 py-3">
                <span>
                  {ticketTypeEmoji(ticket.type)} {ticketTypeLabel(ticket.type)}
                </span>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {ticket.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {ticket.priority ?? "—"}
              </td>
              <td className="px-4 py-3 font-mono text-xs">
                {ticket.ai_estimate_min != null && ticket.ai_estimate_max != null
                  ? `${formatCurrency(ticket.ai_estimate_min)}–${formatCurrency(ticket.ai_estimate_max)}`
                  : "—"}
              </td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {formatRelative(ticket.created_at)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/tickets/${ticket.id}?action=timer`}
                  className="text-gray-400 hover:text-blue-600"
                  title="Start timer"
                >
                  <IconPlayerPlay size={16} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
