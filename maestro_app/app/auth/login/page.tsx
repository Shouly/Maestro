'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        // 登录成功后设置 cookie 供中间件使用
        document.cookie = `maestro_auth=true; path=/; max-age=${60 * 60 * 24 * 30}`; // 30天
        router.push('/dashboard');
      } else {
        setError('邮箱或密码不正确');
      }
    } catch (err) {
      setError('登录过程中发生错误');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-[var(--color-background)] to-[var(--color-muted)]">
      <Card className="w-full max-w-md shadow-lg bg-[var(--color-card)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[var(--color-card-foreground)]">登录到 Maestro</CardTitle>
          <CardDescription className="text-[var(--color-muted-foreground)]">
            请使用您的账号登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-[var(--color-muted-foreground)]">提示：测试环境下密码为 "password"</p>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            没有账号？{" "}
            <Button variant="link" asChild className="p-0 text-primary">
              <Link href="/auth/register">注册</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 