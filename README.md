# HeyEugene — Developer Dashboard

Personal CRM command center for managing all client projects. Connects to the shared Supabase database used by client apps (Mike's Place, COAST, etc.) via `support_*` tables.

## Stack

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (shared DB, service role for cross-tenant access)
- **Anthropic Claude** (AI assistant)
- **Recharts** (analytics charts)
- **Zustand** (timer + project filter state)
- **Sonner** (toast notifications)

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in Supabase + Anthropic keys
npm run dev
```

## Database

Run the migration against your shared Supabase project:

```bash
# supabase/migrations/001_dev_dashboard.sql
```

This creates `dev_time_entries`, `dev_proposals`, `dev_ai_usage`, `dev_marketing_*` tables plus seed tenants for Mike's Place and COAST.

## Deployment

Configured for **Cloudflare Pages**. Set environment variables in the Cloudflare dashboard.

## Features

| Page | Route | Status |
|------|-------|--------|
| Dashboard | `/` | ✅ Stats, attention items, activity, weekly chart |
| Tickets | `/tickets` | ✅ List, filters, detail with workflow |
| Invoices | `/invoices` | ✅ List, builder, detail |
| Proposals | `/proposals` | ✅ Editor with client preview |
| Time Log | `/time` | ✅ Grouped entries, timer API |
| AI Assistant | `/ai` | ✅ Chat with context + token tracking |
| AI Usage | `/ai-usage` | ✅ Charts + detail table |
| Marketing | `/marketing/*` | ✅ Contacts + campaigns UI |
| Settings | `/settings` | ✅ Tenant config view |

Without Supabase env vars, the app runs with mock data for development.

## Repo

https://github.com/EugeneFoster/HeyEugene
