import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 公开路由列表
const publicRoutes = ["/", "/auth/login", "/auth/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // 检查是否为公开路由
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 检查是否有认证信息 - 使用cookie或localStorage模拟
  // 注意：在实际应用中，这种检查应该更加严格和安全
  const hasAuthCookie = req.cookies.has('maestro_auth');
  
  // 如果未认证且不是公开路由，重定向到登录页面
  if (!hasAuthCookie && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路由除了静态资源
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}; 