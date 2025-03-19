'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Cloud, Puzzle, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

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
      {/* 动态背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-info/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gradient-to-r from-success/5 to-warning/5 rounded-full blur-3xl" />
      </div>
      
      <motion.main 
        className="max-w-5xl w-full relative z-10 space-y-16 md:space-y-24"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        {/* 标题区域 */}
        <motion.div 
          className="text-center space-y-8"
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">全新的AI助手体验</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
              Maestro
            </span>{" "}
            <span>AI 助手</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto leading-relaxed">
            统一界面连接多种AI模型，让AI交互更简单、更高效
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
          variants={fadeInUp}
        >
          {clientReady && !isLoading && !user ? (
            <>
              <Link 
                href="/auth/login" 
                className="btn btn-primary btn-lg group w-full sm:w-auto"
              >
                <span>开始使用</span>
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="/auth/register" 
                className="btn btn-secondary btn-lg w-full sm:w-auto"
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
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <div className="animate-pulse size-8 rounded-full bg-gradient-to-r from-primary to-info" />
          )}
        </motion.div>

        {/* 特性展示 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerChildren}
        >
          <motion.div 
            className="card card-hover p-8 space-y-6 group"
            variants={fadeInUp}
          >
            <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center transform transition-transform group-hover:scale-110">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">多种AI模型</h3>
              <p className="text-muted text-lg leading-relaxed">
                支持OpenAI、Anthropic等多种模型，只需提供您的API密钥即可开始使用。
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="card card-hover p-8 space-y-6 group"
            variants={fadeInUp}
          >
            <div className="size-16 rounded-2xl bg-gradient-to-br from-info/10 to-info/5 flex items-center justify-center transform transition-transform group-hover:scale-110">
              <Cloud className="w-8 h-8 text-info" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">云端同步</h3>
              <p className="text-muted text-lg leading-relaxed">
                聊天历史与设置跨设备无缝同步，随时随地恢复您的工作状态。
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="card card-hover p-8 space-y-6 group"
            variants={fadeInUp}
          >
            <div className="size-16 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 flex items-center justify-center transform transition-transform group-hover:scale-110">
              <Puzzle className="w-8 h-8 text-success" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold">扩展能力</h3>
              <p className="text-muted text-lg leading-relaxed">
                通过MCP服务器集成自定义工具，让AI助手的能力得到无限扩展。
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
      </motion.main>
    </div>
  );
}
