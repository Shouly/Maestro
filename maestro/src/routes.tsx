import React, { useEffect, useState } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/main-layout";
import { HomePage } from "./pages/home-page";
import { SettingsPage } from "./pages/settings-page";
import { WelcomePage } from "./pages/welcome-page";

// 创建一个布局组件，用于包装所有页面
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

// 首次访问检测组件
const FirstVisitCheck = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    // 检查用户是否已完成引导流程
    const onboardingCompleted = localStorage.getItem("hasCompletedOnboarding") === "true";
    setHasCompletedOnboarding(onboardingCompleted);
    setLoading(false);
  }, []);

  if (loading) {
    // 加载中状态
    return <div className="flex h-screen items-center justify-center">加载中...</div>;
  }

  // 如果未完成引导，重定向到欢迎页面
  if (!hasCompletedOnboarding) {
    return <Navigate to="/welcome" replace />;
  }

  // 已完成引导，显示子组件
  return <>{children}</>;
};

// 定义路由配置
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FirstVisitCheck>
        <Layout>
          <HomePage />
        </Layout>
      </FirstVisitCheck>
    ),
  },
  {
    path: "/settings",
    element: (
      <FirstVisitCheck>
        <Layout>
          <SettingsPage />
        </Layout>
      </FirstVisitCheck>
    ),
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
]); 