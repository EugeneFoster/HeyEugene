"use client";

import Link from "next/link";
import type { DashboardData } from "@/lib/types";
import type { PipelineCounts } from "@/lib/support/workflow";
import { SummaryBar } from "./SummaryBar";
import { ProjectCard } from "./ProjectCard";
import { PipelineOverview } from "./PipelineOverview";
import { useProjectFilter } from "@/lib/store/project-filter";

interface DashboardViewProps {
  data: DashboardData;
  greeting: string;
  pipeline: PipelineCounts;
}

export function DashboardView({ data, greeting, pipeline }: DashboardViewProps) {
  const { tenantId } = useProjectFilter();

  const projects = tenantId
    ? data.projects.filter((p) => p.id === tenantId)
    : data.projects;

  const summary = tenantId
    ? {
        totalTickets: projects[0]?.ticketCount ?? 0,
        totalUnpaid: projects[0]?.unpaidTotal ?? 0,
        totalWeeklySeconds: projects[0]?.weeklySeconds ?? 0,
      }
    : data.summary;

  if (data.projects.length === 0) {
    return (
      <div className="p-6">
        <h2 className="mb-2 text-2xl font-semibold">{greeting}</h2>
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-medium">No projects yet</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Add your first project in Settings to get started.
          </p>
          <Link
            href="/settings"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="mb-1 text-2xl font-semibold">{greeting}</h2>
      <div className="mb-6">
        <SummaryBar summary={summary} />
      </div>

      <PipelineOverview counts={pipeline} />

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
