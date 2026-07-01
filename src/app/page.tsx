import { TopBar } from "@/components/layout/TopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WeeklyHoursChart } from "@/components/dashboard/WeeklyHoursChart";
import {
  getDashboardStats,
  getNeedsAttention,
  getNotifications,
  getWeeklyHoursByProject,
} from "@/lib/queries";
import { formatCurrency, formatDurationLong, getGreeting } from "@/lib/utils/format";

export default async function DashboardPage() {
  const [stats, attention, notifications, weeklyHours] = await Promise.all([
    getDashboardStats(),
    getNeedsAttention(),
    getNotifications(10),
    getWeeklyHoursByProject(),
  ]);

  return (
    <>
      <TopBar />
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-semibold">
          {getGreeting()}, Eugene
        </h2>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="active tickets"
            value={String(stats.activeTickets)}
            href="/tickets"
          />
          <StatCard
            label="unpaid"
            value={formatCurrency(stats.unpaidTotal)}
            href="/invoices?status=sent"
          />
          <StatCard
            label="this week"
            value={formatDurationLong(stats.weeklySeconds)}
            href="/time"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Needs attention
            </h3>
            <NeedsAttention items={attention} />
          </section>

          <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              Recent activity
            </h3>
            <RecentActivity notifications={notifications} />
          </section>
        </div>

        <section className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            This week
          </h3>
          <WeeklyHoursChart data={weeklyHours} />
        </section>
      </div>
    </>
  );
}
