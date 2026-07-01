import Link from "next/link";
import type { Invoice } from "@/lib/types";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate, formatRelative } from "@/lib/utils/format";

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--text-secondary)]">
        No invoices yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 bg-gray-50 text-xs font-medium uppercase text-[var(--text-secondary)]">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due date</th>
            <th className="px-4 py-3">Sent</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {inv.invoice_number}
                </Link>
              </td>
              <td className="px-4 py-3">
                <ProjectBadge tenant={inv.tenant} />
              </td>
              <td className="px-4 py-3 font-mono">
                {formatCurrency(inv.total, inv.tenant?.currency)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={inv.status} />
              </td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {inv.due_date ? formatDate(inv.due_date) : "—"}
              </td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {inv.sent_at ? formatRelative(inv.sent_at) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
