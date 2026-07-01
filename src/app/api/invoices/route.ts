import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateInvoiceNumber } from "@/lib/utils/invoice-number";

interface LineItemInput {
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
  ticket_id?: string;
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    tenant_id,
    line_items,
    due_date,
    notes,
    ticket_ids,
    send,
  } = body as {
    tenant_id: string;
    line_items: LineItemInput[];
    due_date?: string;
    notes?: string;
    ticket_ids?: string[];
    send?: boolean;
  };

  if (!tenant_id || !line_items?.length) {
    return NextResponse.json({ error: "tenant_id and line_items required" }, { status: 400 });
  }

  const { data: tenant } = await supabase
    .from("support_tenants")
    .select("prefix, tax_rate")
    .eq("id", tenant_id)
    .single();

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const subtotal = line_items.reduce((s, l) => s + Number(l.amount), 0);
  const taxRate = Number(tenant.tax_rate ?? 0.05);
  const tax_amount = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax_amount) * 100) / 100;
  const invoice_number = await generateInvoiceNumber(tenant_id, tenant.prefix);
  const now = new Date().toISOString();

  const { data: invoice, error } = await supabase
    .from("support_invoices")
    .insert({
      tenant_id,
      invoice_number,
      status: send ? "sent" : "draft",
      subtotal,
      tax_amount,
      total,
      due_date: due_date || null,
      sent_at: send ? now : null,
      notes: notes ?? null,
      line_items: line_items.map((l, i) => ({
        id: `line-${i}`,
        ...l,
      })),
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (ticket_ids?.length) {
    await supabase
      .from("support_tickets")
      .update({ status: "invoiced", updated_at: now })
      .in("id", ticket_ids)
      .eq("tenant_id", tenant_id);
  }

  if (send) {
    await supabase.from("support_notifications").insert({
      tenant_id,
      type: "invoice_sent",
      title: "New invoice",
      message: `Invoice ${invoice_number} for $${total.toFixed(2)} CAD — please review`,
      invoice_id: invoice.id,
      read: false,
    });
  }

  return NextResponse.json({ invoice });
}
