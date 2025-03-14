import React, { useState, useEffect } from "react";
import { ChatInterface } from "../components/chat/chat-interface";
import { ToolOutput } from "../components/tools/tool-output";

export function HomePage() {
  const [toolOutput, setToolOutput] = useState<{
    type: "screenshot" | "command" | "text" | "none";
    content: string;
  }>({
    type: "none",
    content: "",
  });

  const [showWelcome, setShowWelcome] = useState(true);

  // 模拟首次访问检测，实际应用中可以使用localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000); // 5秒后自动隐藏欢迎信息

    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-6">欢迎使用 Maestro</h1>
        <p className="text-xl mb-8 max-w-2xl">
          您的AI驱动计算机控制助手，通过自然语言指令让AI代理执行复杂的计算机操作任务。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
          <div className="rounded-lg border p-4 text-left">
            <h2 className="text-lg font-semibold mb-2">屏幕控制</h2>
            <p className="text-sm text-muted-foreground">
              AI可以截取屏幕、移动鼠标、点击按钮，以及执行键盘操作。
            </p>
          </div>
          
          <div className="rounded-lg border p-4 text-left">
            <h2 className="text-lg font-semibold mb-2">命令执行</h2>
            <p className="text-sm text-muted-foreground">
              运行系统命令，管理进程，并查看命令输出结果。
            </p>
          </div>
          
          <div className="rounded-lg border p-4 text-left">
            <h2 className="text-lg font-semibold mb-2">文本编辑</h2>
            <p className="text-sm text-muted-foreground">
              读取、编辑和保存文件，支持多种编程语言的语法高亮。
            </p>
          </div>
        </div>
        
        <button 
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setShowWelcome(false)}
        >
          开始使用
        </button>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2">
      <div className="h-full overflow-hidden rounded-lg border">
        <ChatInterface />
      </div>
      <div className="h-full overflow-hidden rounded-lg border">
        <ToolOutput output={toolOutput.content} type={toolOutput.type} />
      </div>
    </div>
  );
} 