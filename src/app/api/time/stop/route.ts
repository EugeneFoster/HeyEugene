import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const { id } = await request.json();
  const supabase = createServiceClient();
  const ended_at = new Date().toISOString();

  if (!supabase) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const { data: entry } = await supabase
    .from("dev_time_entries")
    .select("started_at")
    .eq("id", id)
    .single();

  const duration_seconds = entry
    ? Math.floor(
        (new Date(ended_at).getTime() -
          new Date(entry.started_at).getTime()) /
          1000
      )
    : 0;

  const { error } = await supabase
    .from("dev_time_entries")
    .update({ ended_at, duration_seconds })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, duration_seconds });
}
