import { TopBar } from "@/components/layout/TopBar";
import { ProposalEditor } from "@/components/proposals/ProposalEditor";
import { getTenants } from "@/lib/queries";

interface PageProps {
  searchParams: Promise<{ ticket?: string }>;
}

export default async function NewProposalPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tenants = await getTenants();

  return (
    <>
      <TopBar title="New Proposal" />
      <div className="p-6">
        <ProposalEditor tenants={tenants} ticketId={params.ticket} />
      </div>
    </>
  );
}
