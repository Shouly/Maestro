import React from "react";
import { ThemeToggle } from "../ui/theme-toggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">Maestro</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container h-full py-4">
          {children}
        </div>
      </main>
    </div>
  );
} 