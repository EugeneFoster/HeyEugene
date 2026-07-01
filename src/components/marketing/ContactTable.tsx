import Link from "next/link";
import type { MarketingContact } from "@/lib/types";

export function ContactTable({ contacts }: { contacts: MarketingContact[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase text-[var(--text-secondary)]">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Tags</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Subscribed</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3">{c.name ?? "—"}</td>
              <td className="px-4 py-3">{c.email}</td>
              <td className="px-4 py-3">{c.company ?? "—"}</td>
              <td className="px-4 py-3">
                {c.tags?.map((t) => (
                  <span
                    key={t}
                    className="mr-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </td>
              <td className="px-4 py-3 text-[var(--text-secondary)]">
                {c.source ?? "—"}
              </td>
              <td className="px-4 py-3">
                {c.subscribed ? "✓" : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
