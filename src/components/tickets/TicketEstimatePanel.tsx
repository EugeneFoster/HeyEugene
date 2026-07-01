"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Ticket } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";
import { IconClock, IconCurrencyDollar } from "@tabler/icons-react";

interface TicketEstimatePanelProps {
  ticket: Ticket;
}

function hasEstimate(ticket: Ticket) {
  return (
    ticket.estimated_cost_min != null &&
    ticket.estimated_cost_max != null &&
    ticket.estimated_hours_min != null &&
    ticket.estimated_hours_max != null
  );
}

export function TicketEstimatePanel({ ticket }: TicketEstimatePanelProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(!hasEstimate(ticket));
  const [saving, setSaving] = useState(false);
  const [hoursMin, setHoursMin] = useState(
    String(ticket.estimated_hours_min ?? "")
  );
  const [hoursMax, setHoursMax] = useState(
    String(ticket.estimated_hours_max ?? "")
  );
  const [costMin, setCostMin] = useState(
    String(ticket.estimated_cost_min ?? "")
  );
  const [costMax, setCostMax] = useState(
    String(ticket.estimated_cost_max ?? "")
  );

  const currency = ticket.tenant?.currency ?? "CAD";
  const hourlyRate = ticket.tenant?.hourly_rate ?? 25;

  function applyRate(hoursLo: string, hoursHi: string) {
    const lo = parseFloat(hoursLo);
    const hi = parseFloat(hoursHi);
    if (Number.isFinite(lo)) setCostMin(String(Math.round(lo * hourlyRate)));
    if (Number.isFinite(hi)) setCostMax(String(Math.round(hi * hourlyRate)));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/tickets/${ticket.id}/estimate`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hours_min: parseFloat(hoursMin),
          hours_max: parseFloat(hoursMax),
          cost_min: parseFloat(costMin),
          cost_max: parseFloat(costMax),
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (!editing && hasEstimate(ticket)) {
    return (
      <div className="mb-6 rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
            Task estimate
          </p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-amber-900 underline hover:no-underline"
          >
            Edit
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white/80 p-2 text-amber-700">
              <IconClock size={22} stroke={1.75} />
            </div>
            <div>
              <p className="text-sm text-amber-900/70">Time</p>
              <p className="text-2xl font-semibold tabular-nums text-amber-950">
                {ticket.estimated_hours_min}–{ticket.estimated_hours_max}h
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-white/80 p-2 text-amber-700">
              <IconCurrencyDollar size={22} stroke={1.75} />
            </div>
            <div>
              <p className="text-sm text-amber-900/70">Cost ({currency})</p>
              <p className="text-2xl font-semibold tabular-nums text-amber-950">
                {formatCurrency(ticket.estimated_cost_min!, currency)}–
                {formatCurrency(ticket.estimated_cost_max!, currency)}
              </p>
            </div>
          </div>
        </div>
        {ticket.estimate_reasoning ? (
          <p className="mt-3 text-sm text-amber-900/80">
            {ticket.estimate_reasoning}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-5">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-800">
        Set task estimate
      </p>
      <p className="mb-4 text-sm text-amber-900/70">
        Hours and cost at {formatCurrency(hourlyRate, currency)}/hr — client sees
        this before work starts.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Hours (min–max)</span>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.5"
              min="0"
              value={hoursMin}
              onChange={(e) => {
                setHoursMin(e.target.value);
                applyRate(e.target.value, hoursMax);
              }}
              placeholder="0.5"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono"
            />
            <span className="self-center text-gray-400">–</span>
            <input
              type="number"
              step="0.5"
              min="0"
              value={hoursMax}
              onChange={(e) => {
                setHoursMax(e.target.value);
                applyRate(hoursMin, e.target.value);
              }}
              placeholder="2"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono"
            />
          </div>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">
            Cost {currency} (min–max)
          </span>
          <div className="flex gap-2">
            <input
              type="number"
              step="1"
              min="0"
              value={costMin}
              onChange={(e) => setCostMin(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono"
            />
            <span className="self-center text-gray-400">–</span>
            <input
              type="number"
              step="1"
              min="0"
              value={costMax}
              onChange={(e) => setCostMax(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono"
            />
          </div>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save estimate"}
        </button>
        {hasEstimate(ticket) ? (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
