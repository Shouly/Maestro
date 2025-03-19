"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// 定义主题的CSS变量
const themes = {
  light: {
    "--color-background": "255 255 255",
    "--color-foreground": "26 26 26",
    "--color-foreground-muted": "100 100 100",
    "--color-card": "255 255 255",
    "--color-card-hover": "245 245 245",
    "--color-card-active": "240 240 240",
    "--color-border": "230 230 230",
    "--color-primary": "0 144 255",
    "--color-primary-dark": "0 114 204",
    "--color-error": "239 68 68",
    "--color-success": "34 197 94",
    "--color-warning": "245 158 11",
    "--radius-sm": "0.25rem",
    "--radius-md": "0.375rem",
    "--radius-lg": "0.5rem",
    "--radius-xl": "0.75rem",
    "--radius-2xl": "1rem",
    "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "--shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "--shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "--shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "--shadow-inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    "--transition-fast": "150ms",
    "--transition-normal": "250ms",
    "--transition-slow": "350ms",
  },
  dark: {
    "--color-background": "15 17 21",
    "--color-foreground": "242 242 242",
    "--color-foreground-muted": "180 180 180",
    "--color-card": "25 27 32",
    "--color-card-hover": "35 38 45",
    "--color-card-active": "45 48 55",
    "--color-border": "50 55 65",
    "--color-primary": "0 144 255",
    "--color-primary-dark": "77 178 255",
    "--color-error": "239 68 68",
    "--color-success": "34 197 94",
    "--color-warning": "245 158 11",
    "--radius-sm": "0.25rem",
    "--radius-md": "0.375rem",
    "--radius-lg": "0.5rem",
    "--radius-xl": "0.75rem",
    "--radius-2xl": "1rem",
    "--shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    "--shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    "--shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
    "--shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    "--shadow-inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
    "--transition-fast": "150ms",
    "--transition-normal": "250ms",
    "--transition-slow": "350ms",
  },
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 应用CSS变量到文档根元素
  const applyThemeVariables = (theme: "dark" | "light") => {
    const root = document.documentElement;
    const variables = themes[theme];
    
    Object.entries(variables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  };

  // 更新系统主题
  const updateSystemTheme = () => {
    if (theme !== "system") return;
    
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    
    setResolvedTheme(systemTheme);
    applyThemeVariables(systemTheme);
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(systemTheme);
  };

  // 监听系统主题变化
  useEffect(() => {
    if (!enableSystem) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      updateSystemTheme();
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [enableSystem, theme]);

  // 主题变化时更新DOM
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    
    if (theme === "system" && enableSystem) {
      updateSystemTheme();
      return;
    }
    
    setResolvedTheme(theme as "dark" | "light");
    root.classList.add(theme);
    applyThemeVariables(theme as "dark" | "light");
    
    // 添加过渡动画
    if (isTransitioning) {
      root.classList.add("theme-transitioning");
      setTimeout(() => {
        root.classList.remove("theme-transitioning");
        setIsTransitioning(false);
      }, 500);
    }
  }, [theme, enableSystem, isTransitioning]);

  // 从localStorage加载主题
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else if (enableSystem) {
        setTheme("system");
      }
    } catch (e) {
      console.error(e);
    }
  }, [enableSystem]);

  const value = {
    theme,
    resolvedTheme,
    setTheme: (theme: Theme) => {
      setIsTransitioning(true);
      setTheme(theme);
      try {
        localStorage.setItem("theme", theme);
      } catch (e) {
        console.error(e);
      }
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}; 