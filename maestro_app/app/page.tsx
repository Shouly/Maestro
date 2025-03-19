'use client';

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
    <div className="flex min-h-screen flex-col items-center justify-center p-4" 
         style={{
           background: `radial-gradient(circle at 25% 25%, rgba(var(--color-primary), 0.05) 0%, transparent 50%)`,
           backgroundColor: `rgb(var(--color-background))`,
         }}>
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold" style={{ color: `rgb(var(--color-foreground))` }}>
          <span className="text-gradient">
            Maestro
          </span> AI
        </h1>
        <p className="text-xl" style={{ color: `rgba(var(--color-foreground), 0.8)` }}>
          统一界面连接多种AI模型，简化日常AI交互。
        </p>

        <div className="flex justify-center gap-4 mt-8">
          {clientReady && !isLoading && !user ? (
            <>
              <Link href="/auth/login" className="btn-primary">
                登录
              </Link>
              <Link href="/auth/register" className="btn-secondary">
                注册
              </Link>
            </>
          ) : clientReady && !isLoading && user ? (
            <Link href="/dashboard" className="btn-primary">
              进入控制台
            </Link>
          ) : (
            <div className="animate-pulse" style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "9999px",
              borderTop: `2px solid rgb(var(--color-primary))`,
              borderBottom: `2px solid rgb(var(--color-primary))`,
            }}></div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold">多种AI模型</h3>
            <p className="mt-2" style={{ color: `rgba(var(--color-foreground), 0.8)` }}>
              支持OpenAI、Anthropic等多种模型，只需提供您的API密钥。
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">云同步功能</h3>
            <p className="mt-2" style={{ color: `rgba(var(--color-foreground), 0.8)` }}>
              聊天历史与设置跨设备无缝同步，随时随地恢复工作。
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold">MCP服务器集成</h3>
            <p className="mt-2" style={{ color: `rgba(var(--color-foreground), 0.8)` }}>
              支持自定义工具扩展，增强AI交互能力。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
