import { TopBar } from "@/components/layout/TopBar";
import { InvoiceBuilder } from "@/components/invoices/InvoiceBuilder";
import { getTenants, getTickets, getTimeEntries } from "@/lib/queries";

interface PageProps {
  searchParams: Promise<{ ticket?: string }>;
}

export default async function NewInvoicePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [tenants, tickets, timeEntries] = await Promise.all([
    getTenants(),
    getTickets(),
    getTimeEntries(),
  ]);

  return (
    <>
      <TopBar title="New Invoice" />
      <div className="p-6">
        <InvoiceBuilder
          tenants={tenants}
          tickets={tickets}
          timeEntries={timeEntries}
          preselectedTicketId={params.ticket}
        />
      </div>
    </>
  );
}
