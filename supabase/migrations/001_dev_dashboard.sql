-- HeyEugene Developer Dashboard migrations
-- Run against the shared Supabase project (Mike's Place + other clients)

-- Base support tables (if not already present)
create table if not exists support_tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  prefix text not null unique,
  emoji text default '🏢',
  color text default '#3b82f6',
  hourly_rate numeric(10,2) default 25.00,
  currency text default 'CAD',
  tax_rate numeric(5,4) default 0.05,
  contact_name text,
  contact_email text,
  address text,
  payment_instructions text,
  created_at timestamptz default now()
);

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references support_tenants(id),
  type text not null default 'bug',
  title text not null,
  description text,
  status text not null default 'new',
  priority text,
  ai_estimate_min numeric(10,2),
  ai_estimate_max numeric(10,2),
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references support_tickets(id) on delete cascade,
  tenant_id uuid not null references support_tenants(id),
  sender_name text not null,
  sender_role text not null default 'client',
  content text not null,
  created_at timestamptz default now()
);

create table if not exists support_invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references support_tenants(id),
  invoice_number text not null,
  status text not null default 'draft',
  subtotal numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  due_date date,
  sent_at timestamptz,
  paid_at timestamptz,
  notes text,
  pdf_url text,
  line_items jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists support_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references support_tenants(id),
  type text not null,
  title text not null,
  message text,
  ticket_id uuid references support_tickets(id),
  invoice_id uuid references support_invoices(id),
  read boolean default false,
  created_at timestamptz default now()
);

create table if not exists support_changelog (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references support_tenants(id),
  title text not null,
  description text,
  ticket_id uuid references support_tickets(id),
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Developer dashboard tables
create table if not exists dev_time_entries (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references support_tickets(id) on delete set null,
  tenant_id uuid not null references support_tenants(id),
  description text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  is_billable boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_time_entries_active on dev_time_entries (ended_at) where ended_at is null;
create index if not exists idx_time_entries_tenant on dev_time_entries (tenant_id);
create index if not exists idx_time_entries_started on dev_time_entries (started_at desc);

create table if not exists dev_proposals (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references support_tickets(id),
  tenant_id uuid not null references support_tenants(id),
  problem_statement text not null,
  proposed_solution text not null,
  tasks_it_solves text[],
  expected_impact text,
  estimated_hours_min numeric(5,1),
  estimated_hours_max numeric(5,1),
  estimated_cost_min numeric(10,2),
  estimated_cost_max numeric(10,2),
  attachments text[],
  created_at timestamptz default now()
);

create table if not exists dev_ai_usage (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references support_tenants(id),
  ticket_id uuid references support_tickets(id),
  model text not null,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  cost_usd numeric(10,6),
  purpose text,
  created_at timestamptz default now()
);

create or replace view dev_ai_usage_monthly as
select
  tenant_id,
  date_trunc('month', created_at) as month,
  sum(input_tokens) as total_input_tokens,
  sum(output_tokens) as total_output_tokens,
  sum(cost_usd) as total_cost_usd,
  count(*) as request_count
from dev_ai_usage
group by tenant_id, date_trunc('month', created_at);

create table if not exists dev_marketing_contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references support_tenants(id),
  email text not null unique,
  name text,
  company text,
  tags text[],
  subscribed boolean default true,
  source text,
  created_at timestamptz default now(),
  unsubscribed_at timestamptz
);

create table if not exists dev_marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  body_html text,
  body_markdown text,
  status text default 'draft' check (status in ('draft', 'scheduled', 'sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_filter jsonb,
  stats_sent integer default 0,
  stats_opened integer default 0,
  stats_clicked integer default 0,
  created_at timestamptz default now()
);

-- Seed Mike's Place tenant (update UUID as needed)
insert into support_tenants (id, name, prefix, emoji, color, hourly_rate, currency, tax_rate, contact_name, contact_email, address, payment_instructions)
values (
  'a0000000-0000-4000-8000-000000000001',
  'Mike''s Place',
  'MP',
  '🍦',
  '#f59e0b',
  25.00,
  'CAD',
  0.05,
  'Mike Johnson',
  'mike@mikesplace.ca',
  '123 Marine Dr, Gibsons BC',
  'e-Transfer to eugene@heyeugene.com'
) on conflict (prefix) do nothing;

insert into support_tenants (id, name, prefix, emoji, color, hourly_rate, currency, tax_rate)
values (
  'a0000000-0000-4000-8000-000000000002',
  'COAST',
  'CST',
  '🔩',
  '#475569',
  35.00,
  'CAD',
  0.05
) on conflict (prefix) do nothing;
