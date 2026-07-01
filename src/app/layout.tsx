import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { RealtimeProvider } from "@/components/shared/RealtimeProvider";
import { ConnectionBanner } from "@/components/shared/ConnectionBanner";
import {
  getTenants,
  getDashboardStats,
} from "@/lib/queries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata = {
  title: "HeyEugene — Developer Dashboard",
  description: "Personal CRM for managing client projects",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tenants, stats] = await Promise.all([
    getTenants(),
    getDashboardStats(),
  ]);

  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full antialiased">
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
          <Toaster position="bottom-right" richColors />
        </RealtimeProvider>
      </body>
    </html>
  );
}
