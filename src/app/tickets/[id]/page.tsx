import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TicketStatusWorkflow } from "@/components/tickets/TicketStatusWorkflow";
import { TimerControls } from "@/components/time/TimerControls";
import { getTicket, getTimeEntries } from "@/lib/queries";
import {
  formatCurrency,
  formatDurationLong,
  formatRelative,
  ticketTypeEmoji,
  ticketTypeLabel,
} from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) notFound();

  const allEntries = await getTimeEntries(ticket.tenant_id);
  const entries = allEntries.filter((e) => e.ticket_id === id);
  const totalSeconds = entries.reduce(
    (sum, e) => sum + (e.duration_seconds ?? 0),
    0
  );

  return (
    <>
      <TopBar title="Ticket Detail" />
      <div className="p-6">
        <Link
          href="/tickets"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to tickets
        </Link>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ProjectBadge tenant={ticket.tenant} size="md" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {ticketTypeEmoji(ticket.type)} {ticketTypeLabel(ticket.type)}
                </span>
              </div>
              <h1 className="text-2xl font-semibold">{ticket.title}</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Created {formatRelative(ticket.created_at)}
                {ticket.created_by && ` by ${ticket.created_by}`}
              </p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          {ticket.description && (
            <div className="mb-6 whitespace-pre-wrap text-sm leading-relaxed">
              {ticket.description}
            </div>
          )}

          <div className="mb-6 flex flex-wrap gap-3">
            <TicketStatusWorkflow ticketId={ticket.id} status={ticket.status} />
            <TimerControls
              tenantId={ticket.tenant_id}
              tenantName={ticket.tenant?.name ?? ""}
              tenantEmoji={ticket.tenant?.emoji ?? "🏢"}
              ticketId={ticket.id}
              ticketTitle={ticket.title}
            />
            <Link
              href={`/proposals/new?ticket=${ticket.id}`}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Create Proposal
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                AI Estimate
              </p>
              <p className="mt-1 font-mono text-lg">
                {ticket.ai_estimate_min != null
                  ? `${formatCurrency(ticket.ai_estimate_min)} – ${formatCurrency(ticket.ai_estimate_max ?? 0)}`
                  : "Not set"}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium uppercase text-[var(--text-secondary)]">
                Time Logged
              </p>
              <p className="mt-1 font-mono text-lg">
                {formatDurationLong(totalSeconds)}
              </p>
            </div>
          </div>

          {entries.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold">Time entries</h3>
              <ul className="space-y-2 text-sm">
                {entries.map((e) => (
                  <li key={e.id} className="flex justify-between text-[var(--text-secondary)]">
                    <span>{formatRelative(e.started_at)}</span>
                    <span className="font-mono">
                      {formatDurationLong(e.duration_seconds ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
