import ReactMarkdown from "react-markdown";
import type { Proposal } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

interface ProposalPreviewProps {
  proposal: Pick<
    Proposal,
    | "problem_statement"
    | "proposed_solution"
    | "tasks_it_solves"
    | "expected_impact"
    | "estimated_hours_min"
    | "estimated_hours_max"
    | "estimated_cost_min"
    | "estimated_cost_max"
  >;
  title?: string;
  currency?: string;
}

export function ProposalPreview({
  proposal,
  title,
  currency = "CAD",
}: ProposalPreviewProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <p className="mb-2 text-sm font-medium text-purple-600">
        💡 Proposal from Eugene
      </p>
      {title && (
        <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      )}

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          The Problem
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {proposal.problem_statement}
        </p>
      </section>

      <section className="mb-6">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          What I Propose
        </h3>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{proposal.proposed_solution}</ReactMarkdown>
        </div>
      </section>

      {proposal.tasks_it_solves?.length > 0 && (
        <section className="mb-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            This Will Help With
          </h3>
          <ul className="space-y-1 text-sm">
            {proposal.tasks_it_solves.map((task, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                {task}
              </li>
            ))}
          </ul>
        </section>
      )}

      {proposal.expected_impact && (
        <section className="mb-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Expected Result
          </h3>
          <p className="text-sm">{proposal.expected_impact}</p>
        </section>
      )}

      {(proposal.estimated_hours_min != null ||
        proposal.estimated_cost_min != null) && (
        <section className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Estimated Cost
          </h3>
          <p className="font-mono text-lg font-semibold">
            {proposal.estimated_hours_min}–{proposal.estimated_hours_max} hours ·{" "}
            {formatCurrency(proposal.estimated_cost_min ?? 0, currency)}–
            {formatCurrency(proposal.estimated_cost_max ?? 0, currency)} {currency}
          </p>
        </section>
      )}

      <div className="flex gap-3 border-t border-gray-100 pt-6">
        <button
          type="button"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          ✅ Approve — start work
        </button>
        <button
          type="button"
          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          ❌ Decline
        </button>
      </div>
    </div>
  );
}
