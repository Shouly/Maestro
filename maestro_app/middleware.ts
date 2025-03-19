import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 公开路由列表
const publicRoutes = ["/", "/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  // 简单中间件，实际认证会由Clerk组件在客户端处理
  // 这里只做简单的路由处理
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路由除了静态资源
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 