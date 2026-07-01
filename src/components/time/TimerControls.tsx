"use client";

import { useEffect, useState } from "react";
import { useTimerStore } from "@/lib/store/timer";
import { formatDuration } from "@/lib/utils/format";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TimerControlsProps {
  tenantId: string;
  tenantName: string;
  tenantEmoji: string;
  ticketId?: string | null;
  ticketTitle?: string | null;
  description?: string | null;
}

export function TimerControls({
  tenantId,
  tenantName,
  tenantEmoji,
  ticketId = null,
  ticketTitle = null,
  description = null,
}: TimerControlsProps) {
  const router = useRouter();
  const { activeTimer, setActiveTimer, clearActiveTimer } = useTimerStore();
  const [elapsed, setElapsed] = useState(0);
  const isActive =
    activeTimer?.tenantId === tenantId &&
    (ticketId ? activeTimer.ticketId === ticketId : true);

  useEffect(() => {
    if (!isActive || !activeTimer) return;
    const tick = () => {
      setElapsed(
        Math.floor(
          (Date.now() - new Date(activeTimer.startedAt).getTime()) / 1000
        )
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isActive, activeTimer]);

  async function startTimer() {
    const res = await fetch("/api/time/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenant_id: tenantId,
        ticket_id: ticketId,
        description: ticketTitle ?? description,
      }),
    });
    const data = await res.json();

    setActiveTimer({
      entryId: data.id ?? `local-${Date.now()}`,
      tenantId,
      tenantName,
      tenantEmoji,
      ticketId: ticketId ?? null,
      ticketTitle: ticketTitle ?? null,
      startedAt: data.started_at ?? new Date().toISOString(),
      description: description ?? ticketTitle,
    });
    toast.success("Timer started");
    router.refresh();
  }

  async function stopTimer() {
    if (!activeTimer) return;

    await fetch("/api/time/stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeTimer.entryId }),
    });

    clearActiveTimer();
    toast.success("Timer stopped");
    router.refresh();
  }

  if (isActive) {
    return (
      <button
        type="button"
        onClick={stopTimer}
        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
      >
        <IconPlayerStop size={16} />
        Stop ({formatDuration(elapsed)})
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startTimer}
      className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
    >
      <IconPlayerPlay size={16} />
      Start Timer
    </button>
  );
}
