'use client';

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
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
        <div className="animate-pulse" style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "9999px",
          borderTop: `2px solid rgb(var(--color-primary))`,
          borderBottom: `2px solid rgb(var(--color-primary))`,
        }}></div>
      </div>
    );
  }

  // 如果没有用户，不渲染内容（重定向会在上面的useEffect中处理）
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* 左侧面板 - 对话历史 */}
      <aside className="w-64 h-full flex flex-col glass" style={{
        borderRight: `1px solid rgba(var(--color-border), 0.5)`
      }}>
        <div className="p-4 flex justify-between items-center" style={{
          borderBottom: `1px solid rgba(var(--color-border), 0.5)`
        }}>
          <h2 className="text-lg font-semibold">对话历史</h2>
          <button onClick={handleLogout} title="退出登录" className="btn-ghost p-2">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* 对话历史列表将在这里 */}
          <div className="space-y-2">
            {/* 未来可添加对话历史列表 */}
          </div>
        </div>
      </aside>

      {/* 中间面板 - 活动聊天 */}
      <main className="flex-1 h-full overflow-hidden">
        {children}
      </main>

      {/* 右侧面板 - 工件 */}
      <aside className="w-64 h-full flex flex-col glass" style={{
        borderLeft: `1px solid rgba(var(--color-border), 0.5)`
      }}>
        <div className="p-4" style={{
          borderBottom: `1px solid rgba(var(--color-border), 0.5)`
        }}>
          <h2 className="text-lg font-semibold">工件</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* 工件列表将在这里 */}
          <div className="space-y-2">
            {/* 未来可添加工件列表 */}
          </div>
        </div>
      </aside>
    </div>
  );
} 