import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary),0.5)] focus-visible:ring-offset-1 focus-visible:ring-offset-[rgb(var(--color-background))] aria-invalid:ring-[rgba(var(--color-error),0.2)] aria-invalid:border-[rgb(var(--color-error))] relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-[rgb(var(--color-primary))] text-white shadow-sm hover:bg-[rgb(var(--color-primary-dark))] active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        destructive:
          "bg-[rgb(var(--color-error))] text-white shadow-sm hover:bg-[rgba(var(--color-error),0.9)] active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        outline:
          "border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] shadow-sm hover:bg-[rgba(var(--color-foreground),0.05)] hover:text-[rgb(var(--color-primary))] active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        secondary:
          "bg-[rgba(var(--color-foreground),0.05)] text-[rgb(var(--color-foreground))] shadow-sm hover:bg-[rgba(var(--color-foreground),0.1)] active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        ghost:
          "hover:bg-[rgba(var(--color-foreground),0.05)] active:scale-[0.98] transition-transform duration-[var(--transition-fast)]",
        link: "text-[rgb(var(--color-primary))] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
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
  
  // 添加涟漪效果的处理函数
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.pointerEvents = 'none';
    
    button.appendChild(ripple);
    
    // 设置动画
    setTimeout(() => {
      ripple.style.width = '300px';
      ripple.style.height = '300px';
      ripple.style.opacity = '0';
      ripple.style.transition = 'all 0.6s ease-out';
      
      // 完成后删除
      setTimeout(() => {
        button.removeChild(ripple);
      }, 600);
    }, 10);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onClick) {
          props.onClick(e);
        }
        if (!asChild) {
          handleRipple(e);
        }
      }}
      {...props}
    />
  )
}

export { Button, buttonVariants }
