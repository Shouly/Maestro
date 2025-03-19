"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(
      theme === "light" ? "dark" : 
      theme === "dark" ? "system" : "light"
    );
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn("theme-toggle", className)}
      aria-label="切换主题"
      style={{
        padding: "0.5rem",
        borderRadius: "var(--radius-md)",
        transition: "background-color 0.2s",
      }}
    >
      {theme === "dark" ? (
        <Moon style={{ width: "1.25rem", height: "1.25rem" }} />
      ) : theme === "light" ? (
        <Sun style={{ width: "1.25rem", height: "1.25rem" }} />
      ) : (
        <div style={{ position: "relative", width: "1.25rem", height: "1.25rem" }}>
          <Sun 
            style={{ 
              position: "absolute",
              width: "1.25rem", 
              height: "1.25rem",
              transition: "all 0.2s"
            }} 
          />
          <Moon 
            style={{ 
              position: "absolute",
              width: "1.25rem", 
              height: "1.25rem",
              opacity: 0,
              transition: "all 0.2s"
            }} 
          />
        </div>
      )}
    </button>
  );
} 