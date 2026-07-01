import Link from "next/link";
import { ActiveTimer } from "./ActiveTimer";
import { SidebarNav } from "./SidebarNav";
import type { Tenant } from "@/lib/types";

interface SidebarProps {
  tenants: Tenant[];
  newTicketCount?: number;
  unpaidInvoiceCount?: number;
}

export function Sidebar({
  tenants,
  newTicketCount,
  unpaidInvoiceCount,
}: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-[var(--sidebar-bg)] text-white">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <Link href="/" className="text-lg font-semibold">
          👋 HeyEugene
        </Link>
      </div>

      <ActiveTimer />

      <SidebarNav
        tenants={tenants}
        newTicketCount={newTicketCount}
        unpaidInvoiceCount={unpaidInvoiceCount}
      />
    </aside>
  );
}
