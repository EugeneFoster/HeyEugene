"use client";

import { useProjectFilter } from "@/lib/store/project-filter";
import { IconX } from "@tabler/icons-react";

export function ProjectFilter() {
  const { tenantId, tenantName, tenantEmoji, clearProject } = useProjectFilter();

  if (!tenantId) return null;

  return (
    <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800">
      <span>
        Viewing: {tenantEmoji} {tenantName}
      </span>
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
