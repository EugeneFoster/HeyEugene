import { Suspense } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { getTickets } from "@/lib/queries";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    status?: string;
    q?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  let tickets = await getTickets();

  if (params.type && params.type !== "all") {
    tickets = tickets.filter((t) => t.type === params.type);
  }
  if (params.status && params.status !== "all") {
    tickets = tickets.filter((t) => t.status === params.status);
  }
  if (params.q && params.q !== "all") {
    const q = params.q.toLowerCase();
    tickets = tickets.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    );
  }

  const types = [...new Set(tickets.map((t) => t.type))];
  const statuses = [
    "new",
    "in_review",
    "in_progress",
    "pending_approval",
    "done",
    "invoiced",
    "declined",
  ];

  return (
    <>
      <TopBar title="Tickets" />
      <div className="p-6">
        <Suspense>
          <TicketFilters types={types} statuses={statuses} />
        </Suspense>
        <TicketTable tickets={tickets} />
      </div>
    </>
  );
}
