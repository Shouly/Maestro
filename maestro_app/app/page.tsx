import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-slate-950">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">Maestro AI</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            您的统一 AI 聊天助手
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-slate-700 dark:text-slate-300">
            将多个 AI 模型集成到一个强大的界面，简化您的 AI 工作流程。
          </p>
          <div className="flex justify-center">
            <img 
              src="https://via.placeholder.com/150?text=Maestro" 
              alt="Maestro Logo" 
              className="h-24 w-auto" 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild className="bg-[#0090FF] hover:bg-blue-600">
            <Link href="/auth/login">登录</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/register">注册</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
