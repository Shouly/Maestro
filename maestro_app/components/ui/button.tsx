import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 overflow-hidden relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-background))]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-sm hover:bg-primary-dark active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        destructive:
          "bg-error text-white shadow-sm hover:bg-[rgba(var(--color-error),0.9)] active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        outline:
          "border border-border bg-base shadow-sm hover:bg-muted hover:text-primary active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        secondary:
          "bg-primary-10 text-primary shadow-sm hover:bg-primary-20 active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        ghost:
          "bg-transparent text-base hover:bg-muted active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        link: 
          "text-primary bg-transparent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  
  // 创建涟漪效果函数
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.animation = 'ripple-effect 0.8s ease-out forwards';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // 创建并添加动画
    const keyframes = `
      @keyframes ripple-effect {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
    `;
    
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
      style.remove();
    }, 800);
  };
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      onClick={(e) => {
        handleRipple(e);
        props.onClick?.(e);
      }}
    />
  )
}

export { Button, buttonVariants }
