import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { AIService, ModelType } from "../services";
import { Loader2 } from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState<ModelType>("claude-3-sonnet-20240229");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [toolVersion, setToolVersion] = useState<"computer_use_20241022" | "computer_use_20250124">("computer_use_20241022");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // 加载保存的设置
  useEffect(() => {
    // 加载API密钥
    const savedApiKey = AIService.getApiKey();
    setApiKey(savedApiKey);

    // 加载模型选择
    const savedModel = AIService.getModel();
    setModel(savedModel);

    // 加载系统提示词
    const savedPrompt = AIService.getSystemPrompt();
    setSystemPrompt(savedPrompt);

    // 加载工具版本
    const savedToolVersion = AIService.getToolVersion();
    setToolVersion(savedToolVersion);

    // 加载主题设置
    setIsDarkMode(theme === "dark");
    setIsSystemTheme(theme === "system");
  }, [theme]);

  // 处理API密钥变更
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  // 处理模型选择变更
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value as ModelType);
  };

  // 处理工具版本变更
  const handleToolVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToolVersion(e.target.value as "computer_use_20241022" | "computer_use_20250124");
  };

  // 处理系统提示词变更
  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(e.target.value);
  };

  // 处理深色模式切换
  const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDark = e.target.checked;
    setIsDarkMode(isDark);
    setIsSystemTheme(false);
    setTheme(isDark ? "dark" : "light");
  };

  // 处理系统主题切换
  const handleSystemThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSystem = e.target.checked;
    setIsSystemTheme(isSystem);
    if (isSystem) {
      setTheme("system");
    } else {
      setTheme(isDarkMode ? "dark" : "light");
    }
  };

  // 重置系统提示词为默认值
  const handleResetSystemPrompt = () => {
    const defaultPrompt = AIService.getSystemPrompt();
    setSystemPrompt(defaultPrompt);
  };

  // 保存设置
  const handleSaveSettings = () => {
    try {
      setSaveStatus("saving");
      
      // 保存API密钥
      AIService.setApiKey(apiKey);
      
      // 保存模型选择
      AIService.setModel(model);
      
      // 保存工具版本
      AIService.setToolVersion(toolVersion);
      
      // 保存系统提示词
      AIService.setSystemPrompt(systemPrompt);
      
      // 显示保存成功状态
      setSaveStatus("saved");
      
      // 3秒后重置状态
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("保存设置失败:", error);
      setSaveStatus("error");
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">设置</h1>
        <button
          onClick={handleSaveSettings}
          disabled={saveStatus === "saving"}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saveStatus === "idle" && "保存设置"}
          {saveStatus === "saving" && (
            <span className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              保存中...
            </span>
          )}
          {saveStatus === "saved" && "已保存"}
          {saveStatus === "error" && "保存失败"}
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">API 配置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="api-key">
                Anthropic API 密钥
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="输入您的 API 密钥"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                如果您还没有API密钥，可以访问 <a href="https://console.anthropic.com/" className="text-primary underline" target="_blank" rel="noopener noreferrer">Anthropic控制台</a> 获取。
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="model">
                Claude 模型版本
              </label>
              <select
                id="model"
                value={model}
                onChange={handleModelChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="tool-version">
                工具版本
              </label>
              <select
                id="tool-version"
                value={toolVersion}
                onChange={handleToolVersionChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="computer_use_20241022">Computer Use 2024-10-22</option>
                <option value="computer_use_20250124">Computer Use 2025-01-24</option>
              </select>
              <p className="mt-1 text-sm text-muted-foreground">
                2025-01-24版本提供更多功能，如三击操作、滚动和按键保持等。
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">AI 配置</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium" htmlFor="system-prompt">
                  系统提示词
                </label>
                <button
                  onClick={handleResetSystemPrompt}
                  className="text-xs text-primary hover:underline"
                >
                  重置为默认
                </button>
              </div>
              <textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={handleSystemPromptChange}
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                系统提示词用于指导AI助手的行为和能力。修改此内容可能会影响AI的响应方式。
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">界面设置</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="dark-mode"
                type="checkbox"
                checked={isDarkMode}
                onChange={handleDarkModeChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm font-medium" htmlFor="dark-mode">
                使用深色模式
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="system-theme"
                type="checkbox"
                checked={isSystemTheme}
                onChange={handleSystemThemeChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm font-medium" htmlFor="system-theme">
                跟随系统主题
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 