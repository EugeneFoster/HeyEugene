import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { getMarketingCampaigns } from "@/lib/queries";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatRelative } from "@/lib/utils/format";

export default async function MarketingCampaignsPage() {
  const campaigns = await getMarketingCampaigns();

  return (
    <>
      <TopBar title="Marketing — Campaigns" />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <nav className="flex gap-4 text-sm">
            <Link href="/marketing/contacts" className="text-[var(--text-secondary)] hover:text-blue-600">
              Contacts
            </Link>
            <Link href="/marketing/campaigns" className="font-medium text-blue-600">
              Campaigns
            </Link>
          </nav>
          <Link
            href="/marketing/campaigns/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Campaign
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-[var(--text-secondary)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Opened</th>
                <th className="px-4 py-3">Clicked</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3">{c.stats_sent || "—"}</td>
                  <td className="px-4 py-3">{c.stats_opened || "—"}</td>
                  <td className="px-4 py-3">{c.stats_clicked || "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {c.sent_at
                      ? formatRelative(c.sent_at)
                      : c.scheduled_at
                        ? formatDate(c.scheduled_at)
                        : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
