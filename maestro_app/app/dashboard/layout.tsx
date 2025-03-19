'use client';

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 如果用户未登录且加载完成，重定向到登录页面
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    // 移除认证cookie
    document.cookie = "maestro_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/auth/login');
  };

  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0090FF]"></div>
      </div>
    );
  }

  // 如果没有用户，不渲染内容（重定向会在上面的useEffect中处理）
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
      {/* 左侧面板 - 对话历史 */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col bg-white dark:bg-slate-950">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">对话历史</h2>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="退出登录">
            <LogOut className="h-5 w-5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* 对话历史列表将在这里 */}
        </div>
      </aside>

      {/* 中间面板 - 活动聊天 */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </main>

      {/* 右侧面板 - 工件 */}
      <aside className="w-64 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col bg-white dark:bg-slate-950">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">工件</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* 工件列表将在这里 */}
        </div>
      </aside>
    </div>
  );
} 