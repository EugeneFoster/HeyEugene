import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    type: row.type as string,
    title: row.title as string,
    message: (row.body as string) ?? null,
    ticket_id:
      row.reference_type === "ticket" ? (row.reference_id as string) : null,
    invoice_id:
      row.reference_type === "invoice" ? (row.reference_id as string) : null,
    read: Boolean(row.is_read),
    created_at: row.created_at as string,
  };
}

export async function GET() {
  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ notifications: [], unread: 0 });
  }

  const { data, error } = await supabase
    .from("support_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const notifications = (data ?? []).map((row) =>
    mapRow(row as Record<string, unknown>)
  );
  const unread = notifications.filter((n) => !n.read).length;
  return NextResponse.json({ notifications, unread });
}

export async function PATCH(request: Request) {
  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json().catch(() => ({}));
  const ids = Array.isArray(body?.ids) ? body.ids.map(String) : null;

  let query = supabase
    .from("support_notifications")
    .update({ is_read: true });

  if (ids?.length) {
    query = query.in("id", ids);
  } else {
    query = query.eq("is_read", false);
  }

  const { error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
