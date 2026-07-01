"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconTicket,
  IconFileInvoice,
  IconBulb,
  IconClock,
  IconRobot,
  IconMail,
  IconChartPie,
  IconSettings,
} from "@tabler/icons-react";
import type { Tenant } from "@/lib/types";
import { useProjectFilter } from "@/lib/store/project-filter";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarNavProps {
  tenants: Tenant[];
  newTicketCount?: number;
  unpaidInvoiceCount?: number;
}

export function SidebarNav({
  tenants,
  newTicketCount = 0,
  unpaidInvoiceCount = 0,
}: SidebarNavProps) {
  const pathname = usePathname();
  const { tenantId, setProject } = useProjectFilter();

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Dashboard",
      icon: <IconLayoutDashboard size={18} />,
    },
    {
      href: "/tickets",
      label: "Tickets",
      icon: <IconTicket size={18} />,
      badge: newTicketCount || undefined,
    },
    {
      href: "/invoices",
      label: "Invoices",
      icon: <IconFileInvoice size={18} />,
      badge: unpaidInvoiceCount || undefined,
    },
    { href: "/proposals", label: "Proposals", icon: <IconBulb size={18} /> },
    { href: "/time", label: "Time Log", icon: <IconClock size={18} /> },
    { href: "/ai", label: "AI Assistant", icon: <IconRobot size={18} /> },
    { href: "/marketing/contacts", label: "Marketing", icon: <IconMail size={18} /> },
    { href: "/ai-usage", label: "AI Usage", icon: <IconChartPie size={18} /> },
    { href: "/settings", label: "Settings", icon: <IconSettings size={18} /> },
  ];

  return (
    <nav className="flex flex-1 flex-col">
      <ul className="space-y-0.5 px-3">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto border-t border-white/10 px-3 pt-4 pb-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-gray-500">
          Projects
        </p>
        <ul className="space-y-0.5">
          {tenants.map((tenant) => (
            <li key={tenant.id}>
              <button
                type="button"
                onClick={() =>
                  setProject(
                    tenant.id,
                    tenant.name,
                    tenant.emoji,
                    tenant.color ?? "#3b82f6"
                  )
                }
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  tenantId === tenant.id
                    ? "bg-white/10 text-white border-l-2 border-white/40"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: tenant.color ?? "#3b82f6" }}
                />
                <span className="truncate">{tenant.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
