import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并并优化类名，解决与tailwind冲突问题
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 创建从CSS变量构建RGB颜色值的工具函数
 */
export function makeRgbColor(variable: string, alpha: number = 1) {
  return `rgba(var(--${variable}), ${alpha})`;
}

/**
 * 判断当前是否在客户端
 */
export const isClient = typeof window !== "undefined";

/**
 * 判断当前是否为深色模式（用于客户端条件渲染）
 */
export function isDarkMode() {
  if (!isClient) return false;
  return document.documentElement.classList.contains("dark");
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化日期
 */
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * 随机ID生成器
 */
export function generateId(length: number = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}
