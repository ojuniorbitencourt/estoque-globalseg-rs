"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    // Ensure value is a number and within bounds
    const safeValue = typeof value === "number" ? Math.min(Math.max(value, 0), max) : 0
    const percentage = (safeValue / max) * 100

    return (
      <div
        ref={ref}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full flex-1 bg-primary transition-all")}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )
  },
)

Progress.displayName = "Progress"

export { Progress }
