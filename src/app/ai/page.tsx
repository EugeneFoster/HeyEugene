import { TopBar } from "@/components/layout/TopBar";
import { ChatInterface } from "@/components/ai/ChatInterface";
import { getTenants } from "@/lib/queries";

export default async function AiPage() {
  const tenants = await getTenants();

  return (
    <>
      <TopBar title="AI Assistant" />
      <div className="p-6">
        <ChatInterface tenants={tenants} />
      </div>
    </>
  );
}
