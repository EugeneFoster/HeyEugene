import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { ContactTable } from "@/components/marketing/ContactTable";
import { getMarketingContacts } from "@/lib/queries";

export default async function MarketingContactsPage() {
  const contacts = await getMarketingContacts();

  return (
    <>
      <TopBar title="Marketing — Contacts" />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <nav className="flex gap-4 text-sm">
            <Link href="/marketing/contacts" className="font-medium text-blue-600">
              Contacts
            </Link>
            <Link href="/marketing/campaigns" className="text-[var(--text-secondary)] hover:text-blue-600">
              Campaigns
            </Link>
          </nav>
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Contact
          </button>
        </div>
        <ContactTable contacts={contacts} />
      </div>
    </>
  );
}
