import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, loading, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border-2 bg-background/50 backdrop-blur px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground/70",
            "focus-visible:outline-none focus-visible:border-primary/20 focus-visible:ring-4 focus-visible:ring-primary/10",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            error && "border-error/50 focus-visible:border-error/50 focus-visible:ring-error/10 placeholder:text-error/50",
            loading && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {loading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="size-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
