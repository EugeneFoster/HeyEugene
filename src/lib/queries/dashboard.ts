import { createServiceClient } from "@/lib/supabase/server";
import type {
  DashboardActionItem,
  DashboardData,
  DashboardProject,
  Invoice,
  Tenant,
  Ticket,
} from "@/lib/types";
import { getTenants, getTickets, getInvoices, getTimeEntries } from "./index";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

const EXCLUDED_TICKET_STATUSES = ["invoiced", "declined"];

interface TicketRow {
  id: string;
  title: string;
  status: string;
  created_by: string | null;
  created_at: string;
}

interface InvoiceRow {
  id: string;
  invoice_number: string;
  total: number;
  status: string;
  due_date: string | null;
}

function buildActionItems(
  tickets: TicketRow[],
  invoices: InvoiceRow[]
): DashboardActionItem[] {
  const items: DashboardActionItem[] = [];

  for (const t of tickets.filter((x) => x.status === "new")) {
    items.push({
      id: `ticket-${t.id}`,
      type: "ticket",
      status: "new",
      statusLabel: "New",
      title: t.title,
      createdByName: t.created_by,
      href: `/tickets/${t.id}`,
    });
  }

  for (const t of tickets.filter((x) => x.status === "pending_approval")) {
    items.push({
      id: `ticket-${t.id}`,
      type: "ticket",
      status: "pending_approval",
      statusLabel: "Pending approval",
      title: t.title,
      createdByName: t.created_by,
      href: `/tickets/${t.id}`,
    });
  }

  for (const t of tickets.filter((x) => x.status === "done")) {
    items.push({
      id: `ticket-${t.id}`,
      type: "ticket",
      status: "done",
      statusLabel: "Done",
      title: `${t.title} — needs invoice`,
      createdByName: t.created_by,
      href: `/tickets/${t.id}`,
    });
  }

  for (const inv of invoices.filter((x) => x.status === "overdue")) {
    items.push({
      id: `invoice-${inv.id}`,
      type: "invoice",
      status: "overdue",
      statusLabel: "Overdue",
      title: inv.invoice_number,
      href: `/invoices/${inv.id}`,
      pulse: true,
    });
  }

  for (const inv of invoices.filter((x) => x.status === "sent")) {
    items.push({
      id: `invoice-${inv.id}`,
      type: "invoice",
      status: "sent",
      statusLabel: "Awaiting payment",
      title: inv.invoice_number,
      href: `/invoices/${inv.id}`,
    });
  }

  return items;
}

function aggregateProject(
  tenant: Tenant,
  tickets: Ticket[],
  invoices: Invoice[],
  timeEntries: { tenant_id: string; started_at: string; duration_seconds: number | null; ended_at: string | null }[]
): DashboardProject {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const projectTickets = tickets
    .filter(
      (t) =>
        t.tenant_id === tenant.id &&
        !EXCLUDED_TICKET_STATUSES.includes(t.status)
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const ticketRows: TicketRow[] = projectTickets.map((t) => ({
    id: t.id,
    title: t.title,
    status: t.status,
    created_by: t.created_by,
    created_at: t.created_at,
  }));

  const unpaidInvoices = invoices.filter(
    (i) =>
      i.tenant_id === tenant.id && ["sent", "overdue"].includes(i.status)
  );

  const invoiceRows: InvoiceRow[] = unpaidInvoices.map((i) => ({
    id: i.id,
    invoice_number: i.invoice_number,
    total: i.total,
    status: i.status,
    due_date: i.due_date,
  }));

  let weeklySeconds = 0;
  for (const entry of timeEntries.filter((e) => e.tenant_id === tenant.id)) {
    const started = parseISO(entry.started_at);
    if (started < weekStart || started > weekEnd) continue;
    if (entry.duration_seconds) {
      weeklySeconds += entry.duration_seconds;
    } else if (!entry.ended_at) {
      weeklySeconds += Math.max(
        0,
        Math.floor((Date.now() - started.getTime()) / 1000)
      );
    }
  }

  const unpaidTotal = unpaidInvoices.reduce((sum, i) => sum + i.total, 0);
  const actionItems = buildActionItems(ticketRows, invoiceRows).slice(0, 3);

  return {
    ...tenant,
    ticketCount: projectTickets.length,
    newTicketCount: projectTickets.filter((t) => t.status === "new").length,
    unpaidTotal,
    weeklySeconds,
    actionItems,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [tenants, tickets, invoices, timeEntries] = await Promise.all([
    getTenants(),
    getTickets(),
    getInvoices(),
    getTimeEntries(),
  ]);

  const projects = tenants.map((tenant) =>
    aggregateProject(tenant, tickets, invoices, timeEntries)
  );

  const summary = {
    totalTickets: projects.reduce((s, p) => s + p.ticketCount, 0),
    totalUnpaid: projects.reduce((s, p) => s + p.unpaidTotal, 0),
    totalWeeklySeconds: projects.reduce((s, p) => s + p.weeklySeconds, 0),
  };

  return { projects, summary };
}
