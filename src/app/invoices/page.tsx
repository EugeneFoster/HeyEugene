import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { InvoiceTable } from "@/components/invoices/InvoiceTable";
import { getInvoices } from "@/lib/queries";

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  return (
    <>
      <TopBar title="Invoices" />
      <div className="p-6">
        <div className="mb-4 flex justify-end">
          <Link
            href="/invoices/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Invoice
          </Link>
        </div>
        <InvoiceTable invoices={invoices} />
      </div>
    </>
  );
}
