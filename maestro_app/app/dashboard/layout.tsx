import { ReactNode } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <SignedIn>
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-900">
          {/* 左侧面板 - 对话历史 */}
          <aside className="w-64 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col bg-white dark:bg-slate-950">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">对话历史</h2>
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
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 