import React from "react";
import { ThemeToggle } from "../ui/theme-toggle";
import { Link, useLocation } from "react-router-dom";
import { Settings } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">
              <Link to="/">Maestro</Link>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/settings" 
              className={`p-2 rounded-md hover:bg-accent ${
                location.pathname === "/settings" ? "bg-accent" : ""
              }`}
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">设置</span>
            </Link>
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