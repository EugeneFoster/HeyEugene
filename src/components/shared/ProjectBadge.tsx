import type { Tenant } from "@/lib/types";

interface ProjectBadgeProps {
  tenant?: Pick<Tenant, "emoji" | "name" | "color"> | null;
  size?: "sm" | "md";
}

export function ProjectBadge({ tenant, size = "sm" }: ProjectBadgeProps) {
  if (!tenant) return <span className="text-gray-400">—</span>;

  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const dotSize = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700 ${textSize}`}
    >
      <span
        className={`${dotSize} rounded-full`}
        style={{ backgroundColor: tenant.color ?? "#3b82f6" }}
      />
      <span>{tenant.name}</span>
    </span>
  );
}
