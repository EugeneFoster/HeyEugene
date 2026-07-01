import type { Tenant } from "@/lib/types";

interface ProjectBadgeProps {
  tenant?: Pick<Tenant, "emoji" | "name"> | null;
  size?: "sm" | "md";
}

export function ProjectBadge({ tenant, size = "sm" }: ProjectBadgeProps) {
  if (!tenant) return <span className="text-gray-400">—</span>;

  const textSize = size === "sm" ? "text-xs" : "text-sm";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 ${textSize}`}
    >
      <span>{tenant.emoji}</span>
      <span>{tenant.name}</span>
    </span>
  );
}
