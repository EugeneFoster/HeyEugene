import type { WorkflowStep } from "@/lib/support/workflow";

interface WorkflowPipelineProps {
  steps: WorkflowStep[];
  compact?: boolean;
}

export function WorkflowPipeline({ steps, compact }: WorkflowPipelineProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {steps.map((step, i) => (
          <div key={step.id} className="flex min-w-0 flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  step.state === "complete"
                    ? "bg-green-600 text-white"
                    : step.state === "current"
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : step.state === "blocked"
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.state === "complete" ? "✓" : i + 1}
              </span>
              <span
                className={`max-w-[5.5rem] truncate text-center text-[10px] font-medium uppercase tracking-wide ${
                  step.state === "current"
                    ? "text-blue-700"
                    : step.state === "complete"
                      ? "text-green-700"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 ? (
              <div
                className={`mb-4 h-0.5 min-w-[12px] flex-1 ${
                  step.state === "complete" ? "bg-green-300" : "bg-gray-200"
                }`}
              />
            ) : null}
          </div>
        ))}
      </div>
      {!compact ? (
        <p className="text-sm text-[var(--text-secondary)]">
          {steps.find((s) => s.state === "current")?.hint ??
            steps.find((s) => s.state === "blocked")?.hint ??
            "Workflow complete."}
        </p>
      ) : null}
    </div>
  );
}
