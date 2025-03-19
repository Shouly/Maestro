"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";

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

  // 获取当前主题对应的图标和下一个主题的名称
  const getThemeInfo = () => {
    switch (theme) {
      case "light":
        return {
          icon: Sun,
          label: "浅色模式",
          nextTheme: "暗色模式"
        };
      case "dark":
        return {
          icon: Moon,
          label: "暗色模式",
          nextTheme: "跟随系统"
        };
      case "system":
      default:
        return {
          icon: Monitor,
          label: "跟随系统",
          nextTheme: "浅色模式"
        };
    }
  };

  const { icon: Icon, label, nextTheme } = getThemeInfo();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "theme-toggle",
        "relative overflow-hidden flex items-center justify-center",
        "h-9 w-9 rounded-md transition-all duration-[var(--transition-normal)]",
        "bg-transparent hover:bg-[rgba(var(--color-foreground),0.05)]", 
        "focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary),0.5)] focus-visible:outline-none",
        transitioning ? "scale-90" : "scale-100",
        className
      )}
      aria-label={`切换主题，当前: ${label}, 点击切换到${nextTheme}`}
      disabled={transitioning}
      title={`切换主题 (${label})`}
    >
      <span className="sr-only">{label}</span>
      
      {/* 涟漪效果 */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-md">
        <span 
          className={cn(
            "absolute inset-0 -z-10 transform origin-center transition-all duration-500 ease-out",
            transitioning ? "scale-100 opacity-10" : "scale-0 opacity-0"
          )}
          style={{
            backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.2)" : 
                            theme === "light" ? "rgba(0, 0, 0, 0.1)" : 
                            "rgba(var(--color-primary), 0.1)"
          }}
        />
      </span>
      
      {/* 主题图标 */}
      <div className="relative size-5">
        {/* 当前主题图标 */}
        <Icon 
          className={cn(
            "absolute inset-0 size-5 transition-all duration-[var(--transition-normal)]",
            transitioning ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          )}
        />
        
        {/* 下一个主题图标 (仅在过渡期间显示) */}
        {transitioning && (
          <span 
            className={cn(
              "absolute inset-0 size-5 transition-all duration-[var(--transition-normal)]",
              "opacity-100 rotate-0 scale-100"
            )}
          >
            {theme === "light" ? <Moon className="size-5" /> : 
             theme === "dark" ? <Monitor className="size-5" /> : 
             <Sun className="size-5" />}
          </span>
        )}
      </div>
    </button>
  );
} 