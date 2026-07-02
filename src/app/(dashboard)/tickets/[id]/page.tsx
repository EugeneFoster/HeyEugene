import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { WorkflowPipeline } from "@/components/shared/WorkflowPipeline";
import { TicketEstimatePanel } from "@/components/tickets/TicketEstimatePanel";
import { TicketActionBar } from "@/components/tickets/TicketActionBar";
import { TimerControls } from "@/components/time/TimerControls";
import { getTicket, getTimeEntries } from "@/lib/queries";
import { getWorkflowSteps } from "@/lib/support/workflow";
import {
  formatDurationLong,
  formatRelative,
  ticketTypeEmoji,
  ticketTypeLabel,
} from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

function hasEstimate(ticket: {
  estimated_cost_min: number | null;
  estimated_hours_min: number | null;
}) {
  return (
    ticket.estimated_cost_min != null &&
    ticket.estimated_hours_min != null
  );
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
  const workflowSteps = getWorkflowSteps(ticket);
  const estimated = hasEstimate(ticket);

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
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
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
                {ticket.created_by && ` · ${ticket.created_by}`}
              </p>
            </div>
            <StatusBadge status={ticket.status} />
          </div>

          <TicketEstimatePanel ticket={ticket} />

          <TicketActionBar
            ticketId={ticket.id}
            status={ticket.status}
            hasEstimate={estimated}
          />

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <TimerControls
              tenantId={ticket.tenant_id}
              tenantName={ticket.tenant?.name ?? ""}
              tenantEmoji={ticket.tenant?.emoji ?? "🏢"}
              ticketId={ticket.id}
              ticketTitle={ticket.title}
            />
            <span className="text-sm text-[var(--text-secondary)]">
              Time logged:{" "}
              <span className="font-mono font-medium text-[var(--text-primary)]">
                {formatDurationLong(totalSeconds)}
              </span>
            </span>
          </div>

          <div className="mb-6 rounded-lg border border-gray-100 bg-gray-50/80 p-4">
            <WorkflowPipeline steps={workflowSteps} compact />
          </div>

          {ticket.description ? (
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                Description
              </p>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {ticket.description}
              </div>
            </div>
          ) : null}

          {entries.length > 0 ? (
            <div className="mt-6">
              <h3 className="mb-2 text-sm font-semibold">Time entries</h3>
              <ul className="space-y-2 text-sm">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="flex justify-between text-[var(--text-secondary)]"
                  >
                    <span>{formatRelative(e.started_at)}</span>
                    <span className="font-mono">
                      {formatDurationLong(e.duration_seconds ?? 0)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
