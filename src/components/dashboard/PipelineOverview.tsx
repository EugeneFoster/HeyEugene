import Link from "next/link";
import type { PipelineCounts } from "@/lib/support/workflow";

const STAGES: {
  key: keyof PipelineCounts;
  label: string;
  href: string;
  color: string;
}[] = [
  { key: "new", label: "New", href: "/tickets?status=new", color: "bg-red-500" },
  {
    key: "inReview",
    label: "In review",
    href: "/tickets?status=in_review",
    color: "bg-amber-500",
  },
  {
    key: "pendingApproval",
    label: "Awaiting client",
    href: "/tickets?status=pending_approval",
    color: "bg-orange-500",
  },
  {
    key: "inProgress",
    label: "In progress",
    href: "/tickets?status=in_progress",
    color: "bg-blue-500",
  },
  {
    key: "readyToInvoice",
    label: "To invoice",
    href: "/tickets?status=done",
    color: "bg-green-500",
  },
  {
    key: "awaitingPayment",
    label: "Awaiting pay",
    href: "/invoices?status=sent",
    color: "bg-violet-500",
  },
];

interface PipelineOverviewProps {
  counts: PipelineCounts;
}

export function PipelineOverview({ counts }: PipelineOverviewProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Work pipeline
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            Requests flow in order — strategy before work, invoice after delivery.
          </p>
        </div>
        <span className="text-sm font-medium text-gray-600">{total} active</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage) => {
          const n = counts[stage.key];
          return (
            <Link
              key={stage.key}
              href={stage.href}
              className={`rounded-lg border px-3 py-2 transition hover:border-gray-300 ${
                n > 0 ? "border-gray-200 bg-gray-50" : "border-transparent opacity-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                <span className="text-xs text-gray-500">{stage.label}</span>
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums">{n}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
