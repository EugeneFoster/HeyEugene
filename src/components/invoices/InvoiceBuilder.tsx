"use client";

import { useState } from "react";
import type { Tenant, Ticket, TimeEntry } from "@/lib/types";
import { formatCurrency, formatDurationLong } from "@/lib/utils/format";

interface LineItem {
  id: string;
  description: string;
  hours: number;
  amount: number;
  ticket_id?: string;
}

interface InvoiceBuilderProps {
  tenants: Tenant[];
  tickets: Ticket[];
  timeEntries: TimeEntry[];
  preselectedTicketId?: string;
}

export function InvoiceBuilder({
  tenants,
  tickets,
  timeEntries,
  preselectedTicketId,
}: InvoiceBuilderProps) {
  const [tenantId, setTenantId] = useState(tenants[0]?.id ?? "");
  const tenant = tenants.find((t) => t.id === tenantId);
  const doneTickets = tickets.filter(
    (t) => t.tenant_id === tenantId && t.status === "done"
  );

  const [selected, setSelected] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (preselectedTicketId) s.add(preselectedTicketId);
    return s;
  });

  const [customLines, setCustomLines] = useState<LineItem[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  function getTicketHours(ticketId: string) {
    const secs = timeEntries
      .filter((e) => e.ticket_id === ticketId)
      .reduce((sum, e) => sum + (e.duration_seconds ?? 0), 0);
    return secs / 3600;
  }

  const lineItems: LineItem[] = [
    ...doneTickets
      .filter((t) => selected.has(t.id))
      .map((t) => {
        const hours = getTicketHours(t.id);
        const rate = tenant?.hourly_rate ?? 25;
        return {
          id: t.id,
          description: t.title,
          hours,
          amount: hours * rate,
          ticket_id: t.id,
        };
      }),
    ...customLines,
  ];

  const subtotal = lineItems.reduce((s, l) => s + l.amount, 0);
  const taxRate = tenant?.tax_rate ?? 0.05;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
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
        {tenant && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Rate: {formatCurrency(tenant.hourly_rate)}/hr
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 text-sm font-semibold">Add from completed tickets</h3>
        <ul className="space-y-2">
          {doneTickets.map((t) => {
            const hours = getTicketHours(t.id);
            const amount = hours * (tenant?.hourly_rate ?? 25);
            return (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.has(t.id)}
                  onChange={(e) => {
                    const next = new Set(selected);
                    if (e.target.checked) next.add(t.id);
                    else next.delete(t.id);
                    setSelected(next);
                  }}
                />
                <span className="flex-1">{t.title}</span>
                <span className="font-mono text-xs text-[var(--text-secondary)]">
                  ({formatDurationLong(hours * 3600)}) · {formatCurrency(amount)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mb-6 border-t border-gray-100 pt-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-secondary)]">
            <span>GST ({(taxRate * 100).toFixed(0)}%)</span>
            <span className="font-mono">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="font-mono">
              {formatCurrency(total)} {tenant?.currency ?? "CAD"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Due date</label>
        <input
          type="date"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium">Notes</label>
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Save Draft
        </button>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Send to Client
        </button>
      </div>
    </div>
  );
}
