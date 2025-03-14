import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { AIService, ModelType } from "../services";
import { Loader2 } from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [imageLimit, setImageLimit] = useState<number>(3);
  const [thinkingBudget, setThinkingBudget] = useState<number | undefined>(undefined);
  const [promptCaching, setPromptCaching] = useState<boolean>(true);
  const [tokenEfficientTools, setTokenEfficientTools] = useState<boolean>(true);

  // 加载保存的设置
  useEffect(() => {
    // 加载API密钥
    const savedApiKey = AIService.getApiKey();
    setApiKey(savedApiKey);

    // 加载系统提示词
    const savedPrompt = AIService.getSystemPrompt();
    setSystemPrompt(savedPrompt);

    // 加载主题设置
    setIsDarkMode(theme === "dark");
    setIsSystemTheme(theme === "system");

    // 加载图像数量限制
    const savedImageLimit = localStorage.getItem("imageLimit");
    if (savedImageLimit) {
      setImageLimit(parseInt(savedImageLimit, 10));
    }
    
    // 加载思考预算
    const savedThinkingBudget = localStorage.getItem("thinkingBudget");
    if (savedThinkingBudget) {
      setThinkingBudget(parseInt(savedThinkingBudget, 10));
    }
    
    // 加载提示缓存设置
    const savedPromptCaching = localStorage.getItem("promptCaching");
    if (savedPromptCaching) {
      setPromptCaching(savedPromptCaching === "true");
    }
    
    // 加载token高效工具设置
    const savedTokenEfficientTools = localStorage.getItem("enableTokenEfficientTools");
    if (savedTokenEfficientTools) {
      setTokenEfficientTools(savedTokenEfficientTools === "true");
    }
  }, [theme]);

  // 处理API密钥变更
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
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

  // 处理图像限制变化
  const handleImageLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setImageLimit(value);
    localStorage.setItem("imageLimit", value.toString());
  };

  // 处理思考预算变化
  const handleThinkingBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
    setThinkingBudget(value);
    if (value === undefined) {
      localStorage.removeItem("thinkingBudget");
    } else {
      localStorage.setItem("thinkingBudget", value.toString());
    }
  };

  // 处理提示缓存变化
  const handlePromptCachingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setPromptCaching(value);
    localStorage.setItem("promptCaching", value.toString());
  };

  // 处理token高效工具变化
  const handleTokenEfficientToolsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setTokenEfficientTools(value);
    AIService.setEnableTokenEfficientTools(value);
  };

  // 保存设置
  const handleSaveSettings = () => {
    try {
      setSaveStatus("saving");
      
      // 保存API密钥
      AIService.setApiKey(apiKey);
      
      // 保存系统提示词
      AIService.setSystemPrompt(systemPrompt);
      
      // 保存token高效工具设置
      AIService.setEnableTokenEfficientTools(tokenEfficientTools);
      
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
              <label className="block text-sm font-medium mb-1">
                Claude 模型版本
              </label>
              <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-muted-foreground">
                Claude 3.7 Sonnet Latest
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                工具版本
              </label>
              <div className="w-full rounded-md border border-input bg-background px-3 py-2 text-muted-foreground">
                Computer Use 2025-01-24
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                此版本提供更多功能，如三击操作、滚动和按键保持等。
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
        
        <div className="rounded-lg border p-4">
          <h2 className="text-xl font-semibold mb-4">高级设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">保留最近的图像数量</label>
              <input
                type="number"
                value={imageLimit}
                onChange={handleImageLimitChange}
                min="0"
                max="20"
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                设置为0表示不限制图像数量。较小的值可以减少token消耗，但可能会丢失历史上下文。
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">思考预算（tokens）</label>
              <input
                type="number"
                value={thinkingBudget === undefined ? "" : thinkingBudget}
                onChange={handleThinkingBudgetChange}
                min="0"
                max="4000"
                placeholder="留空表示不启用思考"
                className="w-full p-2 border rounded"
              />
              <p className="text-sm text-gray-500 mt-1">
                设置思考预算可以让AI在回答前进行思考。较大的值可以提高回答质量，但会增加token消耗。
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="prompt-caching"
                type="checkbox"
                checked={promptCaching}
                onChange={handlePromptCachingChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm font-medium" htmlFor="prompt-caching">
                启用提示缓存
              </label>
              <p className="text-sm text-gray-500 ml-2">
                启用提示缓存可以减少token消耗，但可能会影响图像过滤功能。
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                id="token-efficient-tools"
                type="checkbox"
                checked={tokenEfficientTools}
                onChange={handleTokenEfficientToolsChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label className="ml-2 block text-sm font-medium" htmlFor="token-efficient-tools">
                启用token高效工具（仅适用于Claude 3.7 Sonnet）
              </label>
              <p className="text-sm text-gray-500 ml-2">
                启用token高效工具可以减少token消耗，提高响应速度。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 