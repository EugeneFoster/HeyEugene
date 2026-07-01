"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelative } from "@/lib/utils/format";

const NOTIFICATION_EMOJI: Record<string, string> = {
  ticket_created: "🆕",
  ticket_status_changed: "🔄",
  proposal_pending: "📝",
  proposal_approved: "✅",
  proposal_rejected: "❌",
  invoice_sent: "🧾",
  invoice_paid: "💰",
  invoice_payment_pending: "💳",
  task_completed: "🎉",
  new_message: "💬",
};

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  message: string | null;
  ticket_id: string | null;
  invoice_id: string | null;
  read: boolean;
  created_at: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = (await res.json()) as {
        notifications: NotificationRow[];
        unread: number;
      };
      setItems(data.notifications ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 30_000);
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function markAll() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    await load();
  }

  async function handleClick(n: NotificationRow) {
    setOpen(false);
    if (!n.read) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [n.id] }),
      });
    }
    if (n.ticket_id) router.push(`/tickets/${n.ticket_id}`);
    else if (n.invoice_id) router.push(`/invoices/${n.invoice_id}`);
    await load();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative grid h-9 w-9 place-items-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
          <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
        </svg>
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAll}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet.
              </p>
            ) : (
              <ul>
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(n)}
                      className={`flex w-full items-start gap-2 px-4 py-3 text-left hover:bg-gray-50 ${
                        n.read ? "" : "bg-blue-50/50"
                      }`}
                    >
                      <span className="mt-0.5 text-base leading-none">
                        {NOTIFICATION_EMOJI[n.type] ?? "🔔"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{n.title}</span>
                        {n.message ? (
                          <span className="mt-0.5 block truncate text-xs text-gray-500">
                            {n.message}
                          </span>
                        ) : null}
                        <span className="mt-0.5 block text-[11px] text-gray-400">
                          {formatRelative(n.created_at)}
                        </span>
                      </span>
                      {!n.read ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
