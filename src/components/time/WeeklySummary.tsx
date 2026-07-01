import type { TimeEntry } from "@/lib/types";
import { formatCurrency, formatDurationLong } from "@/lib/utils/format";

interface WeeklySummaryProps {
  entries: TimeEntry[];
  hourlyRates: Map<string, number>;
}

export function WeeklySummary({ entries, hourlyRates }: WeeklySummaryProps) {
  let totalSeconds = 0;
  let totalCost = 0;
  const byTenant = new Map<
    string,
    { name: string; emoji: string; seconds: number }
  >();

  for (const entry of entries) {
    const seconds =
      entry.duration_seconds ??
      (!entry.ended_at
        ? Math.floor(
            (Date.now() - new Date(entry.started_at).getTime()) / 1000
          )
        : 0);
    totalSeconds += seconds;
    const rate = hourlyRates.get(entry.tenant_id) ?? 25;
    if (entry.is_billable) totalCost += (seconds / 3600) * rate;

    const key = entry.tenant_id;
    const existing = byTenant.get(key);
    if (existing) {
      existing.seconds += seconds;
    } else {
      byTenant.set(key, {
        name: entry.tenant?.name ?? "Unknown",
        emoji: entry.tenant?.emoji ?? "🏢",
        seconds,
      });
    }
  }

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <p className="font-semibold">
        Weekly total: {formatDurationLong(totalSeconds)} ·{" "}
        {formatCurrency(totalCost)}
      </p>
      <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
        {[...byTenant.entries()].map(([tenantId, t]) => (
          <li key={tenantId}>
            {t.emoji} {t.name}: {formatDurationLong(t.seconds)} ·{" "}
            {formatCurrency(
              (t.seconds / 3600) * (hourlyRates.get(tenantId) ?? 25)
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
