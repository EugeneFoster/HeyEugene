import type { TimeEntry } from "@/lib/types";
import { ProjectBadge } from "@/components/shared/ProjectBadge";
import {
  formatCurrency,
  formatDayHeader,
  formatDurationLong,
  formatTimeRange,
} from "@/lib/utils/format";
import { parseISO, format } from "date-fns";

interface TimeEntryListProps {
  entries: TimeEntry[];
  hourlyRates: Map<string, number>;
}

function groupByDay(entries: TimeEntry[]) {
  const groups = new Map<string, TimeEntry[]>();
  for (const entry of entries) {
    const day = format(parseISO(entry.started_at), "yyyy-MM-dd");
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(entry);
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

export function TimeEntryList({ entries, hourlyRates }: TimeEntryListProps) {
  const groups = groupByDay(entries);

  if (groups.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--text-secondary)]">
        No time entries yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map(([day, dayEntries]) => (
        <div key={day}>
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">
            {formatDayHeader(dayEntries[0].started_at)}
          </h3>
          <ul className="space-y-3">
            {dayEntries.map((entry) => {
              const seconds =
                entry.duration_seconds ??
                (!entry.ended_at
                  ? Math.floor(
                      (Date.now() - parseISO(entry.started_at).getTime()) / 1000
                    )
                  : 0);
              const rate = hourlyRates.get(entry.tenant_id) ?? 25;
              const cost = (seconds / 3600) * rate;
              const label =
                entry.ticket?.title ?? entry.description ?? "Untitled";

              return (
                <li
                  key={entry.id}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <ProjectBadge tenant={entry.tenant} />
                      <p className="mt-1 font-medium">{label}</p>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {formatTimeRange(entry.started_at, entry.ended_at)} ·{" "}
                        {formatDurationLong(seconds)}
                        {entry.is_billable && (
                          <> · {formatCurrency(cost)}</>
                        )}
                      </p>
                    </div>
                    {!entry.ended_at && (
                      <span className="flex items-center gap-1 text-sm text-red-500">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot" />
                        running
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
