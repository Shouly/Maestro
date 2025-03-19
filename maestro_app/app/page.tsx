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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-[var(--color-background)] to-[var(--color-muted)] p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-[var(--color-foreground)]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)]">
            Maestro
          </span> AI
        </h1>
        <p className="text-xl text-[var(--color-muted-foreground)]">
          统一界面连接多种AI模型，简化日常AI交互。
        </p>

        <div className="flex justify-center gap-4 mt-8">
          {clientReady && !isLoading && !user ? (
            <>
              <Button asChild className="bg-primary hover:bg-primary-600 px-8 py-6 text-lg">
                <Link href="/auth/login">登录</Link>
              </Button>
              <Button asChild className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-foreground)] px-8 py-6 text-lg">
                <Link href="/auth/register">注册</Link>
              </Button>
            </>
          ) : clientReady && !isLoading && user ? (
            <Button asChild className="bg-primary hover:bg-primary-600 px-8 py-6 text-lg">
              <Link href="/dashboard">进入控制台</Link>
            </Button>
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--color-primary-500)]"></div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--color-card-foreground)]">多种AI模型</h3>
            <p className="text-[var(--color-muted-foreground)] mt-2">
              支持OpenAI、Anthropic等多种模型，只需提供您的API密钥。
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--color-card-foreground)]">云同步功能</h3>
            <p className="text-[var(--color-muted-foreground)] mt-2">
              聊天历史与设置跨设备无缝同步，随时随地恢复工作。
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-[var(--color-card-foreground)]">MCP服务器集成</h3>
            <p className="text-[var(--color-muted-foreground)] mt-2">
              支持自定义工具扩展，增强AI交互能力。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
