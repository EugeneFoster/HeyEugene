import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import {
  formatProposalDescription,
  notifyAdmins,
} from "@/lib/support/bridge";

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

  const description = formatProposalDescription({
    problem_statement,
    proposed_solution,
    tasks_it_solves,
    expected_impact,
  });

  const { data: ticket, error: ticketError } = await supabase
    .from("support_tickets")
    .insert({
      tenant_id,
      type: "dev_proposal",
      title: title.trim(),
      description,
      status: "pending_approval",
      priority: "medium",
      estimated_hours_min,
      estimated_hours_max,
      estimated_cost_min,
      estimated_cost_max,
    })
    .select("id, tenant_id, title")
    .single();

  if (ticketError) {
    return NextResponse.json({ error: ticketError.message }, { status: 500 });
  }

  await notifyAdmins(supabase, {
    tenant_id: ticket.tenant_id,
    type: "proposal_pending",
    title: `New proposal: ${ticket.title}`,
    body: "Review and approve in HeyEugene → Support",
    reference_id: ticket.id,
    reference_type: "ticket",
  });

  return NextResponse.json({ ticket_id: ticket.id });
}
