import { TopBar } from "@/components/layout/TopBar";
import { UsageCharts } from "@/components/ai-usage/UsageCharts";
import { getAiUsage } from "@/lib/queries";
import { formatCurrency, formatRelative } from "@/lib/utils/format";

export default async function AiUsagePage() {
  const usage = await getAiUsage();

  return (
    <>
      <TopBar title="AI Token Usage" />
      <div className="p-6">
        <UsageCharts usage={usage} />

        {usage.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-[var(--text-secondary)]">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Tokens</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {usage.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50">
                    <td className="px-4 py-3">
                      {u.tenant?.emoji} {u.tenant?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{u.model}</td>
                    <td className="px-4 py-3">{u.purpose ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {u.input_tokens + u.output_tokens}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatCurrency(u.cost_usd ?? 0, "USD")}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {formatRelative(u.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
