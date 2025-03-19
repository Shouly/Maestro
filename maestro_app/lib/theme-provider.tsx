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

// 使用系统样式配置
const applyThemeVariables = (theme: "dark" | "light") => {
  const root = document.documentElement;
  
  // 删除之前的主题类
  root.classList.remove("light", "dark");
  
  // 添加新的主题类
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.add("light");
  }
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

  // 更新系统主题
  const updateSystemTheme = () => {
    if (theme !== "system") return;
    
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    
    setResolvedTheme(systemTheme);
    applyThemeVariables(systemTheme);
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
    
    if (theme === "system" && enableSystem) {
      updateSystemTheme();
      return;
    }
    
    setResolvedTheme(theme as "dark" | "light");
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