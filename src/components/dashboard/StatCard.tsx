import Link from "next/link";

interface StatCardProps {
  label: string;
  value: string;
  href: string;
}

export function StatCard({ label, value, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <p className="text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{label}</p>
    </Link>
  );
}
