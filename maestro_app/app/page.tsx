'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    setClientReady(true);
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-slate-800 dark:text-white">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-[#0090FF]">
            Maestro
          </span> AI
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          统一界面连接多种AI模型，简化日常AI交互。
        </p>

        <div className="flex justify-center gap-4 mt-8">
          {clientReady && !isLoading && !user ? (
            <>
              <Button asChild className="bg-[#0090FF] hover:bg-blue-600 px-8 py-6 text-lg">
                <Link href="/auth/login">登录</Link>
              </Button>
              <Button asChild className="bg-slate-800 hover:bg-slate-700 px-8 py-6 text-lg dark:bg-slate-700 dark:hover:bg-slate-600">
                <Link href="/auth/register">注册</Link>
              </Button>
            </>
          ) : clientReady && !isLoading && user ? (
            <Button asChild className="bg-[#0090FF] hover:bg-blue-600 px-8 py-6 text-lg">
              <Link href="/dashboard">进入控制台</Link>
            </Button>
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0090FF]"></div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">多种AI模型</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              支持OpenAI、Anthropic等多种模型，只需提供您的API密钥。
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">云同步功能</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              聊天历史与设置跨设备无缝同步，随时随地恢复工作。
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">MCP服务器集成</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              支持自定义工具扩展，增强AI交互能力。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
