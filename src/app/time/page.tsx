import { TopBar } from "@/components/layout/TopBar";
import { TimeEntryList } from "@/components/time/TimeEntryList";
import { WeeklySummary } from "@/components/time/WeeklySummary";
import { getTenants, getTimeEntries } from "@/lib/queries";
import { startOfWeek, endOfWeek, parseISO } from "date-fns";

export default async function TimePage() {
  const [tenants, allEntries] = await Promise.all([
    getTenants(),
    getTimeEntries(),
  ]);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const entries = allEntries.filter((e) => {
    const started = parseISO(e.started_at);
    return started >= weekStart && started <= weekEnd;
  });

  const hourlyRates = new Map(tenants.map((t) => [t.id, t.hourly_rate]));

  return (
    <>
      <TopBar title="Time Log" />
      <div className="p-6">
        <TimeEntryList entries={entries} hourlyRates={hourlyRates} />
        <WeeklySummary entries={entries} hourlyRates={hourlyRates} />
      </div>
    </>
  );
}
