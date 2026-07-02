import { Sidebar } from "@/components/layout/Sidebar";
import { RealtimeProvider } from "@/components/shared/RealtimeProvider";
import { ConnectionBanner } from "@/components/shared/ConnectionBanner";
import { getTenants, getDashboardStats } from "@/lib/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenants, stats] = await Promise.all([
    getTenants(),
    getDashboardStats(),
  ]);

  return (
    <RealtimeProvider>
      <Sidebar
        tenants={tenants}
        newTicketCount={stats.newTickets}
        unpaidInvoiceCount={stats.unpaidInvoices}
      />
      <main className="ml-60 min-h-screen">
        <ConnectionBanner />
        {children}
      </main>
    </RealtimeProvider>
  );
}
