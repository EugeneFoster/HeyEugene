import Link from "next/link";
import type { AttentionItem } from "@/lib/queries";

const severityDot: Record<string, string> = {
  danger: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

export function NeedsAttention({ items }: { items: AttentionItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        Nothing needs attention right now.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-start gap-2 text-sm hover:text-blue-600"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[item.severity]}`}
              />
              {item.message}
            </Link>
          ) : (
            <div className="flex items-start gap-2 text-sm">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityDot[item.severity]}`}
              />
              {item.message}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
