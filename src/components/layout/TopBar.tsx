"use client";

import { ProjectFilter } from "./ProjectFilter";
import { NotificationBell } from "@/components/shared/NotificationBell";

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-sm">
      {title && (
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h1>
      )}
      <div className="ml-auto flex items-center gap-3">
        <NotificationBell />
        <ProjectFilter />
      </div>
    </header>
  );
}
