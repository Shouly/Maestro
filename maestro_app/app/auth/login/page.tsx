import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-slate-950">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">登录到 Maestro</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            请使用您的账号登录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full mx-auto",
                  card: "shadow-none p-0 w-full mx-auto",
                  header: "hidden",
                  footer: "hidden"
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            没有账号？{" "}
            <Button variant="link" asChild className="p-0 text-[#0090FF]">
              <Link href="/auth/register">注册</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 