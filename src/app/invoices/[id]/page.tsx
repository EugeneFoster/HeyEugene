import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getInvoices } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoices = await getInvoices();
  const invoice = invoices.find((i) => i.id === id);
  if (!invoice) notFound();

  return (
    <>
      <TopBar title="Invoice Detail" />
      <div className="p-6">
        <Link
          href="/invoices"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to invoices
        </Link>

        <div className="max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{invoice.invoice_number}</h1>
              <ProjectBadge tenant={invoice.tenant} size="md" />
            </div>
            <StatusBadge status={invoice.status} />
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[var(--text-secondary)]">Subtotal</dt>
              <dd className="font-mono font-medium">
                {formatCurrency(invoice.subtotal)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-secondary)]">Tax</dt>
              <dd className="font-mono font-medium">
                {formatCurrency(invoice.tax_amount)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-secondary)]">Total</dt>
              <dd className="font-mono text-lg font-semibold">
                {formatCurrency(invoice.total, invoice.tenant?.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-secondary)]">Due date</dt>
              <dd>
                {invoice.due_date ? formatDate(invoice.due_date) : "—"}
              </dd>
            </div>
          </dl>

          {invoice.notes && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm">
              {invoice.notes}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
