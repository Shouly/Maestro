'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义用户类型
type User = {
  id: string;
  email: string;
  name: string;
} | null;

// 定义认证上下文类型
type AuthContextType = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 在组件挂载时检查本地存储中是否有用户
  useEffect(() => {
    const storedUser = localStorage.getItem('maestro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // 登录函数
  const login = async (email: string, password: string): Promise<boolean> => {
    // 这里是一个简化的登录逻辑，实际项目中应连接到后端API
    // 目前仅做前端模拟，密码为 "password"
    if (password === 'password') {
      const newUser = { id: '1', email, name: email.split('@')[0] };
      setUser(newUser);
      localStorage.setItem('maestro_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  // 注册函数
  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    // 简化的注册逻辑
    const newUser = { id: Date.now().toString(), email, name };
    setUser(newUser);
    localStorage.setItem('maestro_user', JSON.stringify(newUser));
    return true;
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('maestro_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 使用认证的钩子
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 