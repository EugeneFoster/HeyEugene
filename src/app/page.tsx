import { TopBar } from "@/components/layout/TopBar";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { getDashboardData } from "@/lib/queries/dashboard";
import { getGreeting } from "@/lib/utils/format";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <>
      <TopBar />
      <DashboardView data={data} greeting={`${getGreeting()}, Eugene`} />
    </>
  );
}
