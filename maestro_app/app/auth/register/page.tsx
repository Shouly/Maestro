'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Mail, Lock, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await register(email, password, name);
      if (success) {
        // 注册成功后设置 cookie 供中间件使用
        document.cookie = `maestro_auth=true; path=/; max-age=${60 * 60 * 24 * 30}`; // 30天
        router.push('/dashboard');
      } else {
        setError('注册失败，请重试');
      }
    } catch (err) {
      setError('注册过程中发生错误');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-background overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-info/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <motion.div 
        className="w-full max-w-md space-y-8 relative z-10"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">创建账号</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-info">
              Maestro
            </span>
          </h1>
        </motion.div>

        <Card className="border-2 border-border/20 shadow-xl bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-center">注册 Maestro</CardTitle>
            <CardDescription className="text-center text-base-70">
              创建一个新账号开始使用
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <motion.div 
                className="space-y-4"
                variants={{
                  animate: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="initial"
                animate="animate"
              >
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                >
                  <Label htmlFor="name" className="text-sm font-medium">姓名</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-colors group-focus-within:text-primary" />
                    <Input 
                      id="name"
                      type="text" 
                      placeholder="您的姓名" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 border-2 border-border/20 bg-card/50 backdrop-blur focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                >
                  <Label htmlFor="email" className="text-sm font-medium">邮箱地址</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-colors group-focus-within:text-primary" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-2 border-border/20 bg-card/50 backdrop-blur focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  className="space-y-2"
                  variants={fadeInUp}
                >
                  <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-colors group-focus-within:text-primary" />
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-2 border-border/20 bg-card/50 backdrop-blur focus:border-primary/20 focus:ring-4 focus:ring-primary/10 transition-all"
                      required
                    />
                  </div>
                </motion.div>
              </motion.div>
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    className="p-3 text-sm text-error bg-error/5 border-2 border-error/10 rounded-xl flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="size-1.5 rounded-full bg-error animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div variants={fadeInUp}>
                <Button 
                  type="submit" 
                  className="w-full font-medium bg-gradient-to-r from-primary to-info text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      注册中...
                    </>
                  ) : (
                    <>
                      创建账号
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-4">
            <motion.div 
              className="text-sm text-base-70"
              variants={fadeInUp}
            >
              已有账号？{" "}
              <Link 
                href="/auth/login"
                className="text-primary hover:text-primary/90 hover:underline font-medium transition-colors"
              >
                立即登录
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
} 