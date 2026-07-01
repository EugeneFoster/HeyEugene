import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const hoursMin = Number(body.hours_min);
  const hoursMax = Number(body.hours_max);
  const costMin = Number(body.cost_min);
  const costMax = Number(body.cost_max);

  if (
    ![hoursMin, hoursMax, costMin, costMax].every((n) => Number.isFinite(n) && n >= 0)
  ) {
    return NextResponse.json({ error: "Invalid estimate values" }, { status: 400 });
  }

  if (hoursMin > hoursMax || costMin > costMax) {
    return NextResponse.json(
      { error: "Min must be less than or equal to max" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("support_tickets")
    .update({
      estimated_hours_min: hoursMin,
      estimated_hours_max: hoursMax,
      estimated_cost_min: costMin,
      estimated_cost_max: costMax,
      estimate_status: "ready",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
