"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { WeeklyHoursByProject } from "@/lib/queries";

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];

export function WeeklyHoursChart({ data }: { data: WeeklyHoursByProject[] }) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--text-secondary)]">
        No time logged this week yet.
      </p>
    );
  }

  const chartData = data.map((d) => ({
    name: `${d.emoji} ${d.name}`,
    hours: Math.round(d.hours * 100) / 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
        <XAxis type="number" unit="h" tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => [`${v}h`, "Hours"]} />
        <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
