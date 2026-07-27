/**
 * Step-Progress-Indicator für den Multi-Step-Konfigurator (Bildungsurlaub-Rechner).
 * Zeigt aktuellen Schritt, macht Fortschritt visuell greifbar → höhere Completion-Rate.
 */
import { Check } from "lucide-react";

interface StepProgressProps {
  steps: { label: string; done: boolean }[];
  currentIndex: number; // 0-basiert
}

export const StepProgress = ({ steps, currentIndex }: StepProgressProps) => {
  return (
    <div className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const isDone = step.done;
          const isCurrent = idx === currentIndex;
          return (
            <li key={idx} className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0
                    ${isDone ? "bg-primary text-primary-foreground" : ""}
                    ${isCurrent && !isDone ? "bg-primary/20 text-primary ring-2 ring-primary" : ""}
                    ${!isDone && !isCurrent ? "bg-muted text-muted-foreground" : ""}
                  `}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                <span
                  className={`hidden sm:inline text-xs ${
                    isDone || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mt-2 h-0.5 w-full ${isDone ? "bg-primary" : "bg-muted"}`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
