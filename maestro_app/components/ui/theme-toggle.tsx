"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [transitioning, setTransitioning] = React.useState(false);

  const toggleTheme = () => {
    if (transitioning) return;
    
    setTransitioning(true);
    
    // 添加过渡效果延时，使动画更流畅
    setTheme(
      theme === "light" ? "dark" : 
      theme === "dark" ? "system" : "light"
    );
    
    // 动画完成后重置状态
    setTimeout(() => {
      setTransitioning(false);
    }, 500);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "theme-toggle",
        "flex items-center justify-center",
        "p-2 rounded-md transition-all duration-[var(--transition-normal)]",
        "hover:bg-[rgba(var(--color-foreground),0.1)] focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary),0.5)]",
        transitioning ? "scale-90" : "scale-100",
        className
      )}
      aria-label="切换主题"
      disabled={transitioning}
    >
      <div className="relative size-5">
        {theme === "dark" ? (
          <Moon 
            className={cn(
              "absolute inset-0 size-5 transition-all duration-[var(--transition-normal)]",
              transitioning ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
            )} 
          />
        ) : theme === "light" ? (
          <Sun 
            className={cn(
              "absolute inset-0 size-5 transition-all duration-[var(--transition-normal)]",
              transitioning ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
            )} 
          />
        ) : (
          <div className="size-5">
            <Sun 
              className={cn(
                "absolute inset-0 size-5 transition-all duration-[var(--transition-normal)] dark:opacity-0 dark:scale-50 opacity-100 scale-100"
              )}
            />
            <Moon 
              className={cn(
                "absolute inset-0 size-5 transition-all duration-[var(--transition-normal)] dark:opacity-100 dark:scale-100 opacity-0 scale-50"
              )}
            />
          </div>
        )}
      </div>
    </button>
  );
} 