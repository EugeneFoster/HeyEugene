import Link from "next/link";
import type { DashboardProject } from "@/lib/types";
import { ActionItem } from "./ActionItem";
import { formatCurrency, formatDurationLong } from "@/lib/utils/format";

interface ProjectCardProps {
  project: DashboardProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const hasUnpaid = project.unpaidTotal > 0;
  const weeklyTime =
    project.weeklySeconds > 0
      ? formatDurationLong(project.weeklySeconds)
      : "0h";

  return (
    <div
      className="rounded-xl border border-gray-100 border-l-4 bg-white p-5 shadow-sm"
      style={{ borderLeftColor: project.color }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="text-lg font-semibold">{project.name}</h3>
        </div>
        <Link
          href={`/tickets?project=${project.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View project →
        </Link>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        {project.ticketCount} ticket{project.ticketCount !== 1 ? "s" : ""}
        {project.newTicketCount > 0 && ` (${project.newTicketCount} new)`}
        {" · "}
        {hasUnpaid ? formatCurrency(project.unpaidTotal) + " unpaid" : "All paid"}
        {" · "}
        {weeklyTime}
      </p>

      {project.actionItems.length > 0 ? (
        <div className="space-y-2">
          {project.actionItems.map((item) => (
            <ActionItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-green-600">
          ✓ All clear — no items need attention
        </p>
      )}
    </div>
  );
}
