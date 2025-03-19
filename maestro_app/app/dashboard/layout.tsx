'use client';

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  
  // 用于控制面板折叠状态
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  
  // 移动设备视图下的面板控制
  const [activeMobilePanel, setActiveMobilePanel] = useState<'left' | 'main' | 'right'>('main');

  useEffect(() => {
    // 如果用户未登录且加载完成，重定向到登录页面
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // 响应式布局处理
  useEffect(() => {
    const handleResize = () => {
      // 在较窄屏幕上自动折叠面板
      if (window.innerWidth < 768) {
        setLeftPanelCollapsed(true);
        setRightPanelCollapsed(true);
      } else if (window.innerWidth > 1280) {
        // 在宽屏上展开面板
        setLeftPanelCollapsed(false);
        setRightPanelCollapsed(false);
      }
    };

    // 初始调整
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    // 移除认证cookie
    document.cookie = "maestro_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/auth/login');
  };

  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[rgb(var(--color-background))]">
        <div className="relative size-12">
          <div className="absolute inset-0 border-2 border-transparent border-t-[rgb(var(--color-primary))] rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-2 border-[rgba(var(--color-primary),0.2)] rounded-full"></div>
        </div>
      </div>
    );
  }

  // 如果没有用户，不渲染内容（重定向会在上面的useEffect中处理）
  if (!user) {
    return null;
  }

  // 返回响应式布局
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[rgb(var(--color-background))]">
      {/* 左侧面板 - 对话历史 */}
      <aside 
        className={cn(
          "h-full flex flex-col glass border-r border-[rgba(var(--color-border),0.5)]",
          "transition-all duration-[var(--transition-normal)] ease-in-out",
          leftPanelCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-64 opacity-100",
          "md:opacity-100", // 中等屏幕以上始终显示
          activeMobilePanel === 'left' ? "md:w-64 fixed md:relative z-30 w-full h-full" : "md:w-64"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b border-[rgba(var(--color-border),0.5)]">
          <h2 className="text-lg font-semibold">对话历史</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleLogout} title="退出登录" className="p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setLeftPanelCollapsed(true)} 
              className="md:flex hidden items-center justify-center p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors"
              aria-label="折叠左侧面板"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* 对话历史列表将在这里 */}
          <div className="space-y-2">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-[rgba(var(--color-border),0.2)]"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* 中间面板 - 活动聊天 */}
      <main className={cn(
        "flex-1 h-full overflow-hidden flex flex-col",
        "transition-all duration-[var(--transition-normal)] ease-in-out",
        activeMobilePanel !== 'main' && "hidden md:flex"
      )}>
        <div className="flex items-center p-2 md:p-4 gap-2 border-b border-[rgba(var(--color-border),0.5)]">
          <div className="md:hidden flex">
            <button 
              onClick={() => setActiveMobilePanel('left')} 
              className="p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors"
              aria-label="显示对话历史"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          
          {leftPanelCollapsed && (
            <button 
              onClick={() => setLeftPanelCollapsed(false)} 
              className="hidden md:flex items-center justify-center p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors"
              aria-label="展开左侧面板"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          
          <h1 className="text-lg font-semibold flex-1 text-center md:text-left">Maestro AI</h1>
          
          {rightPanelCollapsed && (
            <button 
              onClick={() => setRightPanelCollapsed(false)} 
              className="hidden md:flex items-center justify-center p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors"
              aria-label="展开右侧面板"  
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
          
          <div className="md:hidden flex">
            <button 
              onClick={() => setActiveMobilePanel('right')} 
              className="p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors"
              aria-label="显示工件"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </main>

      {/* 右侧面板 - 工件 */}
      <aside 
        className={cn(
          "h-full flex flex-col glass border-l border-[rgba(var(--color-border),0.5)]",
          "transition-all duration-[var(--transition-normal)] ease-in-out",
          rightPanelCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-64 opacity-100",
          "md:opacity-100", // 中等屏幕以上始终显示
          activeMobilePanel === 'right' ? "md:w-64 fixed md:relative z-30 right-0 w-full h-full" : "md:w-64"
        )}
      >
        <div className="p-4 flex justify-between items-center border-b border-[rgba(var(--color-border),0.5)]">
          <h2 className="text-lg font-semibold">工件</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => activeMobilePanel === 'right' ? setActiveMobilePanel('main') : setRightPanelCollapsed(true)} 
              className="p-2 rounded-md hover:bg-[rgba(var(--color-primary),0.1)] transition-colors"
              aria-label={activeMobilePanel === 'right' ? "返回主面板" : "折叠右侧面板"}
            >
              {activeMobilePanel === 'right' ? (
                <X className="h-5 w-5 md:hidden" />
              ) : (
                <Minimize2 className="h-4 w-4 hidden md:block" />
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* 工件列表将在这里 */}
          <div className="space-y-2">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-[rgba(var(--color-border),0.2)]"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
} 