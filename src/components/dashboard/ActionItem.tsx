import Link from "next/link";
import type { DashboardActionItem } from "@/lib/types";

const DOT_COLORS: Record<string, string> = {
  new: "bg-red-500",
  pending_approval: "bg-amber-500",
  in_progress: "bg-blue-500",
  done: "bg-green-500",
  sent: "bg-blue-400",
  overdue: "bg-red-500",
};

export function StatusDot({
  status,
  pulse,
}: {
  status: string;
  pulse?: boolean;
}) {
  const color = DOT_COLORS[status] ?? "bg-gray-400";
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${color} ${pulse ? "animate-pulse-dot" : ""}`}
    />
  );
}

export function ActionItem({ item }: { item: DashboardActionItem }) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-3 text-sm hover:bg-gray-50 rounded-lg px-1 py-0.5 -mx-1"
    >
      <StatusDot status={item.status} pulse={item.pulse} />
      <span className="shrink-0 text-gray-500">{item.statusLabel}:</span>
      <span className="min-w-0 truncate font-medium">{item.title}</span>
      {item.createdByName && (
        <span className="ml-auto shrink-0 text-gray-400">
          — {item.createdByName}
        </span>
      )}
    </Link>
  );
}
