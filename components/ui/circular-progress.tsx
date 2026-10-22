import type React from "react";
import { cn } from "@/lib/utils";

export function CircularProgress({
  className,
  value,
  ...props
}: React.ComponentProps<"svg"> & { value: number }): React.ReactElement {
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clamped}
      className={cn("size-5 -rotate-90", className)}
      data-slot="circular-progress"
      role="progressbar"
      viewBox="0 0 18 18"
      {...props}
    >
      <circle
        className="text-input"
        cx="9"
        cy="9"
        data-slot="circular-progress-track"
        fill="none"
        r={radius}
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle
        className="text-primary transition-[stroke-dashoffset] duration-500"
        cx="9"
        cy="9"
        data-slot="circular-progress-indicator"
        fill="none"
        r={radius}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}
