import React from "react";

interface ToolOutputProps {
  output: string;
  type: "screenshot" | "command" | "text" | "none";
}

export function ToolOutput({ output, type }: ToolOutputProps) {
  if (type === "none" || !output) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        工具输出将显示在这里
      </div>
    );
  }

  if (type === "screenshot") {
    return (
      <div className="h-full overflow-auto p-4">
        <img src={output} alt="屏幕截图" className="max-w-full" />
      </div>
    );
  }

  if (type === "command") {
    return (
      <div className="h-full overflow-auto p-4">
        <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
          {output}
        </pre>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-4">
      <div className="whitespace-pre-wrap">{output}</div>
    </div>
  );
} 