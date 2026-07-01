import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const {
    tenant_id,
    title,
    problem_statement,
    proposed_solution,
    tasks_it_solves,
    expected_impact,
    estimated_hours_min,
    estimated_hours_max,
    estimated_cost_min,
    estimated_cost_max,
  } = body;

  if (!tenant_id || !title?.trim() || !problem_statement || !proposed_solution) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert({
      tenant_id,
      type: "dev_proposal",
      title: title.trim(),
      status: "pending_approval",
      created_by: "Eugene",
      ai_estimate_min: estimated_cost_min,
      ai_estimate_max: estimated_cost_max,
    })
    .select("id")
    .single();

  if (ticketError) {
    return NextResponse.json({ error: ticketError.message }, { status: 500 });
  }

  const { data: proposal, error: proposalError } = await supabase
    .from("dev_proposals")
    .insert({
      ticket_id: ticket.id,
      tenant_id,
      problem_statement,
      proposed_solution,
      tasks_it_solves: tasks_it_solves?.filter(Boolean) ?? [],
      expected_impact: expected_impact ?? null,
      estimated_hours_min,
      estimated_hours_max,
      estimated_cost_min,
      estimated_cost_max,
    })
    .select("id")
    .single();

  if (proposalError) {
    await supabase.from("support_tickets").delete().eq("id", ticket.id);
    return NextResponse.json({ error: proposalError.message }, { status: 500 });
  }

  await supabase.from("support_notifications").insert({
    tenant_id,
    type: "proposal_submitted",
    title: "New proposal",
    message: `Eugene proposed: "${title.trim()}" — awaiting your approval`,
    ticket_id: ticket.id,
    read: false,
  });

  return NextResponse.json({ ticket_id: ticket.id, proposal_id: proposal.id });
}
