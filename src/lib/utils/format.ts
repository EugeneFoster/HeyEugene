import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatCurrency(
  amount: number,
  currency = "CAD"
): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h}h ${m.toString().padStart(2, "0")}m`;
  }
  if (m > 0) {
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  }
  return `${s}s`;
}

export function formatDurationLong(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function formatTimeRange(
  startedAt: string,
  endedAt: string | null
): string {
  const start = format(parseISO(startedAt), "HH:mm");
  if (!endedAt) return `${start} – ⏱ running...`;
  const end = format(parseISO(endedAt), "HH:mm");
  return `${start} – ${end}`;
}

export function formatRelative(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

export function formatDate(date: string): string {
  return format(parseISO(date), "MMM d, yyyy");
}

export function formatDayHeader(date: string): string {
  return format(parseISO(date), "EEEE, MMMM d");
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function ticketTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    bug_report: "Bug",
    feature_request: "Feature",
    bug: "Bug",
    feature: "Feature",
    dev_proposal: "Proposal",
    question: "Question",
    other: "Other",
  };
  return labels[type] ?? type;
}

export function ticketTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    bug_report: "🐛",
    feature_request: "⭐",
    bug: "🐛",
    feature: "⭐",
    dev_proposal: "💡",
    question: "❓",
    other: "📋",
  };
  return emojis[type] ?? "📋";
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
