import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import { getProposals } from "@/lib/queries";
import { formatCurrency, formatRelative } from "@/lib/utils/format";

export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <>
      <TopBar title="Proposals" />
      <div className="p-6">
        <div className="mb-4 flex justify-end">
          <Link
            href="/proposals/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Proposal
          </Link>
        </div>

        {proposals.length === 0 ? (
          <p className="py-12 text-center text-[var(--text-secondary)]">
            No proposals yet.{" "}
            <Link href="/proposals/new" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <Link
                key={p.id}
                href={`/proposals/${p.id}/edit`}
                className="block rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <ProjectBadge tenant={p.tenant} />
                    <p className="mt-1 font-medium">
                      {p.ticket?.title ?? p.problem_statement.slice(0, 60)}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[var(--text-secondary)]">
                    <p className="font-mono">
                      {formatCurrency(p.estimated_cost_min ?? 0)}–
                      {formatCurrency(p.estimated_cost_max ?? 0)}
                    </p>
                    <p>{formatRelative(p.created_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
