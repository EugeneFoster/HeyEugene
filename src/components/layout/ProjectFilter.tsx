"use client";

import { useProjectFilter } from "@/lib/store/project-filter";
import { IconX } from "@tabler/icons-react";

export function ProjectFilter() {
  const { tenantId, tenantName, tenantColor, clearProject } =
    useProjectFilter();

  if (!tenantId) return null;

  return (
    <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: tenantColor ?? "#3b82f6" }}
      />
      <span>Viewing: {tenantName}</span>
      <button
        type="button"
        onClick={clearProject}
        className="rounded-full p-0.5 hover:bg-blue-100"
        aria-label="Clear project filter"
      >
        <IconX size={14} />
      </button>
    </div>
  );
}
