import Link from "next/link";
import type { DashboardSummary } from "@/lib/types";
import { formatCurrency, formatDurationLong } from "@/lib/utils/format";

interface SummaryBarProps {
  summary: DashboardSummary;
}

export function SummaryBar({ summary }: SummaryBarProps) {
  const { totalTickets, totalUnpaid, totalWeeklySeconds } = summary;
  const allEmpty =
    totalTickets === 0 && totalUnpaid === 0 && totalWeeklySeconds === 0;

  if (allEmpty) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        <Link href="/tickets" className="hover:text-blue-600">
          No active tickets
        </Link>
        {" · "}
        <Link href="/invoices" className="hover:text-blue-600">
          All invoices paid
        </Link>
        {" · "}
        <Link href="/time" className="hover:text-blue-600">
          Start tracking time →
        </Link>
      </p>
    );
  }

  return (
    <p className="text-sm text-[var(--text-secondary)]">
      <Link href="/tickets" className="hover:text-blue-600">
        {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}
      </Link>
      {" · "}
      <Link href="/invoices?status=sent" className="hover:text-blue-600">
        {formatCurrency(totalUnpaid)} unpaid
      </Link>
      {" · "}
      <Link href="/time" className="hover:text-blue-600">
        {formatDurationLong(totalWeeklySeconds)} this week
      </Link>
    </p>
  );
}
