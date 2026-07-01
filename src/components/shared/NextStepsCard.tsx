import Link from "next/link";

interface NextStepsCardProps {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}

export function NextStepsCard({
  title,
  body,
  actionLabel,
  actionHref,
}: NextStepsCardProps) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
        What happens next
      </p>
      <p className="mt-1 font-medium text-[var(--text-primary)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{body}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
