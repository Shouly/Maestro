import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none overflow-hidden relative",
  {
    variants: {
      variant: {
        default:
          "bg-[#0090FF] text-white hover:bg-[#0080E0] active:scale-[0.98] shadow-sm",
        destructive:
          "bg-error text-white hover:bg-error/90 active:scale-[0.98] shadow-sm",
        outline:
          "border border-border bg-background hover:bg-muted hover:text-[#0090FF] active:scale-[0.98] shadow-sm",
        secondary:
          "bg-[rgba(0,144,255,0.1)] text-[#0090FF] hover:bg-[rgba(0,144,255,0.2)] active:scale-[0.98] shadow-sm",
        ghost:
          "text-foreground hover:bg-muted active:scale-[0.98]",
        link: 
          "text-[#0090FF] underline-offset-4 hover:underline",
        gradient:
          "text-white bg-gradient-to-r from-[#0090FF] to-[#0070DD] hover:brightness-105 active:scale-[0.98] shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
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
    
    // 创建涟漪效果函数
    const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%) scale(0);
        animation: ripple-effect 0.6s ease-out forwards;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
      `;
      
      // 创建并添加动画
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple-effect {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(15);
            opacity: 0;
          }
        }
      `;
      
      document.head.appendChild(style);
      button.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
        style.remove();
      }, 600);
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, className }))}
        ref={ref}
        {...props}
        onClick={(e) => {
          if (!loading) {
            handleRipple(e);
            props.onClick?.(e);
          }
        }}
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
