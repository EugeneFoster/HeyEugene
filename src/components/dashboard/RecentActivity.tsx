import type { Notification } from "@/lib/types";
import { formatRelative } from "@/lib/utils/format";

export function RecentActivity({
  notifications,
}: {
  notifications: Notification[];
}) {
  if (notifications.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">No recent activity.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {notifications.map((n) => (
        <li key={n.id} className="flex items-start justify-between gap-4 text-sm">
          <span>
            <span className="text-gray-400">•</span>{" "}
            {n.tenant?.emoji} {n.message ?? n.title}
          </span>
          <span className="shrink-0 text-[var(--text-secondary)]">
            {formatRelative(n.created_at)}
          </span>
        </li>
      ))}
    </ul>
  );
}
