import type { TicketStatus, InvoiceStatus } from "@/lib/types";
import { statusLabel } from "@/lib/utils/format";

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  in_review: "bg-indigo-50 text-indigo-700",
  in_progress: "bg-amber-50 text-amber-700",
  pending_approval: "bg-orange-50 text-orange-700",
  done: "bg-green-50 text-green-700",
  invoiced: "bg-purple-50 text-purple-700",
  declined: "bg-red-50 text-red-700",
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-50 text-blue-700",
  paid: "bg-green-50 text-green-700",
  overdue: "bg-red-50 text-red-700",
  cancelled: "bg-gray-100 text-gray-500",
};

interface StatusBadgeProps {
  status: TicketStatus | InvoiceStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}
    >
      {statusLabel(status)}
    </span>
  );
}
