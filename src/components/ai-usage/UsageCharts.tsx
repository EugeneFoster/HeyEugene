"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import type { AiUsage } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/format";

const COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b"];

interface UsageChartsProps {
  usage: AiUsage[];
}

export function UsageCharts({ usage }: UsageChartsProps) {
  const totalCost = usage.reduce((s, u) => s + (u.cost_usd ?? 0), 0);
  const totalInput = usage.reduce((s, u) => s + u.input_tokens, 0);
  const totalOutput = usage.reduce((s, u) => s + u.output_tokens, 0);

  const byProject = new Map<string, { name: string; cost: number }>();
  const byPurpose = new Map<string, number>();

  for (const u of usage) {
    const key = u.tenant_id;
    const name = u.tenant?.name ?? "Unassigned";
    const existing = byProject.get(key);
    byProject.set(key, {
      name,
      cost: (existing?.cost ?? 0) + (u.cost_usd ?? 0),
    });
    const purpose = u.purpose ?? "other";
    byPurpose.set(purpose, (byPurpose.get(purpose) ?? 0) + (u.cost_usd ?? 0));
  }

  const projectData = [...byProject.values()].map((p) => ({
    name: p.name,
    value: Math.round(p.cost * 100) / 100,
  }));

  const purposeData = [...byPurpose.entries()].map(([name, cost]) => ({
    name: name.replace(/_/g, " "),
    cost: Math.round(cost * 100) / 100,
  }));

  if (usage.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--text-secondary)]">
        No AI usage recorded yet. Use the AI Assistant to start tracking.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total cost" value={formatCurrency(totalCost, "USD")} />
        <Stat label="Requests" value={String(usage.length)} />
        <Stat label="Input tokens" value={totalInput.toLocaleString()} />
        <Stat label="Output tokens" value={totalOutput.toLocaleString()} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="By Project">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={projectData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {projectData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v), "USD")} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="By Purpose">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={purposeData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v), "USD")} />
              <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold uppercase text-[var(--text-secondary)]">
        {title}
      </h3>
      {children}
    </div>
  );
}
