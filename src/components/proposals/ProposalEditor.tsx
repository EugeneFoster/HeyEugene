"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Tenant } from "@/lib/types";
import { ProposalPreview } from "./ProposalPreview";
import { formatCurrency } from "@/lib/utils/format";

interface ProposalEditorProps {
  tenants: Tenant[];
  initialTenantId?: string;
  ticketId?: string;
}

export function ProposalEditor({
  tenants,
  initialTenantId,
  ticketId,
}: ProposalEditorProps) {
  const router = useRouter();
  const [tenantId, setTenantId] = useState(
    initialTenantId ?? tenants[0]?.id ?? ""
  );
  const [title, setTitle] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [tasks, setTasks] = useState<string[]>([""]);
  const [impact, setImpact] = useState("");
  const [hoursMin, setHoursMin] = useState(3);
  const [hoursMax, setHoursMax] = useState(5);
  const [preview, setPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tenant = tenants.find((t) => t.id === tenantId);
  const rate = tenant?.hourly_rate ?? 25;
  const costMin = hoursMin * rate;
  const costMax = hoursMax * rate;

  const proposalData = {
    problem_statement: problem,
    proposed_solution: solution,
    tasks_it_solves: tasks.filter(Boolean),
    expected_impact: impact,
    estimated_hours_min: hoursMin,
    estimated_hours_max: hoursMax,
    estimated_cost_min: costMin,
    estimated_cost_max: costMax,
  };

  async function submitToClient() {
    if (!title.trim() || !problem.trim() || !solution.trim()) {
      toast.error("Title, problem, and solution are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposals/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: tenantId,
          title,
          ...proposalData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submit failed");
      toast.success("Proposal sent to client for approval");
      router.push(`/tickets/${data.ticket_id}`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (preview) {
    return (
      <div>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm"
          >
            Edit
          </button>
        </div>
        <ProposalPreview
          proposal={proposalData}
          title={title}
          currency={tenant?.currency}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Project</label>
        <select
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={tenantId}
          onChange={(e) => setTenantId(e.target.value)}
        >
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Push notifications for repeat customers"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Problem</label>
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Proposed Solution (markdown)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm"
          rows={6}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Tasks This Solves
        </label>
        {tasks.map((task, i) => (
          <input
            key={i}
            className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            value={task}
            onChange={(e) => {
              const next = [...tasks];
              next[i] = e.target.value;
              setTasks(next);
            }}
            placeholder="Task description"
          />
        ))}
        <button
          type="button"
          onClick={() => setTasks([...tasks, ""])}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add task
        </button>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Expected Impact</label>
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          rows={2}
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Hours (min–max)</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={hoursMin}
              onChange={(e) => setHoursMin(Number(e.target.value))}
            />
            <span className="self-center">to</span>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              value={hoursMax}
              onChange={(e) => setHoursMax(Number(e.target.value))}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Cost (auto)</label>
          <p className="rounded-lg bg-gray-50 px-3 py-2 font-mono text-sm">
            {formatCurrency(costMin)} – {formatCurrency(costMax)}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setPreview(true)}
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium"
        >
          Preview as client sees it
        </button>
        <button
          type="button"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium"
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={submitToClient}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Submit to Client"}
        </button>
      </div>
    </div>
  );
}
