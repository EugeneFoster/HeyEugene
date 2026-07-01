import type { SupabaseClient } from "@supabase/supabase-js";

export function normalizeUuid(value: string | null | undefined): string | null {
  const v = String(value ?? "").trim();
  return v || null;
}

export async function adminProfileIds(
  supabase: SupabaseClient
): Promise<string[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["owner", "admin"])
    .eq("is_active", true);
  return (data ?? [])
    .map((p) => normalizeUuid(p.id as string))
    .filter((id): id is string => Boolean(id));
}

export async function notifyAdmins(
  supabase: SupabaseClient,
  input: {
    tenant_id: string;
    type: string;
    title: string;
    body?: string | null;
    reference_id?: string;
    reference_type?: "ticket" | "invoice";
  }
) {
  const admins = await adminProfileIds(supabase);
  if (!admins.length) return;

  await supabase.from("support_notifications").insert(
    admins.map((user_id) => ({
      tenant_id: input.tenant_id,
      user_id,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      reference_id: input.reference_id ?? null,
      reference_type: input.reference_type ?? null,
      is_read: false,
    }))
  );
}

export async function nextInvoiceNumber(
  supabase: SupabaseClient,
  tenantId: string,
  prefix: string
): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("support_invoices")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", `${year}-01-01`);

  const next = (count ?? 0) + 1;
  return `${prefix}-${year}-${next.toString().padStart(3, "0")}`;
}

export interface ProposalPayload {
  problem_statement: string;
  proposed_solution: string;
  tasks_it_solves?: string[];
  expected_impact?: string | null;
}

export function formatProposalDescription(payload: ProposalPayload): string {
  const tasks = (payload.tasks_it_solves ?? []).filter(Boolean);
  const parts = [
    `## Problem\n${payload.problem_statement}`,
    `## Proposed solution\n${payload.proposed_solution}`,
  ];
  if (tasks.length) {
    parts.push(`## Tasks this solves\n${tasks.map((t) => `- ${t}`).join("\n")}`);
  }
  if (payload.expected_impact) {
    parts.push(`## Expected impact\n${payload.expected_impact}`);
  }
  return parts.join("\n\n");
}
