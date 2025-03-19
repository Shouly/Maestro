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
            "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            error && "border-destructive focus-visible:ring-destructive",
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
