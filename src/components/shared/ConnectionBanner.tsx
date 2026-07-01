"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface StatusPayload {
  ok: boolean;
  wrongProject?: boolean;
  supabaseHost?: string | null;
  expectedHost?: string;
}

export function ConnectionBanner() {
  const [status, setStatus] = useState<StatusPayload | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((data: StatusPayload) => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  if (!status || status.ok) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-sm text-amber-900">
      <strong>Database not connected.</strong> HeyEugene is not reading from
      MikesCRM
      {status.supabaseHost ? ` (${status.supabaseHost})` : ""}. Tickets from
      Mike&apos;s Place won&apos;t appear until Railway variables match{" "}
      <code className="rounded bg-amber-100 px-1">mikesplace-dev</code>.{" "}
      <Link href="/settings" className="font-medium underline">
        Settings
      </Link>
      {" · "}
      <a
        href="https://railway.com/project/22508b01-db13-40ac-b5cb-419d747f5c1d"
        className="font-medium underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Fix on Railway
      </a>
    </div>
  );
}
