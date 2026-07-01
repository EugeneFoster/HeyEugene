import type { Ticket, TicketStatus, TicketType } from "@/lib/types";

export type WorkflowStepState = "complete" | "current" | "upcoming" | "blocked";

export interface WorkflowStep {
  id: string;
  label: string;
  hint: string;
  state: WorkflowStepState;
}

const ORDER: TicketStatus[] = [
  "new",
  "in_review",
  "pending_approval",
  "in_progress",
  "done",
  "invoiced",
];

const STEP_META: Record<
  string,
  { label: string; hint: string }
> = {
  new: {
    label: "Submitted",
    hint: "Client sent a request — review and respond.",
  },
  in_review: {
    label: "Review",
    hint: "Triage, estimate, or draft a proposal.",
  },
  pending_approval: {
    label: "Awaiting approval",
    hint: "Client reviews your proposal before work starts.",
  },
  in_progress: {
    label: "In progress",
    hint: "Active development on approved work.",
  },
  done: {
    label: "Complete",
    hint: "Work finished — create and send an invoice.",
  },
  invoiced: {
    label: "Invoiced",
    hint: "Invoice sent — waiting for payment.",
  },
};

function stepsForType(type: TicketType): string[] {
  if (type === "dev_proposal") {
    return ["new", "pending_approval", "in_progress", "done", "invoiced"];
  }
  return ["new", "in_review", "in_progress", "done", "invoiced"];
}

function resolveIndex(status: TicketStatus, stepIds: string[]): number {
  if (status === "declined") return -1;
  if (status === "approved") {
    const idx = stepIds.indexOf("in_progress");
    return idx >= 0 ? idx : stepIds.length - 1;
  }
  const idx = stepIds.indexOf(status);
  return idx >= 0 ? idx : ORDER.indexOf(status);
}

export function getWorkflowSteps(ticket: Pick<Ticket, "type" | "status">): WorkflowStep[] {
  const stepIds = stepsForType(ticket.type);
  const currentIdx = resolveIndex(ticket.status, stepIds);

  if (ticket.status === "declined") {
    return stepIds.map((id, i) => ({
      id,
      label: STEP_META[id]?.label ?? id,
      hint: STEP_META[id]?.hint ?? "",
      state: i <= stepIds.indexOf("pending_approval") ? "complete" : "blocked",
    }));
  }

  return stepIds.map((id, i) => {
    let state: WorkflowStepState = "upcoming";
    if (currentIdx < 0) state = "upcoming";
    else if (i < currentIdx) state = "complete";
    else if (i === currentIdx) state = "current";
    return {
      id,
      label: STEP_META[id]?.label ?? id,
      hint: STEP_META[id]?.hint ?? "",
      state,
    };
  });
}

export function getNextStepMessage(
  ticket: Pick<Ticket, "type" | "status" | "title">
): { title: string; body: string; actionLabel?: string; actionHref?: string } {
  const { type, status } = ticket;

  if (status === "declined") {
    return {
      title: "Proposal declined",
      body: "The client rejected this proposal. Revise and resubmit, or close the ticket.",
    };
  }

  if (type === "dev_proposal" && status === "pending_approval") {
    return {
      title: "Waiting on client",
      body: "Your proposal is in the client's queue. Nothing launches until they approve.",
    };
  }

  switch (status) {
    case "new":
      return {
        title: "Review this request",
        body: "Read the details, run an estimate, and either start work or send a formal proposal.",
        actionLabel: "Start review",
        actionHref: undefined,
      };
    case "in_review":
      return {
        title: "Ready to begin?",
        body: "Move to in progress when you start work, or create a proposal if scope needs client sign-off.",
        actionLabel: "Create proposal",
        actionHref: "/proposals/new",
      };
    case "approved":
    case "in_progress":
      return {
        title: "Work in flight",
        body: "Log time as you go. Mark done when the fix or feature ships to the client.",
      };
    case "done":
      return {
        title: "Time to invoice",
        body: "Work is complete. Build an invoice from logged time and send it to the client.",
        actionLabel: "Create invoice",
        actionHref: "/invoices/new",
      };
    case "invoiced":
      return {
        title: "Awaiting payment",
        body: "Invoice is out. You'll be notified when the client marks it paid.",
      };
    default:
      return {
        title: "All caught up",
        body: "No action needed on this ticket right now.",
      };
  }
}

export interface PipelineCounts {
  new: number;
  inReview: number;
  pendingApproval: number;
  inProgress: number;
  readyToInvoice: number;
  awaitingPayment: number;
}

export function countPipeline(tickets: Ticket[]): PipelineCounts {
  return {
    new: tickets.filter((t) => t.status === "new").length,
    inReview: tickets.filter((t) => t.status === "in_review").length,
    pendingApproval: tickets.filter((t) => t.status === "pending_approval").length,
    inProgress: tickets.filter(
      (t) => t.status === "in_progress" || t.status === "approved"
    ).length,
    readyToInvoice: tickets.filter((t) => t.status === "done").length,
    awaitingPayment: tickets.filter((t) => t.status === "invoiced").length,
  };
}
