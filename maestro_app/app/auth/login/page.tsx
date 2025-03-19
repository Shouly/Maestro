'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await login(email, password);

      if (success) {
        document.cookie = `maestro_auth=true; path=/; max-age=${60 * 60 * 24 * 30}`; // 30天
        router.push('/dashboard');
      } else {
        setError('邮箱或密码不正确');
      }
    } catch (err) {
      setError('登录过程中发生错误，请稍后重试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            <span className="text-gradient">Maestro</span>
          </h1>
        </div>

        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl font-semibold text-center">欢迎回来</CardTitle>
            <CardDescription className="text-center text-muted">
              请登录您的账号继续使用
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">邮箱地址</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <Input 
                    id="password"
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="p-3 text-sm text-error bg-error/10 border border-error/20 rounded-lg flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-error animate-pulse" />
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    登录中...
                  </>
                ) : (
                  <>
                    登录
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted">
              没有账号？{" "}
              <Link 
                href="/auth/register"
                className="text-primary hover:text-primary/90 hover:underline font-medium transition-colors"
              >
                立即注册
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 