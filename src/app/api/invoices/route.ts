import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { nextInvoiceNumber, notifyAdmins } from "@/lib/support/bridge";

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
    .select("prefix, hourly_rate")
    .eq("id", tenant_id)
    .single();

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  const subtotal = line_items.reduce((s, l) => s + Number(l.amount), 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const invoice_number = await nextInvoiceNumber(supabase, tenant_id, tenant.prefix);
  const now = new Date().toISOString();

  const { data: invoice, error } = await supabase
    .from("support_invoices")
    .insert({
      tenant_id,
      invoice_number,
      status: send ? "sent" : "draft",
      total,
      tax,
      due_date: due_date || null,
      sent_at: send ? now : null,
      notes: notes ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("support_invoice_items").insert(
    line_items.map((l) => ({
      invoice_id: invoice.id,
      ticket_id: l.ticket_id ?? null,
      description: l.description,
      hours: l.hours ?? null,
      rate: l.rate ?? tenant.hourly_rate,
      amount: l.amount,
    }))
  );

  if (itemsError) {
    await supabase.from("support_invoices").delete().eq("id", invoice.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  if (ticket_ids?.length) {
    await supabase
      .from("support_tickets")
      .update({ status: "invoiced", invoice_id: invoice.id, updated_at: now })
      .in("id", ticket_ids)
      .eq("tenant_id", tenant_id);
  }

  if (send) {
    await notifyAdmins(supabase, {
      tenant_id,
      type: "invoice_sent",
      title: `Invoice ${invoice_number} sent`,
      body: `Total: $${total.toFixed(2)} CAD`,
      reference_id: invoice.id,
      reference_type: "invoice",
    });
  }

  const mapped = {
    ...invoice,
    subtotal: total - tax,
    tax_amount: tax,
    line_items,
  };

  return NextResponse.json({ invoice: mapped });
}
