import { createServiceClient } from "@/lib/supabase/server";

export async function generateInvoiceNumber(
  tenantId: string,
  prefix: string
): Promise<string> {
  const supabase = createServiceClient();
  const year = new Date().getFullYear();

  if (!supabase) {
    return `${prefix}-${year}-001`;
  }

  const { count } = await supabase
    .from("support_invoices")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .gte("created_at", `${year}-01-01`);

  const next = (count ?? 0) + 1;
  return `${prefix}-${year}-${next.toString().padStart(3, "0")}`;
}
