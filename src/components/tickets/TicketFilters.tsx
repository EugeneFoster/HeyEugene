"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface TicketFiltersProps {
  types: string[];
  statuses: string[];
}

export function TicketFilters({ types, statuses }: TicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") params.delete(key);
      else params.set(key, value);
      router.push(`/tickets?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <select
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        value={searchParams.get("type") ?? "all"}
        onChange={(e) => update("type", e.target.value)}
      >
        <option value="all">Type: All</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        value={searchParams.get("status") ?? "all"}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="all">Status: All</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>

      <input
        type="search"
        placeholder="Search..."
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
        defaultValue={searchParams.get("q") ?? ""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            update("q", (e.target as HTMLInputElement).value || "all");
          }
        }}
      />
    </div>
  );
}
