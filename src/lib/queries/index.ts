import { createServiceClient } from "@/lib/supabase/server";
import type {
  AiUsage,
  DashboardStats,
  Invoice,
  MarketingCampaign,
  MarketingContact,
  Notification,
  Proposal,
  Tenant,
  Ticket,
  TimeEntry,
} from "@/lib/types";
import {
  startOfWeek,
  endOfWeek,
  subDays,
  differenceInDays,
  parseISO,
} from "date-fns";

const MOCK_TENANTS: Tenant[] = [
  {
    id: "a0000000-0000-4000-8000-000000000001",
    name: "Mike's Place",
    prefix: "MP",
    emoji: "🍦",
    color: "#f59e0b",
    hourly_rate: 25,
    currency: "CAD",
    tax_rate: 0.05,
    contact_name: "Mike Johnson",
    contact_email: "mike@mikesplace.ca",
    address: "123 Marine Dr, Gibsons BC",
    payment_instructions: "e-Transfer to eugene@heyeugene.com",
    created_at: new Date().toISOString(),
  },
  {
    id: "a0000000-0000-4000-8000-000000000002",
    name: "COAST",
    prefix: "CST",
    emoji: "🔩",
    color: "#475569",
    hourly_rate: 35,
    currency: "CAD",
    tax_rate: 0.05,
    contact_name: null,
    contact_email: null,
    address: null,
    payment_instructions: null,
    created_at: new Date().toISOString(),
  },
];

function attachTenants<T extends { tenant_id: string }>(
  items: T[],
  tenants: Tenant[]
): (T & { tenant?: Tenant })[] {
  const map = new Map(tenants.map((t) => [t.id, t]));
  return items.map((item) => ({ ...item, tenant: map.get(item.tenant_id) }));
}

export async function getTenants(): Promise<Tenant[]> {
  const supabase = createServiceClient();
  if (!supabase) return MOCK_TENANTS;

  const { data, error } = await supabase
    .from("support_tenants")
    .select("*")
    .order("name");

  if (error || !data?.length) return MOCK_TENANTS;
  return (data as Tenant[]).map((t) => ({
    ...t,
    color: t.color ?? "#3b82f6",
  }));
}

export async function getTickets(tenantId?: string | null): Promise<Ticket[]> {
  const tenants = await getTenants();
  const supabase = createServiceClient();

  if (!supabase) {
    const mock: Ticket[] = [
      {
        id: "t1",
        tenant_id: MOCK_TENANTS[0].id,
        type: "bug",
        title: "Cart badge not updating",
        description: "The cart icon badge doesn't reflect item count after adding products.",
        status: "done",
        priority: "Need soon",
        ai_estimate_min: 25,
        ai_estimate_max: 50,
        created_by: "Mike Johnson",
        created_at: subDays(new Date(), 2).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t2",
        tenant_id: MOCK_TENANTS[0].id,
        type: "dev_proposal",
        title: "Push notifications setup",
        description: null,
        status: "pending_approval",
        priority: null,
        ai_estimate_min: 150,
        ai_estimate_max: 200,
        created_by: "Eugene",
        created_at: subDays(new Date(), 1).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t4",
        tenant_id: MOCK_TENANTS[0].id,
        type: "bug",
        title: "Freezer temp display bug",
        description: "Temperature reading shows incorrect values on staff dashboard.",
        status: "new",
        priority: "Need soon",
        ai_estimate_min: 25,
        ai_estimate_max: 50,
        created_by: "Anna",
        created_at: subDays(new Date(), 0.2).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "t3",
        tenant_id: MOCK_TENANTS[1].id,
        type: "feature",
        title: "Export timesheets to PDF",
        description: "Staff need to export weekly timesheets as PDF for payroll.",
        status: "in_progress",
        priority: "When poss.",
        ai_estimate_min: 75,
        ai_estimate_max: 100,
        created_by: "Admin",
        created_at: subDays(new Date(), 3).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    return attachTenants(mock, tenants);
  }

  let query = supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (tenantId) query = query.eq("tenant_id", tenantId);

  const { data } = await query;
  return attachTenants((data ?? []) as Ticket[], tenants);
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const tickets = await getTickets();
  return tickets.find((t) => t.id === id) ?? null;
}

export async function getInvoices(
  tenantId?: string | null
): Promise<Invoice[]> {
  const tenants = await getTenants();
  const supabase = createServiceClient();

  if (!supabase) {
    const mock: Invoice[] = [
      {
        id: "i1",
        tenant_id: MOCK_TENANTS[0].id,
        invoice_number: "MP-2026-003",
        status: "sent",
        subtotal: 178.57,
        tax_amount: 8.93,
        total: 187.5,
        due_date: "2026-07-15",
        sent_at: subDays(new Date(), 2).toISOString(),
        paid_at: null,
        notes: null,
        pdf_url: null,
        line_items: [],
        created_at: subDays(new Date(), 2).toISOString(),
      },
      {
        id: "i2",
        tenant_id: MOCK_TENANTS[0].id,
        invoice_number: "MP-2026-002",
        status: "paid",
        subtotal: 119.05,
        tax_amount: 5.95,
        total: 125,
        due_date: "2026-06-15",
        sent_at: subDays(new Date(), 30).toISOString(),
        paid_at: subDays(new Date(), 15).toISOString(),
        notes: null,
        pdf_url: null,
        line_items: [],
        created_at: subDays(new Date(), 30).toISOString(),
      },
      {
        id: "i3",
        tenant_id: MOCK_TENANTS[1].id,
        invoice_number: "CST-2026-001",
        status: "draft",
        subtotal: 428.57,
        tax_amount: 21.43,
        total: 450,
        due_date: null,
        sent_at: null,
        paid_at: null,
        notes: null,
        pdf_url: null,
        line_items: [],
        created_at: new Date().toISOString(),
      },
    ];
    return attachTenants(mock, tenants);
  }

  let query = supabase
    .from("support_invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (tenantId) query = query.eq("tenant_id", tenantId);

  const { data } = await query;
  return attachTenants((data ?? []) as Invoice[], tenants);
}

export async function getNotifications(
  limit = 10
): Promise<Notification[]> {
  const tenants = await getTenants();
  const supabase = createServiceClient();

  if (!supabase) {
    const mock: Notification[] = [
      {
        id: "n1",
        tenant_id: MOCK_TENANTS[0].id,
        type: "ticket_created",
        title: "New ticket",
        message: 'Mike submitted "Fix cart badge count"',
        ticket_id: "t1",
        invoice_id: null,
        read: false,
        created_at: subDays(new Date(), 0.08).toISOString(),
      },
      {
        id: "n2",
        tenant_id: MOCK_TENANTS[0].id,
        type: "staff_report",
        title: "Staff report",
        message: 'Staff Anna reported "Freezer temp alert"',
        ticket_id: null,
        invoice_id: null,
        read: false,
        created_at: subDays(new Date(), 0.17).toISOString(),
      },
      {
        id: "n3",
        tenant_id: MOCK_TENANTS[0].id,
        type: "invoice_paid",
        title: "Invoice paid",
        message: "Invoice MP-2026-002 paid",
        ticket_id: null,
        invoice_id: "i2",
        read: true,
        created_at: subDays(new Date(), 1).toISOString(),
      },
    ];
    return attachTenants(mock, tenants).slice(0, limit);
  }

  const { data } = await supabase
    .from("support_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return attachTenants((data ?? []) as Notification[], tenants);
}

export async function getTimeEntries(
  tenantId?: string | null
): Promise<TimeEntry[]> {
  const tenants = await getTenants();
  const tickets = await getTickets(tenantId);
  const supabase = createServiceClient();

  if (!supabase) {
    const now = new Date();
    const mock: TimeEntry[] = [
      {
        id: "te1",
        ticket_id: "t1",
        tenant_id: MOCK_TENANTS[0].id,
        description: "Fix cart badge count",
        started_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 15).toISOString(),
        ended_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 11, 47).toISOString(),
        duration_seconds: 5520,
        is_billable: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "te2",
        ticket_id: null,
        tenant_id: MOCK_TENANTS[0].id,
        description: "Support portal setup",
        started_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 14, 0).toISOString(),
        ended_at: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 16, 30).toISOString(),
        duration_seconds: 9000,
        is_billable: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "te3",
        ticket_id: "t3",
        tenant_id: MOCK_TENANTS[1].id,
        description: "Timesheet export",
        started_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString(),
        ended_at: null,
        duration_seconds: null,
        is_billable: true,
        created_at: new Date().toISOString(),
      },
    ];
    const withTenants = attachTenants(mock, tenants);
    return withTenants.map((e) => ({
      ...e,
      ticket: tickets.find((t) => t.id === e.ticket_id),
    }));
  }

  let query = supabase
    .from("dev_time_entries")
    .select("*")
    .order("started_at", { ascending: false });

  if (tenantId) query = query.eq("tenant_id", tenantId);

  const { data } = await query;
  const entries = attachTenants((data ?? []) as TimeEntry[], tenants);
  return entries.map((e) => ({
    ...e,
    ticket: tickets.find((t) => t.id === e.ticket_id),
  }));
}

export async function getProposals(): Promise<Proposal[]> {
  const tenants = await getTenants();
  const supabase = createServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("dev_proposals")
    .select("*")
    .order("created_at", { ascending: false });

  return attachTenants((data ?? []) as Proposal[], tenants);
}

export async function getAiUsage(): Promise<AiUsage[]> {
  const tenants = await getTenants();
  const supabase = createServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("dev_ai_usage")
    .select("*")
    .order("created_at", { ascending: false });

  return attachTenants((data ?? []) as AiUsage[], tenants);
}

export async function getMarketingContacts(): Promise<MarketingContact[]> {
  const supabase = createServiceClient();
  if (!supabase) {
    return [
      {
        id: "c1",
        tenant_id: MOCK_TENANTS[0].id,
        email: "mike@mikesplace.ca",
        name: "Mike Johnson",
        company: "Mike's Place",
        tags: ["client"],
        subscribed: true,
        source: "referral",
        created_at: new Date().toISOString(),
        unsubscribed_at: null,
      },
    ];
  }

  const { data } = await supabase
    .from("dev_marketing_contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as MarketingContact[];
}

export async function getMarketingCampaigns(): Promise<MarketingCampaign[]> {
  const supabase = createServiceClient();
  if (!supabase) {
    return [
      {
        id: "camp1",
        name: "June Newsletter",
        subject: "What's new at HeyEugene",
        body_html: null,
        body_markdown: "# June updates\n\nNew features and tips.",
        status: "sent",
        scheduled_at: null,
        sent_at: subDays(new Date(), 15).toISOString(),
        recipient_filter: { tags: ["client"] },
        stats_sent: 12,
        stats_opened: 8,
        stats_clicked: 3,
        created_at: subDays(new Date(), 20).toISOString(),
      },
      {
        id: "camp2",
        name: "Welcome sequence",
        subject: "Welcome!",
        body_html: null,
        body_markdown: "Thanks for subscribing.",
        status: "draft",
        scheduled_at: null,
        sent_at: null,
        recipient_filter: { tags: ["lead"] },
        stats_sent: 0,
        stats_opened: 0,
        stats_clicked: 0,
        created_at: new Date().toISOString(),
      },
    ];
  }

  const { data } = await supabase
    .from("dev_marketing_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as MarketingCampaign[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const tickets = await getTickets();
  const invoices = await getInvoices();
  const timeEntries = await getTimeEntries();

  const activeTickets = tickets.filter((t) =>
    ["new", "in_review", "in_progress", "pending_approval"].includes(t.status)
  ).length;

  const newTickets = tickets.filter((t) =>
    ["new", "in_review"].includes(t.status)
  ).length;

  const unpaidInvoices = invoices.filter((i) =>
    ["sent", "overdue"].includes(i.status)
  ).length;

  const unpaidTotal = invoices
    .filter((i) => ["sent", "overdue"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  let weeklySeconds = 0;
  for (const entry of timeEntries) {
    const started = parseISO(entry.started_at);
    if (started >= weekStart && started <= weekEnd) {
      if (entry.duration_seconds) {
        weeklySeconds += entry.duration_seconds;
      } else if (!entry.ended_at) {
        weeklySeconds += Math.floor(
          (Date.now() - started.getTime()) / 1000
        );
      }
    }
  }

  return {
    activeTickets,
    unpaidTotal,
    weeklyHours: weeklySeconds / 3600,
    weeklySeconds,
    newTickets,
    unpaidInvoices,
  };
}

export interface AttentionItem {
  id: string;
  severity: "danger" | "warning" | "info";
  message: string;
  href?: string;
}

export async function getNeedsAttention(): Promise<AttentionItem[]> {
  const tickets = await getTickets();
  const invoices = await getInvoices();
  const items: AttentionItem[] = [];

  const tenants = await getTenants();
  for (const tenant of tenants) {
    const pending = tickets.filter(
      (t) =>
        t.tenant_id === tenant.id && t.status === "pending_approval"
    );
    if (pending.length > 0) {
      items.push({
        id: `pending-${tenant.id}`,
        severity: "danger",
        message: `${tenant.emoji} ${tenant.name}: ${pending.length} pending approval${pending.length > 1 ? "s" : ""}`,
        href: "/tickets?status=pending_approval",
      });
    }
  }

  for (const invoice of invoices) {
    if (invoice.status === "sent" && invoice.due_date) {
      const days = differenceInDays(new Date(), parseISO(invoice.due_date));
      if (days > 0) {
        const tenant = invoice.tenant;
        items.push({
          id: `overdue-${invoice.id}`,
          severity: "warning",
          message: `${tenant?.emoji ?? ""} ${tenant?.name ?? "Project"}: Invoice ${invoice.invoice_number} overdue (${days} days)`,
          href: `/invoices/${invoice.id}`,
        });
      }
    }
  }

  return items;
}

export interface WeeklyHoursByProject {
  tenantId: string;
  name: string;
  emoji: string;
  hours: number;
}

export async function getWeeklyHoursByProject(): Promise<WeeklyHoursByProject[]> {
  const tenants = await getTenants();
  const timeEntries = await getTimeEntries();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const secondsByTenant = new Map<string, number>();

  for (const entry of timeEntries) {
    const started = parseISO(entry.started_at);
    if (started < weekStart || started > weekEnd) continue;

    let seconds = entry.duration_seconds ?? 0;
    if (!entry.ended_at && !entry.duration_seconds) {
      seconds = Math.floor((Date.now() - started.getTime()) / 1000);
    }

    secondsByTenant.set(
      entry.tenant_id,
      (secondsByTenant.get(entry.tenant_id) ?? 0) + seconds
    );
  }

  return tenants
    .map((t) => ({
      tenantId: t.id,
      name: t.name,
      emoji: t.emoji,
      hours: (secondsByTenant.get(t.id) ?? 0) / 3600,
    }))
    .filter((p) => p.hours > 0);
}
