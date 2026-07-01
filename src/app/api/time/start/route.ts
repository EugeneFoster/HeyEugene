import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceClient();
  const started_at = new Date().toISOString();

  if (!supabase) {
    return NextResponse.json({
      id: `mock-${Date.now()}`,
      started_at,
    });
  }

  const { data, error } = await supabase
    .from("dev_time_entries")
    .insert({
      tenant_id: body.tenant_id,
      ticket_id: body.ticket_id ?? null,
      description: body.description ?? null,
      started_at,
    })
    .select("id, started_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
