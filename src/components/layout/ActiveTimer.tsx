"use client";

import { useEffect, useState } from "react";
import { useTimerStore } from "@/lib/store/timer";
import { formatDuration } from "@/lib/utils/format";

export function ActiveTimer() {
  const activeTimer = useTimerStore((s) => s.activeTimer);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeTimer) return;

    const tick = () => {
      const start = new Date(activeTimer.startedAt).getTime();
      setElapsed(Math.floor((Date.now() - start) / 1000));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [activeTimer]);

  if (!activeTimer) return null;

  return (
    <div className="mx-3 mb-4 rounded-lg bg-[var(--bg-secondary)] p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse-dot" />
        <span className="text-xs font-medium text-gray-300">Active timer</span>
      </div>
      <div className="font-mono text-lg font-semibold text-white">
        {formatDuration(elapsed)}
      </div>
      <div className="mt-1 truncate text-xs text-gray-400">
        {activeTimer.tenantEmoji} {activeTimer.ticketTitle ?? activeTimer.description ?? "No task"}
      </div>
    </div>
  );
}
