import Link from "next/link";
import { TopBar } from "@/components/layout/TopBar";
import { CampaignEditor } from "@/components/marketing/CampaignEditor";

export default function NewCampaignPage() {
  return (
    <>
      <TopBar title="New Campaign" />
      <div className="p-6">
        <Link
          href="/marketing/campaigns"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to campaigns
        </Link>
        <CampaignEditor />
      </div>
    </>
  );
}
