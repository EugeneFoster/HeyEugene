import { TopBar } from "@/components/layout/TopBar";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/lib/queries/dashboard";
import { getTickets } from "@/lib/queries";
import { countPipeline } from "@/lib/support/workflow";
import { getGreeting } from "@/lib/utils/format";

export default async function DashboardPage() {
  const [data, tickets] = await Promise.all([
    getDashboardData(),
    getTickets(),
  ]);
  const pipeline = countPipeline(tickets);

  return (
    <>
      <TopBar />
      <DashboardView
        data={data}
        greeting={`${getGreeting()}, Eugene`}
        pipeline={pipeline}
      />
    </>
  );
}
