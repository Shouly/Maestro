'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Cloud, Puzzle } from "lucide-react";

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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background overflow-hidden">
      {/* 背景装饰 */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(var(--color-primary), 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(var(--color-primary), 0.03) 0%, transparent 50%)
          `,
          backgroundAttachment: "fixed"
        }}
      />
      
      <main className="max-w-4xl w-full relative z-10 space-y-12 md:space-y-16">
        {/* 标题区域 */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="text-gradient">Maestro</span>{" "}
            <span>AI 助手</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
            统一界面连接多种AI模型，让AI交互更简单、更高效
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          {clientReady && !isLoading && !user ? (
            <>
              <Link 
                href="/auth/login" 
                className="btn btn-primary btn-lg group"
              >
                开始使用
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/auth/register" 
                className="btn btn-outline btn-lg"
              >
                注册账号
              </Link>
            </>
          ) : clientReady && !isLoading && user ? (
            <Link 
              href="/dashboard" 
              className="btn btn-primary btn-lg group"
            >
              进入控制台
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div className="animate-pulse size-8 rounded-full border-2 border-transparent border-t-primary" />
          )}
        </div>

        {/* 特性展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card card-hover p-6 space-y-4">
            <div className="size-12 rounded-lg bg-primary-5 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">多种AI模型</h3>
              <p className="text-muted">
                支持OpenAI、Anthropic等多种模型，只需提供您的API密钥即可开始使用。
              </p>
            </div>
          </div>

          <div className="card card-hover p-6 space-y-4">
            <div className="size-12 rounded-lg bg-primary-5 flex items-center justify-center">
              <Cloud className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">云端同步</h3>
              <p className="text-muted">
                聊天历史与设置跨设备无缝同步，随时随地恢复您的工作状态。
              </p>
            </div>
          </div>

          <div className="card card-hover p-6 space-y-4">
            <div className="size-12 rounded-lg bg-primary-5 flex items-center justify-center">
              <Puzzle className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">扩展能力</h3>
              <p className="text-muted">
                通过MCP服务器集成自定义工具，让AI助手的能力得到无限扩展。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
