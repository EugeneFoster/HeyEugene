export type TicketStatus =
  | "new"
  | "in_review"
  | "in_progress"
  | "pending_approval"
  | "approved"
  | "done"
  | "invoiced"
  | "declined";

export type TicketType =
  | "bug_report"
  | "feature_request"
  | "dev_proposal"
  | "bug"
  | "feature"
  | "question"
  | "other";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export type CampaignStatus = "draft" | "scheduled" | "sent";

export interface Tenant {
  id: string;
  name: string;
  prefix: string;
  emoji: string;
  color: string;
  hourly_rate: number;
  currency: string;
  tax_rate: number;
  contact_name: string | null;
  contact_email: string | null;
  address: string | null;
  payment_instructions: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  tenant_id: string;
  type: TicketType;
  title: string;
  description: string | null;
  status: TicketStatus;
  priority: string | null;
  estimated_hours_min: number | null;
  estimated_hours_max: number | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  estimate_reasoning: string | null;
  estimate_status: string | null;
  /** @deprecated use estimated_cost_min/max */
  ai_estimate_min: number | null;
  /** @deprecated use estimated_cost_max */
  ai_estimate_max: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
}

export interface Message {
  id: string;
  ticket_id: string;
  tenant_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_amount: number;
  total: number;
  due_date: string | null;
  sent_at: string | null;
  paid_at: string | null;
  notes: string | null;
  pdf_url: string | null;
  line_items: InvoiceLineItem[];
  created_at: string;
  tenant?: Tenant;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
  ticket_id?: string;
}

export interface Notification {
  id: string;
  tenant_id: string;
  type: string;
  title: string;
  message: string | null;
  ticket_id: string | null;
  invoice_id: string | null;
  read: boolean;
  created_at: string;
  tenant?: Tenant;
}

export interface TimeEntry {
  id: string;
  ticket_id: string | null;
  tenant_id: string;
  description: string | null;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  is_billable: boolean;
  created_at: string;
  tenant?: Tenant;
  ticket?: Ticket;
}

export interface Proposal {
  id: string;
  ticket_id: string;
  tenant_id: string;
  problem_statement: string;
  proposed_solution: string;
  tasks_it_solves: string[];
  expected_impact: string | null;
  estimated_hours_min: number | null;
  estimated_hours_max: number | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  attachments: string[];
  created_at: string;
  tenant?: Tenant;
  ticket?: Ticket;
}

export interface AiUsage {
  id: string;
  tenant_id: string;
  ticket_id: string | null;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number | null;
  purpose: string | null;
  created_at: string;
  tenant?: Tenant;
}

export interface MarketingContact {
  id: string;
  tenant_id: string | null;
  email: string;
  name: string | null;
  company: string | null;
  tags: string[];
  subscribed: boolean;
  source: string | null;
  created_at: string;
  unsubscribed_at: string | null;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  subject: string;
  body_html: string | null;
  body_markdown: string | null;
  status: CampaignStatus;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_filter: Record<string, unknown> | null;
  stats_sent: number;
  stats_opened: number;
  stats_clicked: number;
  created_at: string;
}

export interface DashboardStats {
  activeTickets: number;
  unpaidTotal: number;
  weeklyHours: number;
  weeklySeconds: number;
  newTickets: number;
  unpaidInvoices: number;
}

export interface DashboardActionItem {
  id: string;
  type: "ticket" | "invoice";
  status: string;
  statusLabel: string;
  title: string;
  createdByName?: string | null;
  href: string;
  pulse?: boolean;
}

export interface DashboardProject extends Tenant {
  ticketCount: number;
  newTicketCount: number;
  unpaidTotal: number;
  weeklySeconds: number;
  actionItems: DashboardActionItem[];
}

export interface DashboardSummary {
  totalTickets: number;
  totalUnpaid: number;
  totalWeeklySeconds: number;
}

export interface DashboardData {
  projects: DashboardProject[];
  summary: DashboardSummary;
}
