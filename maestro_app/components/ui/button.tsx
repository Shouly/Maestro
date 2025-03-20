import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90",
        destructive:
          "bg-error text-white hover:bg-error/90",
        outline:
          "border-2 border-border bg-background hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
        secondary:
          "bg-primary/10 text-primary hover:bg-primary/20",
        ghost:
          "text-foreground hover:bg-muted",
        link: 
          "text-primary underline-offset-4 hover:underline hover:scale-100 active:scale-100",
        gradient:
          "bg-gradient-to-r from-primary to-info text-white hover:brightness-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-10 w-10",
      },
      block: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  block?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, block, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, className }))}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <span className="size-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
            {props.children}
          </>
        ) : (
          props.children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
