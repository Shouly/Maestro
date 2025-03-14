import React from "react";

interface ToolOutputProps {
  output: string;
  type: "screenshot" | "command" | "text" | "none";
}

export function ToolOutput({ output, type }: ToolOutputProps) {
  if (type === "none" || !output) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <div className="text-lg font-semibold mb-2">工具输出</div>
        <div>执行工具后，结果将显示在这里</div>
      </div>
    );
  }

  const timestamp = new Date().toLocaleTimeString();

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex justify-between items-center">
        <div className="font-semibold">
          {type === "screenshot" ? "屏幕截图" : type === "command" ? "命令输出" : "文本输出"}
        </div>
        <div className="text-xs text-muted-foreground">{timestamp}</div>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {type === "screenshot" ? (
          <div className="flex flex-col items-center">
            <img 
              src={`data:image/png;base64,${output}`} 
              alt="屏幕截图" 
              className="max-w-full border rounded-md shadow-sm" 
            />
            <div className="mt-2 text-xs text-muted-foreground">
              点击图片可查看原始大小
            </div>
          </div>
        ) : type === "command" ? (
          <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm font-mono">
            {output}
          </pre>
        ) : (
          <div className="whitespace-pre-wrap">{output}</div>
        )}
      </div>
    </div>
  );
} 